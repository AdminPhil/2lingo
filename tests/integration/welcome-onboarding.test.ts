import { describe, it, expect, beforeEach, vi } from "vitest";

const mockRedirect = vi.fn((url: string) => {
  const err: any = new Error(`NEXT_REDIRECT: ${url}`);
  err.url = url;
  throw err;
});

vi.mock("next/navigation", () => ({
  redirect: (url: string) => mockRedirect(url),
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
import WelcomePage from "@/app/(main)/welcome/page";

describe("CR-075: /welcome Route & Intent-Driven Role Provisioning Integration", () => {
  beforeEach(() => {
    resetMockClerk();
    resetMockDb({
      pods: [],
      podMembers: [],
      userProgress: [],
    });
    mockRedirect.mockClear();
  });

  it("redirects unauthenticated visitor to '/'", async () => {
    setMockAuth(null);

    await expect(WelcomePage({})).rejects.toThrow("NEXT_REDIRECT: /");
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  describe("Teacher Onboarding (?role=teacher)", () => {
    it("provisions a classroom team (5000 XP) and redirects to /admin?wizard=classroom", async () => {
      setMockAuth("teacher_mario", {
        id: "teacher_mario",
        firstName: "Mario",
        username: "mario_teacher",
        imageUrl: "/avatars/matija.png",
      });

      await expect(
        WelcomePage({ searchParams: { role: "teacher" } })
      ).rejects.toThrow("NEXT_REDIRECT: /admin?wizard=classroom");

      expect(mockRedirect).toHaveBeenCalledWith("/admin?wizard=classroom");

      // Verify userProgress has role='parent' (educator administrative role)
      const teacherProgress = store.userProgress.find((u) => u.userId === "teacher_mario");
      expect(teacherProgress).toBeDefined();
      expect(teacherProgress?.role).toBe("parent");
      expect(teacherProgress?.userName).toBe("Mario");

      // Verify a new classroom pod was created
      const classroomPod = store.pods.find((p) => p.ownerId === "teacher_mario");
      expect(classroomPod).toBeDefined();
      expect(classroomPod?.name).toBe("Mario's Classroom Team");
      expect(classroomPod?.type).toBe("classroom");
      expect(classroomPod?.targetXp).toBe(5000);

      // Verify teacher was added as owner in podMembers
      const membership = store.podMembers.find(
        (m) => m.podId === classroomPod?.id && m.userId === "teacher_mario"
      );
      expect(membership).toBeDefined();
      expect(membership?.role).toBe("owner");
    });

    it("does not create a duplicate classroom pod if teacher already owns one", async () => {
      store.pods.push({
        id: 77,
        name: "Existing Grade 4 Team",
        type: "classroom",
        inviteCode: "GRADE4",
        ownerId: "teacher_existing",
        targetXp: 5000,
        currentXp: 150,
      });

      setMockAuth("teacher_existing", {
        id: "teacher_existing",
        firstName: "Ivana",
      });

      await expect(
        WelcomePage({ searchParams: { role: "teacher" } })
      ).rejects.toThrow("NEXT_REDIRECT: /admin?wizard=classroom");

      expect(mockRedirect).toHaveBeenCalledWith("/admin?wizard=classroom");

      // Still only 1 pod owned by this teacher
      const podsForTeacher = store.pods.filter((p) => p.ownerId === "teacher_existing");
      expect(podsForTeacher.length).toBe(1);
      expect(podsForTeacher[0].id).toBe(77);
    });
  });

  describe("Parent Onboarding (?role=parent)", () => {
    it("provisions a family team (1000 XP) and redirects to /admin?wizard=family", async () => {
      setMockAuth("parent_mirko", {
        id: "parent_mirko",
        firstName: "Mirko",
        username: "mirko_p",
      });

      await expect(
        WelcomePage({ searchParams: { role: "parent" } })
      ).rejects.toThrow("NEXT_REDIRECT: /admin?wizard=family");

      expect(mockRedirect).toHaveBeenCalledWith("/admin?wizard=family");

      // Verify userProgress
      const parentProgress = store.userProgress.find((u) => u.userId === "parent_mirko");
      expect(parentProgress).toBeDefined();
      expect(parentProgress?.role).toBe("parent");
      expect(parentProgress?.userName).toBe("Mirko");

      // Verify family pod
      const familyPod = store.pods.find((p) => p.ownerId === "parent_mirko");
      expect(familyPod).toBeDefined();
      expect(familyPod?.name).toBe("Mirko's Family Team");
      expect(familyPod?.type).toBe("family");
      expect(familyPod?.targetXp).toBe(1000);

      // Verify owner membership
      const membership = store.podMembers.find(
        (m) => m.podId === familyPod?.id && m.userId === "parent_mirko"
      );
      expect(membership).toBeDefined();
      expect(membership?.role).toBe("owner");
    });

    it("does not create a duplicate family pod if parent already owns one", async () => {
      store.pods.push({
        id: 88,
        name: "Existing Horvat Family",
        type: "family",
        inviteCode: "HORVAT8",
        ownerId: "parent_existing",
        targetXp: 1000,
        currentXp: 450,
      });

      setMockAuth("parent_existing", {
        id: "parent_existing",
        firstName: "Jelena",
      });

      await expect(
        WelcomePage({ searchParams: { role: "parent" } })
      ).rejects.toThrow("NEXT_REDIRECT: /admin?wizard=family");

      expect(mockRedirect).toHaveBeenCalledWith("/admin?wizard=family");

      const podsForParent = store.pods.filter((p) => p.ownerId === "parent_existing");
      expect(podsForParent.length).toBe(1);
      expect(podsForParent[0].id).toBe(88);
    });
  });

  describe("Fallback & Team Join Preservation", () => {
    it("preserves join parameter and redirects to /learn?join=CODE", async () => {
      setMockAuth("student_filip", {
        id: "student_filip",
        firstName: "Filip",
      });

      await expect(
        WelcomePage({ searchParams: { join: "SKOLA9" } })
      ).rejects.toThrow("NEXT_REDIRECT: /learn?join=SKOLA9");

      expect(mockRedirect).toHaveBeenCalledWith("/learn?join=SKOLA9");
    });

    it("redirects existing parent to /admin when no role specified", async () => {
      store.userProgress.push({
        userId: "known_parent",
        userName: "Zdenka",
        role: "parent",
        points: 0,
        hearts: 5,
      });

      setMockAuth("known_parent", {
        id: "known_parent",
        firstName: "Zdenka",
      });

      await expect(WelcomePage({})).rejects.toThrow("NEXT_REDIRECT: /admin");
      expect(mockRedirect).toHaveBeenCalledWith("/admin");
    });

    it("redirects standard learner to /learn when no role specified", async () => {
      store.userProgress.push({
        userId: "learner_marko",
        userName: "Marko",
        role: "learner",
        points: 100,
        hearts: 5,
      });

      setMockAuth("learner_marko", {
        id: "learner_marko",
        firstName: "Marko",
      });

      await expect(WelcomePage({})).rejects.toThrow("NEXT_REDIRECT: /learn");
      expect(mockRedirect).toHaveBeenCalledWith("/learn");
    });
  });
});
