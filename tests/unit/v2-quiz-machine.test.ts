import { describe, it, expect } from "vitest";
import {
  V2QuizChallenge,
  canSubmitAnswer,
  createInitialQuizState,
  gradeBuildSentence,
  gradeChallengeAnswer,
  normalizeCroatianSentence,
  quizReducer,
} from "@/features/quiz/quiz-machine";
import {
  getLevelForUnitOrder,
  getUnitRangeForLevel,
  isSuperIzazovLesson,
} from "@/lib/v2/lesson-helpers";

const sampleChallenges: V2QuizChallenge[] = [
  {
    id: 101,
    order: 1,
    type: "LISTEN",
    prompt: "Tap what you hear",
    completed: false,
    audioSrc: "/audio/hr/brod_ulazi_u_luku.mp3",
    options: [
      { id: 1, text: "Brod ulazi u luku.", correct: true, audioSrc: "/audio/hr/brod_ulazi_u_luku.mp3" },
      { id: 2, text: "Brod stoji u luci.", correct: false, audioSrc: "/audio/hr/sidro_drzi_brod_mirno.mp3" },
    ],
  },
  {
    id: 102,
    order: 2,
    type: "BUILD_SENTENCE",
    prompt: 'Translate: "The ship enters the port."',
    completed: false,
    targetSentence: "Brod ulazi u luku.",
    acceptedAnswers: ["Brod ulazi u luku"],
    wordBank: ["luku", "Brod", "luci", "ulazi", "u"],
    options: [],
  },
];

describe("features/quiz/quiz-machine.ts - 4-Tier Pure State Machine", () => {
  it("normalizes and grades Croatian BUILD_SENTENCE answers with diacritic preservation", () => {
    expect(normalizeCroatianSentence("  Čista voda!  ")).toBe("čista voda");
    expect(gradeBuildSentence(["Brod", "ulazi", "u", "luku"], "Brod ulazi u luku.")).toBe(true);
    expect(gradeBuildSentence(["Brod", "ulazi", "u", "luci"], "Brod ulazi u luku.")).toBe(false);
    expect(gradeBuildSentence([], "Brod ulazi u luku.")).toBe(false);
  });

  it("blocks stale SUBMIT_SUCCESS responses from a previous challenge (BUG-049 immune)", () => {
    let state = createInitialQuizState(sampleChallenges, 5, 0);
    state = quizReducer(state, { type: "SELECT_OPTION", optionId: 1 });
    expect(canSubmitAnswer(sampleChallenges[0], state)).toBe(true);

    state = quizReducer(state, { type: "START_SUBMIT" });
    // Attempting a second START_SUBMIT or SELECT_OPTION while SUBMITTING is ignored
    expect(quizReducer(state, { type: "SELECT_OPTION", optionId: 2 }).selectedOptionId).toBe(1);

    // Resolve challenge 101 and advance to 102
    state = quizReducer(state, { type: "SUBMIT_SUCCESS", challengeId: 101, totalChallenges: 2 });
    expect(state.phase).toBe("FEEDBACK_CORRECT");
    state = quizReducer(state, { type: "ADVANCE", nextChallengeId: 102 });
    expect(state.phase).toBe("IDLE");
    expect(state.activeChallengeId).toBe(102);

    // A stale duplicate response for challenge 101 MUST be completely ignored
    const afterStale = quizReducer(state, {
      type: "SUBMIT_SUCCESS",
      challengeId: 101,
      totalChallenges: 2,
    });
    expect(afterStale).toEqual(state);
    expect(afterStale.phase).toBe("IDLE");
  });

  it("handles BUILD_SENTENCE token add/remove/clear and grading cleanly", () => {
    let state = createInitialQuizState(sampleChallenges, 5, 0);
    state = { ...state, activeIndex: 1, activeChallengeId: 102 };

    state = quizReducer(state, { type: "ADD_TOKEN", index: 1, word: "Brod" });
    state = quizReducer(state, { type: "ADD_TOKEN", index: 3, word: "ulazi" });
    state = quizReducer(state, { type: "ADD_TOKEN", index: 4, word: "u" });
    state = quizReducer(state, { type: "ADD_TOKEN", index: 0, word: "luku" });

    expect(canSubmitAnswer(sampleChallenges[1], state)).toBe(true);
    expect(gradeChallengeAnswer(sampleChallenges[1], state)).toBe(true);

    state = quizReducer(state, { type: "REMOVE_TOKEN", index: 0 });
    expect(gradeChallengeAnswer(sampleChallenges[1], state)).toBe(false);

    state = quizReducer(state, { type: "CLEAR_TOKENS" });
    expect(canSubmitAnswer(sampleChallenges[1], state)).toBe(false);
  });
});

describe("lib/v2/lesson-helpers.ts - Dynamic 4/5-Lesson & Level Helpers", () => {
  it("identifies Super Izazov dynamically for both 4-lesson and 5-lesson units", () => {
    expect(isSuperIzazovLesson({ order: 4, title: "Lesson 4" }, 4)).toBe(true);
    expect(isSuperIzazovLesson({ order: 4, title: "Spiral Review" }, 5)).toBe(false);
    expect(isSuperIzazovLesson({ order: 5, title: "Super Izazov" }, 5)).toBe(true);
    expect(isSuperIzazovLesson({ order: 5, title: "Capstone", kind: "BOSS_CAPSTONE" }, 5)).toBe(true);
  });

  it("maps units to Levels (20 units per Level) cleanly across 100 units", () => {
    expect(getLevelForUnitOrder(1)).toBe(1);
    expect(getLevelForUnitOrder(20)).toBe(1);
    expect(getLevelForUnitOrder(21)).toBe(2);
    expect(getLevelForUnitOrder(41)).toBe(3);
    expect(getLevelForUnitOrder(61)).toBe(4);
    expect(getUnitRangeForLevel(1)).toEqual([1, 20]);
    expect(getUnitRangeForLevel(3)).toEqual([41, 60]);
    expect(getUnitRangeForLevel(4)).toEqual([61, 80]);
  });
});
