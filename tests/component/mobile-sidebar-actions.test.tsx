/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockPush = vi.fn();
const mockSignOut = vi.fn((cb?: any) => {
  if (typeof cb === "function") cb();
  return Promise.resolve();
});

vi.mock("@clerk/nextjs", () => ({
  useClerk: () => ({
    signOut: mockSignOut,
  }),
  useUser: () => ({ user: { id: "test_user" }, isLoaded: true, isSignedIn: true }),
  ClerkLoaded: ({ children }: any) => <div>{children}</div>,
  ClerkLoading: ({ children }: any) => null,
  UserButton: ({ afterSignOutUrl }: any) => (
    <div data-testid="clerk-user-btn" data-after-sign-out={afterSignOutUrl} />
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/learn",
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const mockModalOpen = vi.fn();
vi.mock("@/store/use-profile-switcher-modal", () => ({
  useProfileSwitcherModal: () => ({
    open: mockModalOpen,
    isOpen: false,
    close: vi.fn(),
  }),
}));

import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { SignOutButton } from "@/components/sign-out-button";
import { SwitchProfileButton } from "@/components/switch-profile-button";

describe("BUG-043: Mobile Navigation Drawer Sign Out & Profile Switcher Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SignOutButton", () => {
    it("renders with icon and label", () => {
      render(<SignOutButton />);
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
      expect(screen.getByTitle("Sign out of CroLingo")).toBeInTheDocument();
    });

    it("triggers onAction callback and calls clerk signOut redirecting to /", async () => {
      const mockAction = vi.fn();
      render(<SignOutButton onAction={mockAction} />);

      const btn = screen.getByText("Sign Out");
      fireEvent.click(btn);

      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("SwitchProfileButton", () => {
    it("renders with icon and label", () => {
      render(<SwitchProfileButton />);
      expect(screen.getByText("Switch Profile")).toBeInTheDocument();
    });

    it("triggers onAction callback and opens profile switcher modal", () => {
      const mockAction = vi.fn();
      render(<SwitchProfileButton onAction={mockAction} />);

      const btn = screen.getByText("Switch Profile");
      fireEvent.click(btn);

      expect(mockAction).toHaveBeenCalledTimes(1);
      expect(mockModalOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("<Sidebar /> Footer Layout & Actions", () => {
    it("renders Clerk UserButton, SignOutButton, and SwitchProfileButton", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("clerk-user-btn")).toBeInTheDocument();
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
      expect(screen.getByText("Switch Profile")).toBeInTheDocument();
    });

    it("propagates onAction to navigation links and footer buttons", () => {
      const mockAction = vi.fn();
      render(<Sidebar onAction={mockAction} />);

      const learnLink = screen.getByText("Learn").closest("a");
      expect(learnLink).toBeInTheDocument();
      fireEvent.click(learnLink!);
      expect(mockAction).toHaveBeenCalledTimes(1);

      const switchBtn = screen.getByText("Switch Profile");
      fireEvent.click(switchBtn);
      expect(mockAction).toHaveBeenCalledTimes(2);
      expect(mockModalOpen).toHaveBeenCalledTimes(1);

      const signOutBtn = screen.getByText("Sign Out");
      fireEvent.click(signOutBtn);
      expect(mockAction).toHaveBeenCalledTimes(3);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  describe("<MobileSidebar /> Accessible Trigger", () => {
    it("renders accessible menu button", () => {
      render(<MobileSidebar />);
      const btn = screen.getByRole("button", { name: /open mobile navigation menu/i });
      expect(btn).toBeInTheDocument();
    });
  });
});
