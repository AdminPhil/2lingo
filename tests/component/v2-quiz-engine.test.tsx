import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt || ""} />
  ),
}));

vi.mock("react-confetti", () => ({
  default: () => null,
}));

vi.mock("@/lib/hooks/browser-hooks", () => ({
  useAudio: () => [null, {}, { play: vi.fn() }],
  useMount: (fn: () => void) => {
    React.useEffect(() => {
      fn();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  },
  useWindowSize: () => ({ width: 1024, height: 768 }),
  useKey: vi.fn(),
  useMedia: () => false,
}));

import { V2Quiz } from "@/features/quiz/v2-quiz";
import type { V2QuizChallenge } from "@/features/quiz/quiz-machine";

describe("<V2Quiz /> 4-Tier State-Machine Engine (LISTEN + BUILD_SENTENCE)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("advances cleanly through LISTEN and BUILD_SENTENCE challenges with zero double-submit", async () => {
    const onSubmitCorrect = vi.fn().mockResolvedValue({ isLessonCompleted: false });
    const onSubmitWrong = vi.fn().mockResolvedValue({ hearts: 4 });

    const challenges: V2QuizChallenge[] = [
      {
        id: 101,
        order: 1,
        type: "LISTEN",
        prompt: "Tap what you hear in Croatian",
        completed: false,
        audioSrc: "/audio/hr/dobro_jutro.mp3",
        options: [
          {
            id: 1,
            text: "Dobro jutro.",
            correct: true,
            imageSrc: null,
            audioSrc: "/audio/hr/dobro_jutro.mp3",
          },
          {
            id: 2,
            text: "Laku noć.",
            correct: false,
            imageSrc: null,
            audioSrc: "/audio/hr/laku_noc.mp3",
          },
        ],
      },
      {
        id: 102,
        order: 2,
        type: "BUILD_SENTENCE",
        prompt: 'Build in Croatian: "We see the sea."',
        completed: false,
        targetSentence: "Vidimo more.",
        wordBank: ["more", "Vidimo", "šumu"],
        options: [],
      },
    ];

    render(
      <V2Quiz
        lessonId={10}
        challenges={challenges}
        initialHearts={5}
        initialPercentage={0}
        onSubmitCorrect={onSubmitCorrect}
        onSubmitWrong={onSubmitWrong}
      />
    );

    // 1. Tier 3 LISTEN challenge renders audio player & options
    expect(screen.getByText("Listen and select the Croatian phrase")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Play Croatian audio" })).toBeTruthy();
    fireEvent.click(screen.getByText("Dobro jutro."));
    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => {
      expect(onSubmitCorrect).toHaveBeenCalledTimes(1);
      expect(onSubmitCorrect).toHaveBeenCalledWith(101);
    });

    // Advance to Challenge 2
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // 2. Tier 5 BUILD_SENTENCE challenge renders word bank tiles
    expect(screen.getByText("Build the Croatian sentence")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Vidimo" }));
    fireEvent.click(screen.getByRole("button", { name: "more" }));
    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => {
      expect(onSubmitCorrect).toHaveBeenCalledTimes(2);
      expect(onSubmitCorrect).toHaveBeenCalledWith(102);
    });
    expect(onSubmitWrong).not.toHaveBeenCalled();
  });
});
