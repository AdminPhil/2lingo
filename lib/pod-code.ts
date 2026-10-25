export const POD_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const AMBIGUOUS_CHARACTERS = ["0", "O", "1", "I"] as const;

/**
 * Generates a clean random pod invite code excluding ambiguous characters (0, O, 1, I).
 * Default length is 6 characters.
 */
export function generateRandomPodCode(length: number = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += POD_CODE_ALPHABET.charAt(Math.floor(Math.random() * POD_CODE_ALPHABET.length));
  }
  return code;
}

/**
 * Validates whether a given code consists solely of unambiguous pod alphabet characters
 * and meets the expected length requirements (3 to 10 characters).
 */
export function isValidPodCode(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false;
  }
  if (code.length < 3 || code.length > 10) {
    return false;
  }
  return /^[A-HJ-NP-Z2-9]+$/.test(code);
}
