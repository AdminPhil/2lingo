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
import { createMultipleChildAccounts } from "@/actions/child-account";

describe("Batch Account Creation & Compensating Rollback Layer", () => {
  beforeEach(() => {
    resetMockClerk();

    // Reset database with a family pod owned by parent_horvat
    resetMockDb({
      pods: [
        {
          id: 1,
          name: "Horvat Family",
          type: "family",
          inviteCode: "HORVAT",
          ownerId: "parent_horvat",
          targetXp: 1000,
          currentXp: 0,
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
          currentXp: 0,
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
      ],
      userProgress: [
        {
          userId: "parent_horvat",
          userName: "Ana Horvat",
          role: "parent",
        },
      ],
    });

    setMockAuth("parent_horvat");
  });

  describe("1. Boundary & Input Validation", () => {
    it("rejects an empty array with an explicit error", async () => {
      const res = await createMultipleChildAccounts([]);
      expect(res.error).toBe("Please provide at least one child account to create.");
    });

    it("rejects batch requests exceeding the maximum limit of 5 children", async () => {
      const sixChildren = [
        { childName: "Child 1", username: "child_one", password: "password123", podId: 1 },
        { childName: "Child 2", username: "child_two", password: "password123", podId: 1 },
        { childName: "Child 3", username: "child_three", password: "password123", podId: 1 },
        { childName: "Child 4", username: "child_four", password: "password123", podId: 1 },
        { childName: "Child 5", username: "child_five", password: "password123", podId: 1 },
        { childName: "Child 6", username: "child_six", password: "password123", podId: 1 },
      ];

      const res = await createMultipleChildAccounts(sixChildren);
      expect(res.error).toBe("You can create up to 5 children at one time.");
    });

    it("rejects unauthenticated callers with an Unauthorized exception", async () => {
      setMockAuth(null);
      await expect(
        createMultipleChildAccounts([
          { childName: "Luka", username: "luka123", password: "password123", podId: 1 },
        ])
      ).rejects.toThrow("Unauthorized");
    });

    it("rejects attempt to create children in a pod not owned by the caller", async () => {
      // parent_horvat attempting to create child in Pod 2 (owned by parent_kovacevic)
      const res = await createMultipleChildAccounts([
        { childName: "Mia", username: "mia1234", password: "password123", podId: 2 },
      ]);

      expect(res.success).toBe(false);
      expect(res.error).toContain("You can only create learner accounts for your own family circle.");
      expect(res.rolledBackCount).toBe(0);
    });

    it("rejects batch requests with duplicate usernames (including case-variation and whitespace padding) before initiating creation", async () => {
      const duplicates = [
        { childName: "Child 1", username: "Luka_123", password: "password123", podId: 1 },
        { childName: "Child 2", username: "  luka_123  ", password: "password123", podId: 1 },
      ];

      const res = await createMultipleChildAccounts(duplicates);
      expect(res).toEqual({
        error: "Each child in the batch must have a unique username.",
        errors: ["Each child in the batch must have a unique username."],
      });
      expect(clerkClient.users.createUser).not.toHaveBeenCalled();
    });
  });

  describe("2. Happy Path Batch Provisioning", () => {
    it("successfully creates multiple children in batch and persists all accounts", async () => {
      const childrenInput = [
        { childName: "Luka", username: "luka_h", password: "password123", podId: 1 },
        { childName: "Petra", username: "petra_h", password: "password123", podId: 1 },
        { childName: "Ivan", username: "ivan_h", password: "password123", podId: 1 },
      ];

      const res = await createMultipleChildAccounts(childrenInput);

      expect(res.success).toBe(true);
      expect(res.created).toHaveLength(3);
      expect(res.created?.map((c) => c.name)).toEqual(["Luka", "Petra", "Ivan"]);

      // Verify Clerk createUser was called for each child
      expect(clerkClient.users.createUser).toHaveBeenCalledTimes(3);

      // Verify database persistence in userProgress
      const progressRecords = store.userProgress.filter((u) =>
        ["luka_h", "petra_h", "ivan_h"].includes(u.userId.replace("clerk_user_", ""))
      );
      expect(progressRecords).toHaveLength(3);
      for (const p of progressRecords) {
        expect(p.role).toBe("learner");
        expect(p.hearts).toBe(5);
        expect(p.points).toBe(0);
      }

      // Verify database persistence in podMembers
      const podMemberRecords = store.podMembers.filter((m) => m.podId === 1 && m.role === "member");
      expect(podMemberRecords).toHaveLength(3);
    });
  });

  describe("3. Transactional Atomicity & Compensating Rollback on Failure", () => {
    it("rolls back Child 1 when Child 2 fails validation (e.g. invalid password)", async () => {
      const childrenInput = [
        { childName: "Luka", username: "luka_h", password: "password123", podId: 1 },
        // Invalid password (< 6 chars)
        { childName: "Mia", username: "mia_h", password: "123", podId: 1 },
      ];

      const res = await createMultipleChildAccounts(childrenInput);

      expect(res.success).toBe(false);
      expect(res.error).toContain("Batch child creation failed and was rolled back atomically");
      expect(res.error).toContain("Password must be at least 6 characters long");
      expect(res.rolledBackCount).toBe(1);

      // Verify Clerk deleteUser compensating call was made for Child 1
      expect(clerkClient.users.deleteUser).toHaveBeenCalledTimes(1);
      const deletedClerkId = vi.mocked(clerkClient.users.deleteUser).mock.calls[0][0];
      expect(deletedClerkId).toContain("luka_h");

      // Verify 0 orphaned partial accounts remain in database
      const orphanProgress = store.userProgress.filter((u) => u.userId.includes("luka_h"));
      expect(orphanProgress).toHaveLength(0);

      const orphanPodMembers = store.podMembers.filter((m) => m.userId.includes("luka_h"));
      expect(orphanPodMembers).toHaveLength(0);
    });

    it("rolls back Child 1 and Child 2 when Child 3 encounters a Clerk error", async () => {
      const childrenInput = [
        { childName: "Luka", username: "luka_batch", password: "password123", podId: 1 },
        { childName: "Mia", username: "mia_batch", password: "password123", podId: 1 },
        { childName: "Marko", username: "marko_batch", password: "password123", podId: 1 },
      ];

      // Simulate Child 3 failing at Clerk API (e.g., username taken)
      let callCount = 0;
      vi.mocked(clerkClient.users.createUser).mockImplementation(async (params: any) => {
        callCount++;
        if (callCount === 3) {
          const err: any = new Error("Username already taken");
          err.errors = [{ code: "form_identifier_exists", message: "Username already taken" }];
          throw err;
        }
        return {
          id: `clerk_user_${params.username}`,
          username: params.username,
          firstName: params.firstName,
        };
      });

      const res = await createMultipleChildAccounts(childrenInput);

      expect(res.success).toBe(false);
      expect(res.error).toContain("Batch child creation failed and was rolled back atomically");
      expect(res.error).toContain("already taken");
      expect(res.rolledBackCount).toBe(2);

      // Verify compensating deleteUser was called for BOTH Child 1 and Child 2
      expect(clerkClient.users.deleteUser).toHaveBeenCalledTimes(2);
      const deletedIds = vi.mocked(clerkClient.users.deleteUser).mock.calls.map((c) => c[0]);
      expect(deletedIds).toContain("clerk_user_luka_batch");
      expect(deletedIds).toContain("clerk_user_mia_batch");

      // Verify zero orphaned accounts in userProgress
      const remainingProgress = store.userProgress.filter((u) =>
        u.userId.includes("batch")
      );
      expect(remainingProgress).toHaveLength(0);

      // Verify zero orphaned memberships in podMembers
      const remainingMembers = store.podMembers.filter((m) =>
        m.userId.includes("batch")
      );
      expect(remainingMembers).toHaveLength(0);
    });

    it("handles unexpected runtime exception during child creation and rolls back safely", async () => {
      const childrenInput = [
        { childName: "Luka", username: "luka_crash", password: "password123", podId: 1 },
        { childName: "Mia", username: "mia_crash", password: "password123", podId: 1 },
      ];

      let callCount = 0;
      vi.mocked(clerkClient.users.createUser).mockImplementation(async (params: any) => {
        callCount++;
        if (callCount === 2) {
          throw new Error("Simulated network timeout connecting to auth cluster");
        }
        return {
          id: `clerk_user_${params.username}`,
          username: params.username,
          firstName: params.firstName,
        };
      });

      const res = await createMultipleChildAccounts(childrenInput);

      expect(res.success).toBe(false);
      expect(res.error).toContain("Batch child creation failed and was rolled back atomically");
      expect(res.error).toContain("Failed to communicate with authentication service");
      expect(res.rolledBackCount).toBe(1);

      // Compensating delete called for Child 1
      expect(clerkClient.users.deleteUser).toHaveBeenCalledWith("clerk_user_luka_crash");

      // Assert clean state in DB
      const orphaned = store.userProgress.filter((u) => u.userId.includes("crash"));
      expect(orphaned).toHaveLength(0);
    });

    it("handles unexpected database exception during child creation and rolls back safely", async () => {
      const childrenInput = [
        { childName: "Luka", username: "luka_dberr", password: "password123", podId: 1 },
        { childName: "Mia", username: "mia_dberr", password: "password123", podId: 1 },
      ];

      // On child 2, simulate database exception during target pod lookup
      let podQueryCount = 0;
      const originalFindFirst = store.pods.find.bind(store.pods);
      vi.mocked(store.pods.find as any);

      // Let's spy on mockDb.query.pods.findFirst for child 2
      let findFirstCallCount = 0;
      const originalPodFindFirst = mockDb.query.pods.findFirst;
      mockDb.query.pods.findFirst = vi.fn(async (opts?: any) => {
        findFirstCallCount++;
        if (findFirstCallCount === 2) {
          throw new Error("Simulated database connection crash");
        }
        return originalPodFindFirst(opts);
      });

      const res = await createMultipleChildAccounts(childrenInput);

      expect(res.success).toBe(false);
      expect(res.error).toContain("Batch child creation failed and was rolled back atomically");
      expect(res.error).toContain("Simulated database connection crash");
      expect(res.rolledBackCount).toBe(1);

      // Compensating delete called for Child 1
      expect(clerkClient.users.deleteUser).toHaveBeenCalledWith("clerk_user_luka_dberr");

      // Assert clean state in DB
      const orphaned = store.userProgress.filter((u) => u.userId.includes("dberr"));
      expect(orphaned).toHaveLength(0);
    });
  });
});
