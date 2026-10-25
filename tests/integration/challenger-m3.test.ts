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

import { setMockAuth, resetMockClerk, clerkClient } from "@/tests/mocks/clerk";
import { resetMockDb, store, mockDb } from "@/tests/mocks/drizzle";
import {
  adminRefillHearts,
  adminProtectStreak,
  adminAwardPraiseXp,
} from "@/actions/admin-overrides";
import {
  createChildAccount,
  createMultipleChildAccounts,
  adminGetOrResetStudentQrPass,
} from "@/actions/child-account";
import { adminAddUserToPod } from "@/actions/pod";

describe("Milestone 3 Challenger Adversarial Stress Suite", () => {
  beforeEach(() => {
    resetMockClerk();

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
      ],
    });

    setMockAuth("parent_horvat");
  });

  describe("1. Pod Boundary Multi-Tenant Isolation Stress", () => {
    it("strictly rejects cross-pod adminRefillHearts and preserves target state exactly", async () => {
      const res = await adminRefillHearts("child_mia");
      expect(res).toEqual({
        error: "You can only manage learners inside your own family circle.",
      });

      const mia = store.userProgress.find((u) => u.userId === "child_mia");
      expect(mia?.hearts).toBe(2);
      expect(mia?.heartsUsed).toBe(3);
    });

    it("strictly rejects cross-pod adminProtectStreak and preserves target state exactly", async () => {
      const res = await adminProtectStreak("child_mia");
      expect(res).toEqual({
        error: "You can only manage learners inside your own family circle.",
      });

      const mia = store.userProgress.find((u) => u.userId === "child_mia");
      expect(mia?.streak).toBe(7);
      expect(mia?.lastActiveDate).toBeUndefined();
    });

    it("strictly rejects cross-pod adminAwardPraiseXp and preserves target points and pod XP", async () => {
      const res = await adminAwardPraiseXp("child_mia", 150, "Hacked praise");
      expect(res).toEqual({
        error: "You can only manage learners inside your own family circle.",
      });

      const mia = store.userProgress.find((u) => u.userId === "child_mia");
      expect(mia?.points).toBe(250);

      const pod2 = store.pods.find((p) => p.id === 2);
      expect(pod2?.currentXp).toBe(100);
    });

    it("strictly rejects cross-pod createChildAccount when attempting to insert into Pod 2", async () => {
      const res = await createChildAccount({
        childName: "Intruder Child",
        username: "intruder_child",
        password: "password123",
        podId: 2,
      });

      expect(res).toEqual({
        error: "You can only create learner accounts for your own family circle.",
      });

      expect(clerkClient.users.createUser).not.toHaveBeenCalled();
      const inDb = store.userProgress.find((u) => u.userName === "Intruder Child");
      expect(inDb).toBeUndefined();
    });

    it("strictly rejects cross-pod adminGetOrResetStudentQrPass for a child in another pod", async () => {
      const res = await adminGetOrResetStudentQrPass("child_mia");
      expect(res).toEqual({
        error: "You only have permission to view badges for learners in your own family circle.",
      });

      expect(clerkClient.users.updateUser).not.toHaveBeenCalled();
    });

    it("strictly rejects cross-pod adminAddUserToPod when targeting a pod not owned by caller", async () => {
      const res = await adminAddUserToPod(2, "new_member_1", "member");
      expect(res).toEqual({
        error: "Only the pod owner or super administrator can add members to this pod.",
      });

      const added = store.podMembers.find((m) => m.userId === "new_member_1");
      expect(added).toBeUndefined();
    });
  });

  describe("2. Deep Mid-Batch Compensating Rollback Stress", () => {
    it("rolls back all 3 previous successful children when child 4 encounters validation failure", async () => {
      const fourChildren = [
        { childName: "Child One", username: "child_one", password: "password123", podId: 1 },
        { childName: "Child Two", username: "child_two", password: "password123", podId: 1 },
        { childName: "Child Three", username: "child_three", password: "password123", podId: 1 },
        // Invalid child: name too short (< 2 chars)
        { childName: "X", username: "child_four", password: "password123", podId: 1 },
      ];

      const res = await createMultipleChildAccounts(fourChildren);

      expect(res.success).toBe(false);
      expect(res.rolledBackCount).toBe(3);
      expect(res.error).toContain("Batch child creation failed and was rolled back atomically");
      expect(res.error).toContain("Please enter your child's name (at least 2 characters)");

      // Verify all 3 created Clerk users were rolled back via deleteUser
      expect(clerkClient.users.deleteUser).toHaveBeenCalledTimes(3);
      const deletedClerkIds = vi.mocked(clerkClient.users.deleteUser).mock.calls.map((c) => c[0]);
      expect(deletedClerkIds).toContain("clerk_user_child_one");
      expect(deletedClerkIds).toContain("clerk_user_child_two");
      expect(deletedClerkIds).toContain("clerk_user_child_three");

      // Verify zero orphaned accounts in userProgress
      const orphanedProgress = store.userProgress.filter((u) =>
        ["child_one", "child_two", "child_three"].some((name) => u.userId.includes(name))
      );
      expect(orphanedProgress).toHaveLength(0);

      // Verify zero orphaned memberships in podMembers
      const orphanedMembers = store.podMembers.filter((m) =>
        ["child_one", "child_two", "child_three"].some((name) => m.userId.includes(name))
      );
      expect(orphanedMembers).toHaveLength(0);
    });

    it("rolls back when Clerk network throws unhandled exception mid-batch", async () => {
      const twoChildren = [
        { childName: "First Child", username: "first_ok", password: "password123", podId: 1 },
        { childName: "Second Child", username: "second_err", password: "password123", podId: 1 },
      ];

      let count = 0;
      vi.mocked(clerkClient.users.createUser).mockImplementation(async (params: any) => {
        count++;
        if (count === 2) {
          throw new Error("Clerk 503 Service Unavailable");
        }
        return {
          id: `clerk_user_${params.username}`,
          username: params.username,
          firstName: params.firstName,
        };
      });

      const res = await createMultipleChildAccounts(twoChildren);

      expect(res.success).toBe(false);
      expect(res.rolledBackCount).toBe(1);
      expect(res.error).toContain("Batch child creation failed and was rolled back atomically");

      expect(clerkClient.users.deleteUser).toHaveBeenCalledWith("clerk_user_first_ok");
      expect(store.userProgress.some((u) => u.userId.includes("first_ok"))).toBe(false);
      expect(store.podMembers.some((m) => m.userId.includes("first_ok"))).toBe(false);
    });

    it("rolls back when database crashes during child 2 podMembers insertion", async () => {
      const twoChildren = [
        { childName: "Child Alpha", username: "child_alpha", password: "password123", podId: 1 },
        { childName: "Child Beta", username: "child_beta", password: "password123", podId: 1 },
      ];

      let podMemberInserts = 0;
      const originalInsert = mockDb.insert;
      mockDb.insert = vi.fn((table: any) => {
        const queryObj = originalInsert(table);
        const originalValues = queryObj.values;
        queryObj.values = vi.fn((val: any) => {
          if (table.name === "pod_members" || table[Symbol.for("drizzle:Name")] === "pod_members") {
            podMemberInserts++;
            if (podMemberInserts === 2) {
              throw new Error("Neon Postgres Disk I/O Timeout");
            }
          }
          return originalValues(val);
        });
        return queryObj;
      });

      const res = await createMultipleChildAccounts(twoChildren);

      expect(res.success).toBe(false);
      expect(res.rolledBackCount).toBe(1);
      expect(res.error).toContain("Neon Postgres Disk I/O Timeout");

      // Verify Child Alpha was rolled back
      expect(clerkClient.users.deleteUser).toHaveBeenCalledWith("clerk_user_child_alpha");
      expect(store.userProgress.some((u) => u.userId.includes("child_alpha"))).toBe(false);
      expect(store.podMembers.some((m) => m.userId.includes("child_alpha"))).toBe(false);
    });
  });

  describe("3. Boundary Conditions Stress: Array bounds and duplicate usernames", () => {
    it("strictly rejects empty batch array [] with explicit validation error", async () => {
      const res = await createMultipleChildAccounts([]);
      expect(res).toEqual({
        error: "Please provide at least one child account to create.",
        errors: ["Please provide at least one child account to create."],
      });
    });

    it("strictly rejects batch exceeding limit of 5 (e.g. 6 children)", async () => {
      const six = Array.from({ length: 6 }, (_, i) => ({
        childName: `Child ${i + 1}`,
        username: `child_${i + 1}`,
        password: "password123",
        podId: 1,
      }));

      const res = await createMultipleChildAccounts(six);
      expect(res).toEqual({
        error: "You can create up to 5 children at one time.",
        errors: ["You can create up to 5 children at one time."],
      });
      expect(clerkClient.users.createUser).not.toHaveBeenCalled();
    });

    it("rejects batch payload with duplicate usernames pre-flight without calling Clerk", async () => {
      const batchWithDuplicates = [
        { childName: "First Luka", username: "luka_duplicate", password: "password123", podId: 1 },
        { childName: "Second Luka", username: "luka_duplicate", password: "password123", podId: 1 },
      ];

      const res = await createMultipleChildAccounts(batchWithDuplicates);

      expect(res).toEqual({
        error: "Each child in the batch must have a unique username.",
        errors: ["Each child in the batch must have a unique username."],
      });
      expect(clerkClient.users.createUser).not.toHaveBeenCalled();
    });

    it("handles pre-existing Clerk username collision: simulates Clerk duplicate error and verifies complete rollback", async () => {
      const batchWithCollision = [
        { childName: "First Luka", username: "luka_batch_unique", password: "password123", podId: 1 },
        { childName: "Second Luka", username: "luka_already_taken", password: "password123", podId: 1 },
      ];

      // Stateful Clerk simulation: 'luka_already_taken' already exists in Clerk
      const existingClerkUsernames = new Set<string>(["luka_already_taken"]);
      vi.mocked(clerkClient.users.createUser).mockImplementation(async (params: any) => {
        if (existingClerkUsernames.has(params.username)) {
          const err: any = new Error("That username is taken");
          err.errors = [{ code: "form_identifier_exists", message: "That username is taken" }];
          throw err;
        }
        existingClerkUsernames.add(params.username);
        return {
          id: `clerk_user_${params.username}`,
          username: params.username,
          firstName: params.firstName,
        };
      });

      const res = await createMultipleChildAccounts(batchWithCollision);

      expect(res.success).toBe(false);
      expect(res.error).toContain("already taken");
      expect(res.rolledBackCount).toBe(1);

      // Assert First Luka was rolled back from Clerk
      expect(clerkClient.users.deleteUser).toHaveBeenCalledWith("clerk_user_luka_batch_unique");

      // Assert 0 orphaned accounts in DB
      const remainingProgress = store.userProgress.filter((u) => u.userId.includes("luka_batch_unique"));
      expect(remainingProgress).toHaveLength(0);

      const remainingMembers = store.podMembers.filter((m) => m.userId.includes("luka_batch_unique"));
      expect(remainingMembers).toHaveLength(0);
    });

    it("rolls back Child 1 when Child 2 hits pod capacity limit mid-batch", async () => {
      // Setup pod 1 to already have 14 members (capacity is 15)
      for (let i = 3; i <= 14; i++) {
        store.podMembers.push({
          id: i,
          podId: 1,
          userId: `existing_member_${i}`,
          role: "member",
          joinedAt: new Date(),
        });
      }
      expect(store.podMembers.filter((m) => m.podId === 1)).toHaveLength(14);

      const twoChildren = [
        { childName: "Fourteenth Child", username: "fourteenth_ok", password: "password123", podId: 1 },
        { childName: "Fifteenth Child", username: "fifteenth_overflow", password: "password123", podId: 1 },
      ];

      const res = await createMultipleChildAccounts(twoChildren);

      expect(res.success).toBe(false);
      expect(res.rolledBackCount).toBe(1);
      expect(res.error).toContain("reached its capacity of 15 learners");

      // Verify Child 1 was rolled back from Clerk and DB
      expect(clerkClient.users.deleteUser).toHaveBeenCalledWith("clerk_user_fourteenth_ok");
      expect(store.userProgress.some((u) => u.userId.includes("fourteenth_ok"))).toBe(false);
      expect(store.podMembers.some((m) => m.userId.includes("fourteenth_ok"))).toBe(false);

      // Pod member count returned to 14
      expect(store.podMembers.filter((m) => m.podId === 1)).toHaveLength(14);
    });
  });
});
