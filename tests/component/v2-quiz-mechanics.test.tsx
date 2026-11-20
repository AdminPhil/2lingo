import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("react-confetti", () => ({
  default: () => <div data-testid="confetti" />,
}));

vi.mock("@/lib/tts", () => ({
  speakText: vi.fn(),
}));

import { V2Quiz } from "@/features/quiz/v2-quiz";
import { V2QuizChallenge } from "@/features/quiz/quiz-machine";
import { WorldNavigator } from "@/app/(main)/learn/world-navigator";

const mixedChallenges: V2QuizChallenge[] = [
  {
    id: 901,
    order: 1,
    type: "LISTEN",
    prompt: "Tap what you hear",
    completed: false,
    audioSrc: "/audio/hr/brod_ulazi_u_luku.mp3",
    options: [
      { id: 11, text: "Brod ulazi u luku.", correct: true, audioSrc: "/audio/hr/brod_ulazi_u_luku.mp3" },
      { id: 12, text: "Brod stoji u luci.", correct: false, audioSrc: "/audio/hr/sidro_drzi_brod_mirno.mp3" },
    ],
  },
  {
    id: 902,
    order: 2,
    type: "BUILD_SENTENCE",
    prompt: 'Translate: "The ship enters the port."',
    completed: false,
    targetSentence: "Brod ulazi u luku.",
    wordBank: ["luku", "Brod", "luci", "ulazi", "u"],
    options: [],
  },
];

describe("Phase 2: V2Quiz (LISTEN + BUILD_SENTENCE) & Level-Tabbed WorldNavigator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completes a LISTEN challenge followed by a BUILD_SENTENCE challenge end-to-end", async () => {
    const onSubmitCorrect = vi.fn().mockResolvedValue({ isLessonCompleted: false });
    const onSubmitWrong = vi.fn().mockResolvedValue({ hearts: 4 });

    render(
      <V2Quiz
        lessonId={99}
        challenges={mixedChallenges}
        initialHearts={5}
        initialPercentage={0}
        onSubmitCorrect={onSubmitCorrect}
        onSubmitWrong={onSubmitWrong}
      />
    );

    // Step 1: LISTEN prompt renders speaker & slow snail buttons without leaking English text
    expect(screen.getByRole("button", { name: /Play Croatian audio/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Play slowly/i })).toBeInTheDocument();

    fireEvent.click(screen.getByText("Brod ulazi u luku."));
    fireEvent.click(screen.getByRole("button", { name: /Check/i }));

    await waitFor(() => {
      expect(onSubmitCorrect).toHaveBeenCalledWith(901);
      expect(screen.getByText("Nicely done!")).toBeInTheDocument();
    });

    // Advance to Step 2: BUILD_SENTENCE
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByText(/Build the Croatian sentence/i)).toBeInTheDocument();

    // Tap word bank tiles in order: Brod -> ulazi -> u -> luku
    fireEvent.click(screen.getByRole("button", { name: "Brod" }));
    fireEvent.click(screen.getByRole("button", { name: "ulazi" }));
    fireEvent.click(screen.getByRole("button", { name: "u" }));
    fireEvent.click(screen.getByRole("button", { name: "luku" }));

    fireEvent.click(screen.getByRole("button", { name: /Check/i }));

    await waitFor(() => {
      expect(onSubmitCorrect).toHaveBeenCalledWith(902);
      expect(screen.getByText("Nicely done!")).toBeInTheDocument();
    });

    // Finish lesson
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    expect(await screen.findByText(/Svaka čast!/i)).toBeInTheDocument();
  });

  it("renders dynamic Level tabs (Levels 1-3) and scopes World buttons to selected Level", () => {
    render(<WorldNavigator activeUnitOrder={46} selectedLevel={3} />);

    // All 3 Levels present as tabs
    expect(screen.getByRole("tab", { name: /Level 1/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Level 2/i })).toBeInTheDocument();
    const level3Tab = screen.getByRole("tab", { name: /Level 3/i });
    expect(level3Tab).toHaveAttribute("aria-selected", "true");

    // Level 3 Worlds (W9-W12) rendered; Level 1 World 1 (Zagreb) NOT cluttering bar
    expect(screen.getByText(/W10: Kvarner & Rijeka/i)).toBeInTheDocument();
    expect(screen.getByText(/W12: Velebit/i)).toBeInTheDocument();
    expect(screen.queryByText(/W1: Capital Adventure/i)).not.toBeInTheDocument();
  });
});
