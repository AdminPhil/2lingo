import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@clerk/nextjs", async () => {
  const mockClerk = await import("@/tests/mocks/clerk");
  return {
    ...mockClerk,
  };
});

vi.mock("@/db/drizzle", async () => {
  const { mockDb } = await import("@/tests/mocks/drizzle");
  return {
    __esModule: true,
    default: mockDb,
  };
});

import { setMockAuth, resetMockClerk } from "@/tests/mocks/clerk";
import { resetMockDb, store } from "@/tests/mocks/drizzle";
import {
  adminRefillHearts,
  adminProtectStreak,
  adminAwardPraiseXp,
} from "@/actions/admin-overrides";

describe("Server Action Security & RBAC Integration Layer", () => {
  beforeEach(() => {
    resetMockClerk();

    // Setup base mock database fixtures
    resetMockDb({
      pods: [
        {
          id: 1,
          name: "Horvat Family",
          type: "family",
          inviteCode: "HORVAT",
          ownerId: "parent_horvat",
          targetXp: 1000,
          currentXp: 200,
          celebrationUnlocked: false,
          weekNumber: 1,
        },
        {
          id: 2,
          name: "Kovacevic Family",
          type: "family",
          inviteCode: "KOVACE",
          ownerId: "parent_kovacevic",
          targetXp: 1000,
          currentXp: 100,
          celebrationUnlocked: false,
          weekNumber: 1,
        },
      ],
      podMembers: [
        {
          id: 1,
          podId: 1,
          userId: "parent_horvat",
          role: "admin",
          joinedAt: new Date(),
        },
        {
          id: 2,
          podId: 1,
          userId: "child_luka",
          role: "member",
          joinedAt: new Date(),
        },
        {
          id: 3,
          podId: 2,
          userId: "parent_kovacevic",
          role: "admin",
          joinedAt: new Date(),
        },
        {
          id: 4,
          podId: 2,
          userId: "child_mia",
          role: "member",
          joinedAt: new Date(),
        },
      ],
      userProgress: [
        {
          userId: "parent_horvat",
          userName: "Ana Horvat",
          userImageSrc: "/avatars/parent.png",
          activeCourseId: 1,
          hearts: 5,
          points: 500,
          heartsUsed: 0,
          streak: 10,
          role: "parent",
        },
        {
          userId: "parent_kovacevic",
          userName: "Ivan Kovacevic",
          userImageSrc: "/avatars/parent.png",
          activeCourseId: 1,
          hearts: 5,
          points: 300,
          heartsUsed: 0,
          streak: 5,
          role: "parent",
        },
        {
          userId: "child_luka",
          userName: "Luka Horvat",
          userImageSrc: "/avatars/luka.png",
          activeCourseId: 1,
          hearts: 1,
          points: 120,
          heartsUsed: 4,
          streak: 3,
          role: "learner",
        },
        {
          userId: "child_mia",
          userName: "Mia Kovacevic",
          userImageSrc: "/avatars/mia.png",
          activeCourseId: 1,
          hearts: 2,
          points: 250,
          heartsUsed: 3,
          streak: 7,
          role: "learner",
        },
        {
          userId: "learner_stranger",
          userName: "Stranger Learner",
          userImageSrc: "/avatars/stranger.png",
          activeCourseId: 1,
          hearts: 3,
          points: 50,
          heartsUsed: 2,
          streak: 1,
          role: "learner",
        },
      ],
    });
  });

  describe("1. Unauthenticated Callers (userId: null)", () => {
    beforeEach(() => {
      setMockAuth(null);
    });

    it("rejects adminRefillHearts with an Unauthorized exception", async () => {
      await expect(adminRefillHearts("child_luka")).rejects.toThrow("Unauthorized");
    });

    it("rejects adminProtectStreak with an Unauthorized exception", async () => {
      await expect(adminProtectStreak("child_luka")).rejects.toThrow("Unauthorized");
    });

    it("rejects adminAwardPraiseXp with an Unauthorized exception", async () => {
      await expect(adminAwardPraiseXp("child_luka", 50, "Good job")).rejects.toThrow("Unauthorized");
    });
  });

  describe("2. Authenticated Non-Admin / Learners (role: 'learner')", () => {
    beforeEach(() => {
      setMockAuth("learner_stranger");
    });

    it("rejects learner calling adminRefillHearts with an Unauthorized exception", async () => {
      await expect(adminRefillHearts("child_luka")).rejects.toThrow("Unauthorized");
    });

    it("rejects learner calling adminProtectStreak with an Unauthorized exception", async () => {
      await expect(adminProtectStreak("child_luka")).rejects.toThrow("Unauthorized");
    });

    it("rejects learner calling adminAwardPraiseXp with an Unauthorized exception", async () => {
      await expect(adminAwardPraiseXp("child_luka", 50, "Hacking XP")).rejects.toThrow("Unauthorized");
    });
  });

  describe("3. Pod Owner Scoping & Isolation Boundary", () => {
    beforeEach(() => {
      // Authenticated as parent_horvat (owner of Pod 1: Horvat Family)
      setMockAuth("parent_horvat");
    });

    it("blocks parent from refilling hearts of a child in another family pod", async () => {
      // child_mia belongs to Pod 2 (Kovacevic Family)
      const res = await adminRefillHearts("child_mia");
      expect(res).toEqual({
        error: "You can only manage learners inside your own family circle.",
      });

      // Assert hearts remain unchanged
      const mia = store.userProgress.find((u) => u.userId === "child_mia");
      expect(mia?.hearts).toBe(2);
    });

    it("blocks parent from protecting streak of a child in another family pod", async () => {
      const res = await adminProtectStreak("child_mia");
      expect(res).toEqual({
        error: "You can only manage learners inside your own family circle.",
      });

      // Assert streak remains unchanged
      const mia = store.userProgress.find((u) => u.userId === "child_mia");
      expect(mia?.streak).toBe(7);
    });

    it("blocks parent from awarding praise XP to a child in another family pod", async () => {
      const res = await adminAwardPraiseXp("child_mia", 100, "Nice try");
      expect(res).toEqual({
        error: "You can only manage learners inside your own family circle.",
      });

      // Assert points remain unchanged
      const mia = store.userProgress.find((u) => u.userId === "child_mia");
      expect(mia?.points).toBe(250);
    });
  });

  describe("4. Authorized Parent Managing Own Child in Family Pod", () => {
    beforeEach(() => {
      setMockAuth("parent_horvat");
    });

    it("successfully refills hearts to 5 for child in own pod", async () => {
      const initialLuka = store.userProgress.find((u) => u.userId === "child_luka");
      expect(initialLuka?.hearts).toBe(1);

      const res = await adminRefillHearts("child_luka");
      expect(res).toEqual({
        success: true,
        userName: "Luka Horvat",
      });

      const updatedLuka = store.userProgress.find((u) => u.userId === "child_luka");
      expect(updatedLuka?.hearts).toBe(5);
    });

    it("successfully increments streak and sets today's active date for child in own pod", async () => {
      const initialLuka = store.userProgress.find((u) => u.userId === "child_luka");
      expect(initialLuka?.streak).toBe(3);

      const res = await adminProtectStreak("child_luka");
      expect(res).toEqual({
        success: true,
        userName: "Luka Horvat",
        streak: 4,
      });

      const updatedLuka = store.userProgress.find((u) => u.userId === "child_luka");
      expect(updatedLuka?.streak).toBe(4);
      const today = new Date().toISOString().split("T")[0];
      expect(updatedLuka?.lastActiveDate).toBe(today);
    });

    it("successfully awards praise XP and propagates to pod total XP", async () => {
      const initialLuka = store.userProgress.find((u) => u.userId === "child_luka");
      expect(initialLuka?.points).toBe(120);
      const initialPod = store.pods.find((p) => p.id === 1);
      expect(initialPod?.currentXp).toBe(200);

      const res = await adminAwardPraiseXp("child_luka", 75, "Reading Croatian storybook");
      expect(res).toEqual({
        success: true,
        userName: "Luka Horvat",
        addedXp: 75,
        newPoints: 195,
        reason: "Reading Croatian storybook",
      });

      const updatedLuka = store.userProgress.find((u) => u.userId === "child_luka");
      expect(updatedLuka?.points).toBe(195);

      const updatedPod = store.pods.find((p) => p.id === 1);
      expect(updatedPod?.currentXp).toBe(275);
    });

    it("validates praise XP amount boundaries (1 to 500 XP)", async () => {
      const zeroRes = await adminAwardPraiseXp("child_luka", 0, "Zero XP");
      expect(zeroRes).toEqual({ error: "Amount must be between 1 and 500 XP." });

      const negRes = await adminAwardPraiseXp("child_luka", -25, "Negative XP");
      expect(negRes).toEqual({ error: "Amount must be between 1 and 500 XP." });

      const excessiveRes = await adminAwardPraiseXp("child_luka", 501, "Over max XP");
      expect(excessiveRes).toEqual({ error: "Amount must be between 1 and 500 XP." });
    });
  });
});
