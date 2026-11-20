import crypto from "crypto";

/**
 * CroLingo v2 Passwordless QR Login Token Utilities
 * Generates cryptographically strong opaque badge tokens and stores ONLY
 * their SHA-256 hash in Postgres (`qr_login_tokens`), eliminating plaintext
 * passwords in QR URLs and preventing silent Clerk password overwrites.
 */

export const QR_TOKEN_PREFIX = "clqr_";

export function generateQrBadgeToken(): { rawToken: string; tokenHash: string } {
  const randomPart = crypto.randomBytes(24).toString("base64url");
  const rawToken = `${QR_TOKEN_PREFIX}${randomPart}`;
  const tokenHash = hashQrBadgeToken(rawToken);
  return { rawToken, tokenHash };
}

export function hashQrBadgeToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken.trim()).digest("hex");
}

export function isValidQrBadgeTokenFormat(rawToken: string): boolean {
  if (!rawToken || typeof rawToken !== "string") return false;
  const trimmed = rawToken.trim();
  return trimmed.startsWith(QR_TOKEN_PREFIX) && trimmed.length >= QR_TOKEN_PREFIX.length + 20;
}

export function buildQrBadgeLoginUrl(origin: string, rawToken: string): string {
  const cleanOrigin = origin.replace(/\/+$/, "");
  return `${cleanOrigin}/qr-login?token=${encodeURIComponent(rawToken)}`;
}
