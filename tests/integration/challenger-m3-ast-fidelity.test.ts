import { describe, it, expect, beforeEach, vi } from "vitest";
import http from "http";
import https from "https";
import net from "net";
import { eq, and, inArray, gte, lte } from "drizzle-orm";

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

import { pods, podMembers, userProgress } from "@/db/schema";
import { setMockAuth, resetMockClerk } from "@/tests/mocks/clerk";
import { resetMockDb, store, mockDb } from "@/tests/mocks/drizzle";
import { adminRefillHearts, adminAwardPraiseXp } from "@/actions/admin-overrides";
import { createMultipleChildAccounts } from "@/actions/child-account";

describe("Milestone 3 Challenger 2: AST Fidelity & Database Safety Verification", () => {
  beforeEach(() => {
    resetMockClerk();
    resetMockDb({
      pods: [
        { id: 10, name: "Zagreb Pod", ownerId: "user_a", currentXp: 500, targetXp: 1000 },
        { id: 20, name: "Split Pod", ownerId: "user_b", currentXp: 150, targetXp: 1000 },
        { id: 30, name: "Rijeka Pod", ownerId: "user_a", currentXp: 900, targetXp: 1000 },
      ],
      podMembers: [
        { id: 1, podId: 10, userId: "child_1", role: "member" },
        { id: 2, podId: 20, userId: "child_2", role: "member" },
        { id: 3, podId: 30, userId: "child_3", role: "member" },
        { id: 4, podId: 10, userId: "child_4", role: "member" },
        { id: 5, podId: 10, userId: "user_a", role: "admin" },
      ],
      userProgress: [
        { userId: "child_1", userName: "Luka", hearts: 5, points: 500, streak: 10, role: "learner" },
        { userId: "child_2", userName: "Mia", hearts: 2, points: 150, streak: 3, role: "learner" },
        { userId: "child_3", userName: "Ivan", hearts: 0, points: 900, streak: 0, role: "learner" },
        { userId: "child_4", userName: "Sara", hearts: 4, points: null, streak: undefined, role: "learner" },
        { userId: "user_a", userName: "Ana Horvat", hearts: 5, points: 1000, streak: 20, role: "parent" },
      ],
    });
  });

  describe("1. Database Safety: Zero Network Sockets During Server Action Execution", () => {
    it("guarantees 0 outgoing network requests (HTTP, HTTPS, TCP) during server actions", async () => {
      let networkAttempts = 0;

      vi.spyOn(http, "request").mockImplementation((...args: any[]) => {
        networkAttempts++;
        throw new Error(`Forbidden HTTP network attempt to: ${args[0]}`);
      });

      vi.spyOn(https, "request").mockImplementation((...args: any[]) => {
        networkAttempts++;
        throw new Error(`Forbidden HTTPS network attempt to: ${args[0]}`);
      });

      vi.spyOn(net, "connect").mockImplementation((...args: any[]) => {
        networkAttempts++;
        throw new Error(`Forbidden TCP network connection to: ${args[0]}`);
      });

      setMockAuth("user_a");

      const refillRes = await adminRefillHearts("child_1");
      expect(refillRes.success).toBe(true);

      const praiseRes = await adminAwardPraiseXp("child_1", 25, "Great work");
      expect(praiseRes.success).toBe(true);

      const batchRes = await createMultipleChildAccounts([
        { childName: "New Child", username: "new_child_test", password: "password123", podId: 10 },
      ]);
      expect(batchRes.success).toBe(true);

      expect(networkAttempts).toBe(0);
    });
  });

  describe("2. AST Parser Fidelity: `eq` operator", () => {
    it("matches exact string column value", async () => {
      const res = await mockDb.query.userProgress.findFirst({
        where: eq(userProgress.userId, "child_2"),
      });
      expect(res?.userName).toBe("Mia");
    });

    it("matches exact numeric column value (including 0)", async () => {
      const res = await mockDb.query.userProgress.findFirst({
        where: eq(userProgress.hearts, 0),
      });
      expect(res?.userName).toBe("Ivan");
    });

    it("returns null when no record matches eq", async () => {
      const res = await mockDb.query.userProgress.findFirst({
        where: eq(userProgress.userId, "nonexistent"),
      });
      expect(res).toBeNull();
    });
  });

  describe("3. AST Parser Fidelity: `gte` & `lte` operators", () => {
    it("correctly includes values greater than or equal to threshold (gte)", async () => {
      const res = await mockDb.query.userProgress.findMany({
        where: gte(userProgress.hearts, 4),
      });
      const names = res.map((u: any) => u.userName).sort();
      expect(names).toEqual(["Ana Horvat", "Luka", "Sara"]);
    });

    it("handles exact boundary match for gte", async () => {
      const res = await mockDb.query.userProgress.findMany({
        where: gte(userProgress.hearts, 5),
      });
      const names = res.map((u: any) => u.userName).sort();
      expect(names).toEqual(["Ana Horvat", "Luka"]);
    });

    it("excludes null and undefined records adhering to Postgres ternary logic (gte)", async () => {
      const res = await mockDb.query.userProgress.findMany({
        where: gte(userProgress.points, 100),
      });
      const names = res.map((u: any) => u.userName).sort();
      expect(names).toEqual(["Ana Horvat", "Ivan", "Luka", "Mia"]);
    });

    it("correctly includes values less than or equal to threshold (lte)", async () => {
      const res = await mockDb.query.userProgress.findMany({
        where: lte(userProgress.hearts, 2),
      });
      const names = res.map((u: any) => u.userName).sort();
      expect(names).toEqual(["Ivan", "Mia"]);
    });

    it("excludes null and undefined records for lte adhering to Postgres logic", async () => {
      const res = await mockDb.query.userProgress.findMany({
        where: lte(userProgress.points, 200),
      });
      const names = res.map((u: any) => u.userName);
      expect(names).toEqual(["Mia"]);
    });
  });

  describe("4. AST Parser Fidelity: `and` conjunction", () => {
    it("requires all conjuncts to evaluate to true", async () => {
      const res = await mockDb.query.podMembers.findFirst({
        where: and(
          eq(podMembers.podId, 10),
          eq(podMembers.userId, "child_4")
        ),
      });
      expect(res?.userId).toBe("child_4");
    });

    it("returns null if any conjunct in and evaluates to false", async () => {
      const res = await mockDb.query.podMembers.findFirst({
        where: and(
          eq(podMembers.podId, 20),
          eq(podMembers.userId, "child_4")
        ),
      });
      expect(res).toBeNull();
    });

    it("supports composite and(eq, gte)", async () => {
      const match = await mockDb.query.userProgress.findFirst({
        where: and(
          eq(userProgress.userId, "child_1"),
          gte(userProgress.hearts, 5)
        ),
      });
      expect(match?.userName).toBe("Luka");

      const noMatch = await mockDb.query.userProgress.findFirst({
        where: and(
          eq(userProgress.userId, "child_2"),
          gte(userProgress.hearts, 5)
        ),
      });
      expect(noMatch).toBeNull();
    });
  });

  describe("5. AST Parser Fidelity: `inArray` subquery vs literal array", () => {
    it("resolves nested select subquery correctly (verifyParentCanManageLearner pattern)", async () => {
      const subquery = mockDb.select({ id: pods.id }).from(pods).where(eq(pods.ownerId, "user_a"));

      const child1Membership = await mockDb.query.podMembers.findFirst({
        where: and(
          eq(podMembers.userId, "child_1"),
          inArray(podMembers.podId, subquery)
        ),
      });
      expect(child1Membership?.userId).toBe("child_1");

      const child2Membership = await mockDb.query.podMembers.findFirst({
        where: and(
          eq(podMembers.userId, "child_2"),
          inArray(podMembers.podId, subquery)
        ),
      });
      expect(child2Membership).toBeNull();
    });

    it("matches literal string array with inArray (db/queries.ts getPodLeaderboard pattern)", async () => {
      const res = await mockDb.query.userProgress.findMany({
        where: inArray(userProgress.userId, ["child_1", "child_3"]),
      });
      const names = res.map((u: any) => u.userName).sort();
      expect(names).toEqual(["Ivan", "Luka"]);
    });

    it("matches literal numeric array with inArray", async () => {
      const res = await mockDb.query.pods.findMany({
        where: inArray(pods.id, [10, 30]),
      });
      const podNames = res.map((p: any) => p.name).sort();
      expect(podNames).toEqual(["Rijeka Pod", "Zagreb Pod"]);
    });
  });

  describe("6. Transactional Snapshot Rollback", () => {
    it("restores original state when transaction callback throws", async () => {
      const initialCount = store.userProgress.length;

      await expect(
        mockDb.transaction(async (tx: any) => {
          await tx.insert(userProgress).values({
            userId: "temp_revert",
            userName: "Temporary",
            hearts: 5,
            points: 0,
          });
          expect(store.userProgress.length).toBe(initialCount + 1);
          throw new Error("Force Rollback");
        })
      ).rejects.toThrow("Force Rollback");

      expect(store.userProgress.length).toBe(initialCount);
      expect(store.userProgress.find((u: any) => u.userId === "temp_revert")).toBeUndefined();
    });
  });
});
