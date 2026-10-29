import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { pods, podMembers, userProgress } from "@/db/schema";
import { generateRandomPodCode } from "@/lib/pod-code";

type Props = {
  searchParams?: {
    role?: string;
    join?: string;
    intent?: string;
  };
};

const WelcomePage = async ({ searchParams }: Props) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const roleParam = searchParams?.role || searchParams?.intent;

  // 1. Teacher Onboarding Intent
  if (roleParam === "teacher") {
    // Set userProgress role to 'parent' (educator administrative role)
    const existingProgress = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, userId),
    });

    if (existingProgress) {
      await db
        .update(userProgress)
        .set({
          role: "parent",
          userName: user?.firstName || user?.username || existingProgress.userName || "Teacher",
          userImageSrc: user?.imageUrl || existingProgress.userImageSrc || "/mascot.png",
        })
        .where(eq(userProgress.userId, userId));
    } else {
      await db.insert(userProgress).values({
        userId,
        activeCourseId: 1,
        userName: user?.firstName || user?.username || "Teacher",
        userImageSrc: user?.imageUrl || "/mascot.png",
        role: "parent",
      });
    }

    // Check if teacher already owns a pod
    const ownedPod = await db.query.pods.findFirst({
      where: eq(pods.ownerId, userId),
    });

    if (!ownedPod) {
      const teacherName = user?.firstName || user?.username || "Classroom";
      const [newPod] = await db
        .insert(pods)
        .values({
          name: `${teacherName}'s Classroom Team`,
          type: "classroom",
          inviteCode: generateRandomPodCode(),
          ownerId: userId,
          targetXp: 5000,
          currentXp: 0,
          celebrationUnlocked: false,
          weekNumber: 1,
        })
        .returning();

      if (newPod) {
        await db.insert(podMembers).values({
          podId: newPod.id,
          userId,
          role: "owner",
        });
      }
    }

    redirect("/admin?wizard=classroom");
  }

  // 2. Parent Onboarding Intent
  if (roleParam === "parent") {
    const existingProgress = await db.query.userProgress.findFirst({
      where: eq(userProgress.userId, userId),
    });

    if (existingProgress) {
      await db
        .update(userProgress)
        .set({
          role: "parent",
          userName: user?.firstName || user?.username || existingProgress.userName || "Parent",
          userImageSrc: user?.imageUrl || existingProgress.userImageSrc || "/mascot.png",
        })
        .where(eq(userProgress.userId, userId));
    } else {
      await db.insert(userProgress).values({
        userId,
        activeCourseId: 1,
        userName: user?.firstName || user?.username || "Parent",
        userImageSrc: user?.imageUrl || "/mascot.png",
        role: "parent",
      });
    }

    // Check if parent already owns a pod
    const ownedPod = await db.query.pods.findFirst({
      where: eq(pods.ownerId, userId),
    });

    if (!ownedPod) {
      const parentName = user?.firstName || user?.username || "Family";
      const [newPod] = await db
        .insert(pods)
        .values({
          name: `${parentName}'s Family Team`,
          type: "family",
          inviteCode: generateRandomPodCode(),
          ownerId: userId,
          targetXp: 1000,
          currentXp: 0,
          celebrationUnlocked: false,
          weekNumber: 1,
        })
        .returning();

      if (newPod) {
        await db.insert(podMembers).values({
          podId: newPod.id,
          userId,
          role: "owner",
        });
      }
    }

    redirect("/admin?wizard=family");
  }

  // 3. Fallback / Join Preservation
  if (searchParams?.join) {
    redirect(`/learn?join=${encodeURIComponent(searchParams.join)}`);
  }

  const currentProgress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    columns: { role: true },
  });

  if (currentProgress?.role === "parent") {
    redirect("/admin");
  }

  redirect("/learn");
};

export default WelcomePage;
