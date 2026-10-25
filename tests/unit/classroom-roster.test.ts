import { describe, it, expect } from "vitest";
import {
  normalizeCroatianUsernameToken,
  buildClassroomUsername,
  buildClassroomPassword,
  parseBulkClassroomRoster,
  formatClassroomRosterCsv,
  CLASSROOM_AVATARS,
} from "@/lib/classroom-roster";

describe("Classroom Roster Parser & Utilities (CR-069)", () => {
  it("normalizes Croatian diacritics (č, ć, š, ž, đ) into ASCII-safe tokens", () => {
    expect(normalizeCroatianUsernameToken("Luka Kovačić")).toBe("lukakovacic");
    expect(normalizeCroatianUsernameToken("Ana-Marija Horvat")).toBe("anamarijahorvat");
    expect(normalizeCroatianUsernameToken("Stjepan Radić")).toBe("stjepanradic");
    expect(normalizeCroatianUsernameToken("Đurđica Šimić-Župan")).toBe("durdicasimiczupan");
  });

  it("generates collision-free usernames between 4 and 25 characters", () => {
    const used = new Set<string>();
    const u1 = buildClassroomUsername("Luka Kovačić", "HRVAT3", used);
    const u2 = buildClassroomUsername("Luka Knežević", "HRVAT3", used);
    const u3 = buildClassroomUsername("Luka", "HRVAT3", used);

    expect(u1).toBe("luka_k_hrv");
    expect(u2).toBe("luka_k_hrv2");
    expect(u3).toBe("luka_hrv");
    expect(u1.length).toBeGreaterThanOrEqual(4);
    expect(u2.length).toBeLessThanOrEqual(25);
  });

  it("generates kid-friendly passwords of at least 6 characters", () => {
    const p1 = buildClassroomPassword("Luka Kovačić", 0);
    const p2 = buildClassroomPassword("Mia", 4);
    expect(p1).toBe("luka101");
    expect(p2).toBe("mia105");
    expect(p1.length).toBeGreaterThanOrEqual(6);
    expect(p2.length).toBeGreaterThanOrEqual(6);
  });

  it("parses multi-line and comma-separated student lists with round-robin Croatian avatars", () => {
    const raw = `
      1. Luka Kovačić
      2. Mia Horvat
      3. Stjepan Radić, Ana Babić; Marko Perić
      4. Ivana Božić
      5. Petar Jurić
    `;
    const roster = parseBulkClassroomRoster(raw, "ZAGREB");

    expect(roster).toHaveLength(7);
    expect(roster[0].name).toBe("Luka Kovačić");
    expect(roster[0].username).toBe("luka_k_zag");
    expect(roster[0].avatar).toBe(CLASSROOM_AVATARS[0].src);
    expect(roster[5].avatar).toBe(CLASSROOM_AVATARS[5].src);
    // 7th student wraps around to Paško
    expect(roster[6].avatar).toBe(CLASSROOM_AVATARS[0].src);
  });

  it("enforces maxStudents cap (default 35)", () => {
    const fortyLines = Array.from({ length: 40 }, (_, i) => `Učenik Broj ${i + 1}`).join("\n");
    const roster = parseBulkClassroomRoster(fortyLines, "SKOLA1");
    expect(roster).toHaveLength(35);
  });

  it("formats provisioned students into a valid CSV string", () => {
    const csv = formatClassroomRosterCsv(
      [
        {
          name: "Luka Kovačić",
          username: "luka_k_hrv",
          password: "luka101",
          inviteCode: "HRVAT3",
        },
      ],
      "https://2lingo.onrender.com"
    );

    expect(csv).toContain("Student Name,Username,Password / PIN,Class Code,Direct Login Link");
    expect(csv).toContain('"Luka Kovačić",luka_k_hrv,luka101,HRVAT3,https://2lingo.onrender.com/kid-login?u=luka_k_hrv&c=HRVAT3');
  });
});
