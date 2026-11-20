import { describe, it, expect } from "vitest";
import {
  QR_TOKEN_PREFIX,
  generateQrBadgeToken,
  hashQrBadgeToken,
  isValidQrBadgeTokenFormat,
  buildQrBadgeLoginUrl,
} from "@/lib/v2/qr-tokens";

describe("lib/v2/qr-tokens.ts - Passwordless QR Badge Token Security", () => {
  it("generates unique prefixed tokens with deterministic SHA-256 hashes", () => {
    const first = generateQrBadgeToken();
    const second = generateQrBadgeToken();

    expect(first.rawToken.startsWith(QR_TOKEN_PREFIX)).toBe(true);
    expect(first.rawToken).not.toBe(second.rawToken);
    expect(first.tokenHash).toHaveLength(64);
    expect(hashQrBadgeToken(first.rawToken)).toBe(first.tokenHash);
    expect(hashQrBadgeToken(`  ${first.rawToken}  `)).toBe(first.tokenHash);
  });

  it("validates token formats and rejects malformed/short tokens", () => {
    const { rawToken } = generateQrBadgeToken();
    expect(isValidQrBadgeTokenFormat(rawToken)).toBe(true);
    expect(isValidQrBadgeTokenFormat("short")).toBe(false);
    expect(isValidQrBadgeTokenFormat("clqr_tooshort")).toBe(false);
    expect(isValidQrBadgeTokenFormat("")).toBe(false);
  });

  it("builds passwordless QR login URLs without plaintext credentials", () => {
    const { rawToken } = generateQrBadgeToken();
    const url = buildQrBadgeLoginUrl("https://2lingo.onrender.com/", rawToken);

    expect(url).toBe(`https://2lingo.onrender.com/qr-login?token=${encodeURIComponent(rawToken)}`);
    expect(url).not.toContain("&p=");
    expect(url).not.toContain("?u=");
  });
});
