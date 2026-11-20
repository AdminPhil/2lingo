"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq, isNull } from "drizzle-orm";

import * as schemaV2 from "@/db/schema.v2";
import { hashQrBadgeToken, isValidQrBadgeTokenFormat } from "@/lib/v2/qr-tokens";

/**
 * CroLingo v2 Passwordless QR Login Token Exchange
 * Exchanges a scanned opaque badge token (`clqr_...`) for a one-time Clerk Sign-In Token
 * (`strategy: "ticket"`), so scanning or printing a QR badge NEVER touches or resets passwords.
 */
export async function exchangeQrTokenForSignInTicket(rawToken: string): Promise<{
  ticket?: string;
  error?: string;
}> {
  if (!isValidQrBadgeTokenFormat(rawToken)) {
    return { error: "Invalid QR badge token format." };
  }

  const dbUrl = (process.env.DATABASE_URL_V2 || process.env.DATABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  if (!dbUrl || dbUrl.includes("placeholder@localhost")) {
    return { error: "Authentication service is temporarily unavailable." };
  }

  const tokenHash = hashQrBadgeToken(rawToken);

  try {
    const sql = neon(dbUrl);
    // @ts-ignore - neon-http generic variance with drizzle-orm 0.30
    const dbV2 = drizzle(sql, { schema: schemaV2 });

    const tokenRow = await dbV2.query.qrLoginTokens.findFirst({
      where: and(
        eq(schemaV2.qrLoginTokens.tokenHash, tokenHash),
        isNull(schemaV2.qrLoginTokens.revokedAt)
      ),
    });

    if (!tokenRow) {
      return { error: "This QR badge is expired or has been revoked. Ask your parent or teacher for a fresh badge." };
    }

    const clerk = await clerkClient();
    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: tokenRow.userId,
      expiresInSeconds: 300,
    });

    return { ticket: signInToken.token };
  } catch {
    return { error: "Unable to verify QR badge right now. Please try again." };
  }
}
