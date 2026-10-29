/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@clerk/nextjs", async () => {
  const mockClerk = await import("@/tests/mocks/clerk");
  return {
    ...mockClerk,
  };
});

vi.mock("next/navigation", () => ({
  usePathname: () => "/learn",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/app/(marketing)/header";

describe("CR-077 Pure Brand Header & Student Parent Portal Isolation", () => {
  describe("<Header /> Pure Brand Marketing Banner", () => {
    it("renders brand elements (CroLingo title, mascot, Croatian badge)", () => {
      render(<Header />);
      expect(screen.getByText("CroLingo")).toBeInTheDocument();
      expect(screen.getByText("Hrvatski")).toBeInTheDocument();
      expect(screen.getByAltText("Paško the Dalmatian")).toBeInTheDocument();
    });

    it("does not render any buttons, sign-in controls, or parent portal links", () => {
      render(<Header />);
      const buttons = screen.queryAllByRole("button");
      expect(buttons).toHaveLength(0);

      expect(screen.queryByText(/parent/i)).toBeNull();
      expect(screen.queryByText(/login/i)).toBeNull();
      expect(screen.queryByText(/sign in/i)).toBeNull();
    });
  });

  describe("<Sidebar /> Role Isolation", () => {
    it("does NOT render Parent Center when isAdmin is false (student/learner)", () => {
      render(<Sidebar isAdmin={false} />);
      expect(screen.queryByText("Parent Center")).toBeNull();
      expect(screen.getByText("Learn")).toBeInTheDocument();
      expect(screen.getByText("Leaderboard")).toBeInTheDocument();
      expect(screen.getByText("Quests")).toBeInTheDocument();
    });

    it("does NOT render Parent Center when isAdmin is undefined", () => {
      render(<Sidebar />);
      expect(screen.queryByText("Parent Center")).toBeNull();
      expect(screen.getByText("Learn")).toBeInTheDocument();
    });

    it("renders Parent Center linking to /admin when isAdmin is true (parent/educator/admin)", () => {
      render(<Sidebar isAdmin={true} />);
      const parentCenterItem = screen.getByText("Parent Center");
      expect(parentCenterItem).toBeInTheDocument();

      const link = parentCenterItem.closest("a");
      expect(link).toHaveAttribute("href", "/admin");
    });
  });
});
