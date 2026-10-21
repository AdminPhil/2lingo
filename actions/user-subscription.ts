"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";
import { userSubscription } from "@/db/schema";

const returnUrl = absoluteUrl("/shop");

// Toggle unlimited hearts directly for kids without needing Stripe payments
export const toggleKidsUnlimitedHearts = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingSubscription = await getUserSubscription();

  if (existingSubscription?.isActive) {
    // Deactivate by setting expiration in the past
    await db.update(userSubscription).set({
      stripeCurrentPeriodEnd: new Date(0),
    }).where(eq(userSubscription.userId, userId));
  } else {
    // Activate for 10 years
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 10);

    const record = await db.query.userSubscription.findFirst({
      where: eq(userSubscription.userId, userId),
    });

    if (record) {
      await db.update(userSubscription).set({
        stripePriceId: "kids_super_star",
        stripeCurrentPeriodEnd: farFuture,
      }).where(eq(userSubscription.userId, userId));
    } else {
      await db.insert(userSubscription).values({
        userId,
        stripeCustomerId: `kid_${userId}`,
        stripeSubscriptionId: `sub_kid_${userId}`,
        stripePriceId: "kids_super_star",
        stripeCurrentPeriodEnd: farFuture,
      });
    }
  }

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};

export const createStripeUrl = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // If no Stripe API key is set, automatically activate kid mode
  if (!process.env.STRIPE_API_KEY) {
    await toggleKidsUnlimitedHearts();
    return { data: returnUrl };
  }

  const existingSubscription = await getUserSubscription();

  if (existingSubscription && existingSubscription.stripeCustomerId && !existingSubscription.stripeCustomerId.startsWith("kid_")) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: existingSubscription.stripeCustomerId,
      return_url: returnUrl,
    });

    return { data: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "Lingo Pro",
            description: "Unlimited Hearts",
          },
          unit_amount: 2000,
          recurring: {
            interval: "month",
          },
        },
      },
    ],
    metadata: {
      userId,
    },
    success_url: returnUrl,
    cancel_url: returnUrl,
  });

  return { data: stripeSession.url };
};
