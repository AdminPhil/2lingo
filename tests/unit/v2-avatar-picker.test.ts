import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAuth = vi.fn();
const mockGetUserProgress = vi.fn();
const mockUpdateSet = vi.fn();
const mockUpdateWhere = vi.fn();
const mockRevalidatePath = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
  currentUser: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/actions/pod", () => ({
  awardPodXp: vi.fn(),
}));

vi.mock("@/db/queries", () => ({
  getCourseById: vi.fn(),
  getUserProgress: () => mockGetUserProgress(),
  getUserSubscription: vi.fn(),
}));

vi.mock("@/db/drizzle", () => ({
  default: {
    update: () => ({
      set: (values: unknown) => {
        mockUpdateSet(values);
        return {
          where: (...whereArgs: unknown[]) => {
            mockUpdateWhere(...whereArgs);
            return Promise.resolve();
          },
        };
      },
    }),
  },
}));

import { updateLearnerAvatar } from "@/actions/user-progress";
import { CLASSROOM_AVATARS } from "@/lib/classroom-roster";

describe("CR-088: updateLearnerAvatar (Self-Service Learner Avatar Picker)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated callers with Unauthorized", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    await expect(updateLearnerAvatar("/avatars/luka.png")).rejects.toThrow("Unauthorized");
    expect(mockUpdateSet).not.toHaveBeenCalled();
  });

  it("rejects arbitrary external URLs, path traversals, and non-allowlisted strings", async () => {
    mockAuth.mockResolvedValue({ userId: "user_valentina" });
    mockGetUserProgress.mockResolvedValue({ userId: "user_valentina", userImageSrc: "/avatars/pasko.png" });

    const invalidInputs = [
      "https://evil.example.com/avatar.png",
      "javascript:alert(1)",
      "/avatars/../../etc/passwd",
      "/mascot.png",
      "",
    ];

    for (const badSrc of invalidInputs) {
      const res = await updateLearnerAvatar(badSrc);
      expect(res.error).toBeDefined();
      expect(res.success).toBeUndefined();
    }

    expect(mockUpdateSet).not.toHaveBeenCalled();
  });

  it("accepts all 6 curated Croatian mascot avatars and revalidates learner & admin routes", async () => {
    mockAuth.mockResolvedValue({ userId: "user_valentina" });
    mockGetUserProgress.mockResolvedValue({ userId: "user_valentina", userImageSrc: "/avatars/pasko.png" });

    for (const mascot of CLASSROOM_AVATARS) {
      mockUpdateSet.mockClear();
      mockRevalidatePath.mockClear();

      const res = await updateLearnerAvatar(mascot.src);
      expect(res).toEqual({ success: true, avatarSrc: mascot.src });
      expect(mockUpdateSet).toHaveBeenCalledWith({ userImageSrc: mascot.src });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/learn");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/leaderboard");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/quests");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
    }
  });
});
