import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAuth = vi.fn();
const mockIsSuperAdmin = vi.fn();
const mockClerkGetUser = vi.fn();
const mockClerkUpdateUser = vi.fn();
const mockUserProgressFindFirst = vi.fn();
const mockPodsFindMany = vi.fn();
const mockPodsFindFirst = vi.fn();
const mockV2InsertValues = vi.fn();
const mockV2UpdateSet = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
  clerkClient: vi.fn(async () => ({
    users: {
      getUser: (...args: unknown[]) => mockClerkGetUser(...args),
      updateUser: (...args: unknown[]) => mockClerkUpdateUser(...args),
    },
    signInTokens: {
      createSignInToken: vi.fn(),
    },
  })),
}));

vi.mock("@/lib/admin", () => ({
  isSuperAdmin: () => mockIsSuperAdmin(),
}));

vi.mock("@/db/drizzle", () => ({
  default: {
    query: {
      userProgress: {
        findFirst: (...args: unknown[]) => mockUserProgressFindFirst(...args),
      },
      pods: {
        findMany: (...args: unknown[]) => mockPodsFindMany(...args),
        findFirst: (...args: unknown[]) => mockPodsFindFirst(...args),
      },
    },
  },
}));

vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => ({})),
}));

vi.mock("drizzle-orm/neon-http", () => ({
  drizzle: vi.fn(() => ({
    insert: () => ({
      values: (vals: unknown) => {
        mockV2InsertValues(vals);
        return Promise.resolve();
      },
    }),
    update: () => ({
      set: (vals: unknown) => {
        mockV2UpdateSet(vals);
        return {
          where: () => Promise.resolve(),
        };
      },
    }),
  })),
}));

import {
  issueStudentQrTokenBadge,
  issueTeamQrTokenBadges,
} from "@/actions/v2/qr-auth";
import { hashQrBadgeToken, isValidQrBadgeTokenFormat } from "@/lib/v2/qr-tokens";

describe("CroLingo v2 Passwordless QR Token Badge Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DATABASE_URL_V2 = "postgresql://user:pass@ep-v2-dev.neon.tech/neondb";
  });

  it("rejects unauthenticated requests", async () => {
    mockAuth.mockResolvedValue({ userId: null });
    await expect(issueStudentQrTokenBadge("child_luka")).rejects.toThrow("Unauthorized");
  });

  it("blocks cross-pod parent from minting a badge for another family's learner", async () => {
    mockAuth.mockResolvedValue({ userId: "parent_intruder" });
    mockIsSuperAdmin.mockResolvedValue(false);
    mockUserProgressFindFirst.mockResolvedValue({
      userId: "child_mia",
      userName: "Mia",
      userImageSrc: "/avatars/mia.png",
    });
    mockPodsFindMany.mockResolvedValue([
      { id: 1, ownerId: "parent_intruder", members: [{ userId: "child_other" }] },
    ]);

    const res = await issueStudentQrTokenBadge("child_mia");
    expect(res.error).toContain("your own family circle");
    expect(mockClerkGetUser).not.toHaveBeenCalled();
    expect(mockV2InsertValues).not.toHaveBeenCalled();
  });

  it("mints a hashed passwordless token for an authorized pod owner and NEVER resets Clerk password", async () => {
    mockAuth.mockResolvedValue({ userId: "parent_adriana" });
    mockIsSuperAdmin.mockResolvedValue(false);
    mockUserProgressFindFirst.mockResolvedValue({
      userId: "child_valentina",
      userName: "Valentina",
      userImageSrc: "/avatars/pasko.png",
    });
    mockPodsFindMany.mockResolvedValue([
      { id: 1, ownerId: "parent_adriana", members: [{ userId: "child_valentina" }] },
    ]);
    mockClerkGetUser.mockResolvedValue({ username: "valentina_z" });

    const res = await issueStudentQrTokenBadge("child_valentina", { revokePrevious: true });

    expect(res.success).toBe(true);
    expect(res.child?.username).toBe("valentina_z");
    expect(isValidQrBadgeTokenFormat(res.child!.token)).toBe(true);

    // Crucial ADR-002 invariant: Clerk password is NEVER touched!
    expect(mockClerkUpdateUser).not.toHaveBeenCalled();

    // Only SHA-256 hash stored in DB (never raw token)
    expect(mockV2UpdateSet).toHaveBeenCalledOnce();
    expect(mockV2InsertValues).toHaveBeenCalledWith({
      tokenHash: hashQrBadgeToken(res.child!.token),
      userId: "child_valentina",
      createdByUserId: "parent_adriana",
    });
  });

  it("issues team QR badges for all learner members without touching any Clerk password", async () => {
    mockAuth.mockResolvedValue({ userId: "parent_adriana" });
    mockIsSuperAdmin.mockResolvedValue(false);
    mockPodsFindFirst.mockResolvedValue({
      id: 7,
      name: "Zdelar Family",
      inviteCode: "ZDELAR",
      ownerId: "parent_adriana",
      members: [
        { userId: "parent_adriana", role: "owner" },
        { userId: "child_vanessa", role: "member" },
        { userId: "child_valentina", role: "member" },
      ],
    });
    mockPodsFindMany.mockResolvedValue([
      {
        id: 7,
        ownerId: "parent_adriana",
        members: [
          { userId: "child_vanessa", role: "member" },
          { userId: "child_valentina", role: "member" },
        ],
      },
    ]);
    mockUserProgressFindFirst
      .mockResolvedValueOnce({
        userId: "child_vanessa",
        userName: "Vanessa",
        userImageSrc: "/avatars/mia.png",
      })
      .mockResolvedValueOnce({
        userId: "child_valentina",
        userName: "Valentina",
        userImageSrc: "/avatars/pasko.png",
      });
    mockClerkGetUser
      .mockResolvedValueOnce({ username: "vanessa_z" })
      .mockResolvedValueOnce({ username: "valentina_z" });

    const res = await issueTeamQrTokenBadges(7);

    expect(res.success).toBe(true);
    expect(res.passes).toHaveLength(2);
    expect(res.failures).toHaveLength(0);
    expect(mockClerkUpdateUser).not.toHaveBeenCalled();
  });
});
