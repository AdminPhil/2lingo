export const CLASSROOM_AVATARS = [
  { label: "Paško", src: "/avatars/pasko.png" },
  { label: "Luka", src: "/avatars/luka.png" },
  { label: "Mia", src: "/avatars/mia.png" },
  { label: "Matija", src: "/avatars/matija.png" },
  { label: "Roko", src: "/avatars/roko.png" },
  { label: "Delfi", src: "/avatars/delfi.png" },
] as const;

export const CLASSROOM_XP_TIERS = [
  {
    targetXp: 3000,
    label: "Small Group",
    description: "5–10 students • Weekend Croatian School",
  },
  {
    targetXp: 5000,
    label: "Standard Class",
    description: "11–20 students • Heritage Classroom",
  },
  {
    targetXp: 10000,
    label: "Large Class",
    description: "21–35 students • Full Elementary Class",
  },
] as const;

export interface ClassroomRosterDraft {
  id: string;
  name: string;
  username: string;
  password: string;
  avatar: string;
}

/**
 * Normalizes Croatian diacritics (č, ć, š, ž, đ -> c, c, s, z, d) and strips non-alphanumeric characters.
 */
export function normalizeCroatianUsernameToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Generates a collision-free, Clerk-valid username (4–25 chars) from a student display name and pod invite code.
 */
export function buildClassroomUsername(
  fullName: string,
  inviteCode: string,
  usedUsernames: Set<string>
): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .map(normalizeCroatianUsernameToken)
    .filter(Boolean);

  const firstToken = parts[0] || "ucenik";
  const secondInitial = parts.length > 1 ? parts[parts.length - 1].slice(0, 1) : "";
  const codeSuffix = normalizeCroatianUsernameToken(inviteCode).slice(0, 3) || "hr";

  let base = secondInitial
    ? `${firstToken}_${secondInitial}_${codeSuffix}`
    : `${firstToken}_${codeSuffix}`;

  if (base.length < 4) {
    base = `${base}hr1`;
  }
  if (base.length > 22) {
    base = base.slice(0, 22);
  }

  let candidate = base;
  let counter = 2;
  while (usedUsernames.has(candidate)) {
    candidate = `${base}${counter}`;
    counter++;
  }

  usedUsernames.add(candidate);
  return candidate;
}

/**
 * Generates a kid-friendly classroom password (at least 6 chars) from the student's first name.
 */
export function buildClassroomPassword(fullName: string, index: number): string {
  const firstToken =
    normalizeCroatianUsernameToken(fullName.trim().split(/\s+/)[0] || "") || "ucenik";
  const prefix = firstToken.slice(0, 8);
  const pin = String(101 + index);
  const candidate = `${prefix}${pin}`;
  return candidate.length >= 6 ? candidate : `${candidate}hr`;
}

/**
 * Parses a multi-line or comma-separated bulk list of student names into up to `maxStudents` (default 35)
 * ready-to-provision classroom roster rows with Croatian diacritic-safe usernames and round-robin avatars.
 */
export function parseBulkClassroomRoster(
  rawInput: string,
  inviteCode: string = "HRVAT1",
  maxStudents: number = 35
): ClassroomRosterDraft[] {
  const rawNames = rawInput
    .split(/[\r\n,;]+/)
    .map((line) => line.replace(/^\s*\d+[\.\)\-]\s*/, "").trim())
    .filter((line) => line.length >= 2)
    .slice(0, maxStudents);

  const usedUsernames = new Set<string>();

  return rawNames.map((name, idx) => {
    const username = buildClassroomUsername(name, inviteCode, usedUsernames);
    const password = buildClassroomPassword(name, idx);
    const avatar = CLASSROOM_AVATARS[idx % CLASSROOM_AVATARS.length].src;

    return {
      id: `student-${idx + 1}`,
      name,
      username,
      password,
      avatar,
    };
  });
}

/**
 * Formats provisioned classroom students as a downloadable CSV string for teacher gradebooks.
 */
export function formatClassroomRosterCsv(
  students: Array<{
    name: string;
    username: string;
    password: string;
    inviteCode: string;
  }>,
  origin: string = "https://2lingo.onrender.com"
): string {
  const header = "Student Name,Username,Password / PIN,Class Code,Direct Login Link";
  const rows = students.map((s) => {
    const safeName = `"${s.name.replace(/"/g, '""')}"`;
    const link = `${origin}/kid-login?u=${encodeURIComponent(s.username)}&c=${encodeURIComponent(s.inviteCode)}`;
    return `${safeName},${s.username},${s.password},${s.inviteCode},${link}`;
  });
  return [header, ...rows].join("\n");
}
