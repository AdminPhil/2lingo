/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/admin/parent-setup-wizard-modal", () => ({
  ParentSetupWizardModal: ({ isOpen, podName }: any) =>
    isOpen ? <div data-testid="parent-wizard-open">Parent Wizard: {podName}</div> : null,
}));

vi.mock("@/components/admin/teacher-setup-wizard-modal", () => ({
  TeacherSetupWizardModal: ({ isOpen, podName }: any) =>
    isOpen ? <div data-testid="teacher-wizard-open">Teacher Wizard: {podName}</div> : null,
}));

vi.mock("@/components/admin/add-child-modal", () => ({
  AddChildModal: () => null,
}));

vi.mock("@/components/admin/join-slide-modal", () => ({
  JoinSlideModal: () => null,
}));

vi.mock("@/components/admin/pod-management-card", () => ({
  PodManagementCard: () => null,
}));

vi.mock("@/components/admin/how-to-add-children-card", () => ({
  HowToAddChildrenCard: () => null,
}));

vi.mock("@/components/admin/learner-health-card", () => ({
  LearnerHealthCard: () => null,
}));

vi.mock("@/components/admin/tricky-words-card", () => ({
  TrickyWordsCard: () => null,
}));

import { AdminCommandCenter } from "@/components/admin/admin-command-center";

describe("CR-075: AdminCommandCenter Wizard Auto-Launch Logic", () => {
  const baseProps = {
    parentName: "Ivana",
    superAdmin: false,
    activePodId: 10,
    podName: "Ivana's Classroom Team",
    podType: "classroom",
    inviteCode: "IVANA1",
    currentXp: 0,
    targetXp: 5000,
    progressPercent: 0,
    activeStreakCount: 0,
    formattedPods: [
      {
        id: 10,
        name: "Ivana's Classroom Team",
        type: "classroom",
        inviteCode: "IVANA1",
        targetXp: 5000,
        currentXp: 0,
        celebrationUnlocked: false,
        memberCount: 0,
        members: [],
      },
    ],
    availableUsers: [],
    analyticsData: {
      topTrickyWords: [],
      unitMasteries: [],
      conversationPrompts: [],
      totalMistakes: 0,
      totalCompleted: 0,
      overallAccuracyRate: 100,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("auto-launches TeacherSetupWizardModal when initialWizard='classroom'", () => {
    render(
      <AdminCommandCenter
        {...baseProps}
        learners={[]}
        initialWizard="classroom"
      />
    );

    expect(screen.getByTestId("teacher-wizard-open")).toBeInTheDocument();
    expect(screen.getByText(/Teacher Wizard: Ivana's Classroom Team/)).toBeInTheDocument();
  });

  it("auto-launches ParentSetupWizardModal when initialWizard='family'", () => {
    render(
      <AdminCommandCenter
        {...baseProps}
        podName="Ivana's Family Team"
        podType="family"
        learners={[]}
        initialWizard="family"
      />
    );

    expect(screen.getByTestId("parent-wizard-open")).toBeInTheDocument();
    expect(screen.getByText(/Parent Wizard: Ivana's Family Team/)).toBeInTheDocument();
  });

  it("auto-prompts TeacherSetupWizardModal when newly provisioned classroom has 0 learners", () => {
    render(
      <AdminCommandCenter
        {...baseProps}
        podType="classroom"
        learners={[]}
      />
    );

    expect(screen.getByTestId("teacher-wizard-open")).toBeInTheDocument();
  });

  it("auto-prompts ParentSetupWizardModal when newly provisioned family has 0 learners", () => {
    render(
      <AdminCommandCenter
        {...baseProps}
        podName="The Horvats"
        podType="family"
        learners={[]}
      />
    );

    expect(screen.getByTestId("parent-wizard-open")).toBeInTheDocument();
  });

  it("does not auto-launch wizards when team already has learners and no wizard requested", () => {
    const existingLearners = [
      {
        userId: "child_1",
        userName: "Luka",
        userImageSrc: "/avatars/luka.png",
        points: 50,
        hearts: 5,
        heartsUsed: 0,
        streak: 1,
        lastActiveDate: "2026-10-28",
      },
    ];

    render(
      <AdminCommandCenter
        {...baseProps}
        learners={existingLearners}
      />
    );

    expect(screen.queryByTestId("teacher-wizard-open")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-wizard-open")).not.toBeInTheDocument();
  });
});
