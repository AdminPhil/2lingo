import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockUpsertChallengeProgress = vi.fn();
const mockReduceHearts = vi.fn();

vi.mock("@/actions/challenge-progress", () => ({
  upsertChallengeProgress: (...args: any[]) => mockUpsertChallengeProgress(...args),
}));

vi.mock("@/actions/user-progress", () => ({
  reduceHearts: (...args: any[]) => mockReduceHearts(...args),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("react-confetti", () => ({
  default: () => <div data-testid="confetti" />,
}));

vi.mock("react-use", () => ({
  useAudio: () => [<audio key="a" />, {}, { play: vi.fn() }],
  useWindowSize: () => ({ width: 1024, height: 768 }),
  useMount: () => {},
  useMedia: () => false,
  useKey: (key: string, fn: () => void, _opts?: any, deps?: any[]) => {
    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === key) fn();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps || [key, fn]);
  },
}));

vi.mock("@/lib/tts", () => ({
  speakText: vi.fn(),
}));

import { Quiz } from "@/app/lesson/quiz";

const mockChallenges = [
  {
    id: 696,
    lessonId: 162,
    type: "ASSIST" as const,
    question: 'Select the correct translation: "The knight rides."',
    order: 1,
    completed: false,
    challengeOptions: [
      { id: 7928, challengeId: 696, text: "Vitez jaše.", correct: true, imageSrc: null, audioSrc: "/audio/hr/vitez_jase.mp3" },
      { id: 7929, challengeId: 696, text: "Konj stoji.", correct: false, imageSrc: null, audioSrc: "/audio/hr/konj_stoji.mp3" },
    ],
  },
  {
    id: 697,
    lessonId: 162,
    type: "ASSIST" as const,
    question: 'Select the correct translation: "We are moving along the track."',
    order: 2,
    completed: false,
    challengeOptions: [
      { id: 7932, challengeId: 697, text: "Krećemo se po stazi.", correct: true, imageSrc: null, audioSrc: "/audio/hr/krecemo_se_po_stazi.mp3" },
      { id: 7933, challengeId: 697, text: "Jahač trči stazom.", correct: false, imageSrc: null, audioSrc: "/audio/hr/jahac_trci_stazom.mp3" },
    ],
  },
];

describe("BUG-049: Quiz Submission Lock & Next-Button Soft-Lock Prevention", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deduplicates rapid Check clicks + Enter presses while Server Action is in flight and keeps next challenge selectable", async () => {
    let resolveFirst!: (val: any) => void;
    const firstPromise = new Promise((res) => {
      resolveFirst = res;
    });
    mockUpsertChallengeProgress.mockReturnValueOnce(firstPromise);

    render(
      <Quiz
        initialLessonId={162}
        initialLessonChallenges={mockChallenges}
        initialHearts={5}
        initialPercentage={0}
        userSubscription={null}
        lessonOrder={2}
      />
    );

    // Select correct option on Challenge 1
    fireEvent.click(screen.getByText("Vitez jaše."));
    const checkBtn = screen.getByRole("button", { name: /Check/i });
    expect(checkBtn).not.toBeDisabled();

    // Rapidly click Check twice AND hit Enter while first Server Action is still pending
    fireEvent.click(checkBtn);
    fireEvent.click(checkBtn);
    fireEvent.keyDown(window, { key: "Enter" });

    // Must only submit once and keep Check disabled while in flight
    expect(mockUpsertChallengeProgress).toHaveBeenCalledTimes(1);
    expect(checkBtn).toBeDisabled();

    // Resolve first submission -> footer becomes "Nicely done!" with enabled Next button
    resolveFirst({ isLessonCompleted: false });
    const nextBtn = await screen.findByRole("button", { name: /Next/i });
    expect(nextBtn).not.toBeDisabled();
    expect(screen.getByText("Nicely done!")).toBeInTheDocument();

    // Click Next -> advances to Challenge 2, status resets to "none", answers ARE selectable
    fireEvent.click(nextBtn);
    expect(screen.getByText(/We are moving along the track/i)).toBeInTheDocument();
    expect(screen.queryByText("Nicely done!")).not.toBeInTheDocument();

    // Verify Challenge 2 answer is selectable and enables Check
    const checkBtn2 = screen.getByRole("button", { name: /Check/i });
    expect(checkBtn2).toBeDisabled();

    fireEvent.click(screen.getByText("Krećemo se po stazi."));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Check/i })).not.toBeDisabled();
    });
  });
});
