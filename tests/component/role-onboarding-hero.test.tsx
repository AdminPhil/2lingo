/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@clerk/nextjs", async () => {
  const mockClerk = await import("@/tests/mocks/clerk");
  return {
    ...mockClerk,
  };
});

import { setMockAuth, resetMockClerk } from "@/tests/mocks/clerk";
import { RoleOnboardingHero } from "@/components/onboarding/role-onboarding-hero";

describe("<RoleOnboardingHero /> CR-075 Role-Aware Landing Page Hero Tests", () => {
  beforeEach(() => {
    resetMockClerk();
  });

  describe("Signed-Out Mode & Role Chooser", () => {
    it("renders the 3-way role pill bar with Learner selected by default", () => {
      setMockAuth(null);
      render(<RoleOnboardingHero isParent={false} />);

      // Role pill buttons
      expect(screen.getByRole("button", { name: /learner/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /parent/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /teacher/i })).toBeInTheDocument();

      // Default learner content
      expect(screen.getByText("Student & Independent Learner")).toBeInTheDocument();
      expect(screen.getByText(/Playful bite-sized lessons/i)).toBeInTheDocument();

      // Action buttons
      expect(screen.getByText("I'm New Here! Start Learning")).toBeInTheDocument();
      expect(screen.getByText("I Already Have an Account")).toBeInTheDocument();

      // Team code input form
      expect(screen.getByPlaceholderText("e.g. HRVAT3")).toBeInTheDocument();
    });

    it("switches to Parent role view when Parent pill is clicked", () => {
      setMockAuth(null);
      render(<RoleOnboardingHero isParent={false} />);

      const parentBtn = screen.getByRole("button", { name: /parent/i });
      fireEvent.click(parentBtn);

      // Parent content
      expect(screen.getByText("Croatian Family Team Setup")).toBeInTheDocument();
      expect(screen.getByText(/Set up your family in 2 minutes/i)).toBeInTheDocument();

      // Parent buttons & target routing
      const signUpContainer = screen.getByText("Set Up Family Team (Free)").closest("[data-testid='clerk-sign-up-btn']");
      expect(signUpContainer).toHaveAttribute("data-after-sign-up", "/welcome?role=parent");
      expect(signUpContainer).toHaveAttribute("data-after-sign-in", "/welcome?role=parent");

      const signInContainer = screen.getByText("Parent Sign In").closest("[data-testid='clerk-sign-in-btn']");
      expect(signInContainer).toHaveAttribute("data-after-sign-in", "/admin");
    });

    it("switches to Teacher role view when Teacher pill is clicked", () => {
      setMockAuth(null);
      render(<RoleOnboardingHero isParent={false} />);

      const teacherBtn = screen.getByRole("button", { name: /teacher/i });
      fireEvent.click(teacherBtn);

      // Teacher content
      expect(screen.getByText("Classroom & Heritage School Setup")).toBeInTheDocument();
      expect(screen.getByText(/Paste your student roster, print desk or lanyard passes/i)).toBeInTheDocument();

      // Teacher buttons & target routing
      const signUpContainer = screen.getByText("Set Up Classroom Team (Free)").closest("[data-testid='clerk-sign-up-btn']");
      expect(signUpContainer).toHaveAttribute("data-after-sign-up", "/welcome?role=teacher");
      expect(signUpContainer).toHaveAttribute("data-after-sign-in", "/welcome?role=teacher");

      const signInContainer = screen.getByText("Teacher Sign In").closest("[data-testid='clerk-sign-in-btn']");
      expect(signInContainer).toHaveAttribute("data-after-sign-in", "/admin");
    });

    it("renders team join banner and sets redirect URLs when initialJoinCode is passed", () => {
      setMockAuth(null);
      render(
        <RoleOnboardingHero
          isParent={false}
          initialJoinCode="HRVAT3"
          initialTeamName="Razred 3B"
        />
      );

      // Celebratory banner
      expect(screen.getByText("HRVAT3")).toBeInTheDocument();
      expect(screen.getByText(/Razred 3B/i)).toBeInTheDocument();
      expect(screen.getByText(/Sign up below to join automatically/i)).toBeInTheDocument();

      // Learner sign up buttons preserve join code
      const signUpContainer = screen.getByText("I'm New Here! Start Learning").closest("[data-testid='clerk-sign-up-btn']");
      expect(signUpContainer).toHaveAttribute("data-after-sign-up", "/learn?join=HRVAT3");
      expect(signUpContainer).toHaveAttribute("data-after-sign-in", "/learn?join=HRVAT3");
    });

    it("updates active join code when student enters code into inline form", () => {
      setMockAuth(null);
      render(<RoleOnboardingHero isParent={false} />);

      const input = screen.getByPlaceholderText("e.g. HRVAT3");
      const joinBtn = screen.getByRole("button", { name: "Join" });

      // Enter code "zgomba"
      fireEvent.change(input, { target: { value: "zgomba" } });
      fireEvent.click(joinBtn);

      // Code is uppercased and banner renders
      expect(screen.getByText("ZGOMBA")).toBeInTheDocument();

      // Sign-up button redirects with ?join=ZGOMBA
      const signUpContainer = screen.getByText("I'm New Here! Start Learning").closest("[data-testid='clerk-sign-up-btn']");
      expect(signUpContainer).toHaveAttribute("data-after-sign-up", "/learn?join=ZGOMBA");
    });
  });

  describe("Signed-In Mode", () => {
    it("renders Parent & Educator Center link when authenticated parent", () => {
      setMockAuth("user_parent_1", { id: "user_parent_1", firstName: "Ana" });
      render(<RoleOnboardingHero isParent={true} />);

      expect(screen.getByText("Open Parent & Educator Center")).toBeInTheDocument();
      const link = screen.getByRole("link", { name: /Open Parent & Educator Center/i });
      expect(link).toHaveAttribute("href", "/admin");
    });

    it("renders Continue Learning link when authenticated learner", () => {
      setMockAuth("user_student_1", { id: "user_student_1", firstName: "Luka" });
      render(<RoleOnboardingHero isParent={false} />);

      expect(screen.getByText("Continue Learning")).toBeInTheDocument();
      const link = screen.getByRole("link", { name: /Continue Learning/i });
      expect(link).toHaveAttribute("href", "/learn");
    });
  });
});
