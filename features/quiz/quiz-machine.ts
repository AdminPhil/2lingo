/**
 * CroLingo v2 Pure State-Machine Quiz Engine (`useReducer`)
 * Supports SELECT, ASSIST, LISTEN, and BUILD_SENTENCE natively.
 * Prevents double-submission and stale-response deadlocks (BUG-049) by construction.
 */

export type V2QuizChoiceOption = {
  id: number;
  text: string;
  correct: boolean;
  imageSrc?: string | null;
  audioSrc?: string | null;
};

export type V2QuizChallenge = {
  id: number;
  order: number;
  type: "SELECT" | "ASSIST" | "LISTEN" | "BUILD_SENTENCE";
  prompt: string;
  completed: boolean;
  audioSrc?: string | null;
  targetSentence?: string;
  acceptedAnswers?: string[];
  wordBank?: string[];
  options: V2QuizChoiceOption[];
};

export type QuizPhase =
  | "IDLE"
  | "SUBMITTING"
  | "FEEDBACK_CORRECT"
  | "FEEDBACK_WRONG"
  | "COMPLETED";

export type PendingReward = {
  newHearts: number;
  heartsAwarded: boolean;
  heartRewardAmount: number;
  isSuperIzazovCompleted: boolean;
};

export type QuizState = {
  phase: QuizPhase;
  activeIndex: number;
  activeChallengeId: number | null;
  selectedOptionId: number | null;
  selectedTokens: { index: number; word: string }[];
  hearts: number;
  percentage: number;
  pendingReward: PendingReward | null;
};

export type QuizAction =
  | { type: "SELECT_OPTION"; optionId: number }
  | { type: "ADD_TOKEN"; index: number; word: string }
  | { type: "REMOVE_TOKEN"; index: number }
  | { type: "CLEAR_TOKENS" }
  | { type: "START_SUBMIT" }
  | {
      type: "SUBMIT_SUCCESS";
      challengeId: number;
      totalChallenges: number;
      reward?: PendingReward | null;
    }
  | {
      type: "SUBMIT_WRONG";
      challengeId: number;
      nextHearts: number;
    }
  | { type: "SUBMIT_ABORTED"; challengeId: number }
  | { type: "RETRY" }
  | { type: "ADVANCE"; nextChallengeId: number | null }
  | { type: "REFILL_HEARTS"; hearts: number };

export function normalizeCroatianSentence(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:"'„“”«»()—–-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function gradeBuildSentence(
  submittedWords: string[],
  targetSentence: string,
  acceptedAnswers: string[] = []
): boolean {
  const submitted = normalizeCroatianSentence(submittedWords.join(" "));
  if (!submitted) return false;

  const candidates = [targetSentence, ...acceptedAnswers]
    .filter(Boolean)
    .map(normalizeCroatianSentence);

  return candidates.includes(submitted);
}

export function gradeChallengeAnswer(
  challenge: V2QuizChallenge,
  state: Pick<QuizState, "selectedOptionId" | "selectedTokens">
): boolean {
  if (challenge.type === "BUILD_SENTENCE") {
    return gradeBuildSentence(
      state.selectedTokens.map((t) => t.word),
      challenge.targetSentence || "",
      challenge.acceptedAnswers || []
    );
  }
  const correctOpt = challenge.options.find((o) => o.correct);
  return Boolean(correctOpt && state.selectedOptionId === correctOpt.id);
}

export function canSubmitAnswer(
  challenge: V2QuizChallenge | undefined,
  state: QuizState
): boolean {
  if (!challenge || state.phase !== "IDLE") return false;
  if (challenge.type === "BUILD_SENTENCE") {
    return state.selectedTokens.length > 0;
  }
  return state.selectedOptionId !== null;
}

export function createInitialQuizState(
  challenges: V2QuizChallenge[],
  initialHearts: number,
  initialPercentage: number
): QuizState {
  const uncompletedIdx = challenges.findIndex((c) => !c.completed);
  const startIndex = challenges.length === 0 ? 0 : uncompletedIdx === -1 ? 0 : uncompletedIdx;
  const activeChallenge = challenges[startIndex];

  return {
    phase: activeChallenge ? "IDLE" : "COMPLETED",
    activeIndex: startIndex,
    activeChallengeId: activeChallenge?.id ?? null,
    selectedOptionId: null,
    selectedTokens: [],
    hearts: initialHearts,
    percentage: initialPercentage === 100 ? 0 : initialPercentage,
    pendingReward: null,
  };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT_OPTION": {
      if (state.phase !== "IDLE") return state;
      return { ...state, selectedOptionId: action.optionId };
    }

    case "ADD_TOKEN": {
      if (state.phase !== "IDLE") return state;
      if (state.selectedTokens.some((t) => t.index === action.index)) {
        return state;
      }
      return {
        ...state,
        selectedTokens: [...state.selectedTokens, { index: action.index, word: action.word }],
      };
    }

    case "REMOVE_TOKEN": {
      if (state.phase !== "IDLE") return state;
      return {
        ...state,
        selectedTokens: state.selectedTokens.filter((t) => t.index !== action.index),
      };
    }

    case "CLEAR_TOKENS": {
      if (state.phase !== "IDLE") return state;
      return { ...state, selectedTokens: [] };
    }

    case "START_SUBMIT": {
      if (state.phase !== "IDLE") return state;
      return { ...state, phase: "SUBMITTING" };
    }

    case "SUBMIT_SUCCESS": {
      if (state.phase !== "SUBMITTING" || state.activeChallengeId !== action.challengeId) {
        return state;
      }
      const step = action.totalChallenges > 0 ? 100 / action.totalChallenges : 100;
      return {
        ...state,
        phase: "FEEDBACK_CORRECT",
        percentage: Math.min(100, state.percentage + step),
        pendingReward: action.reward ?? state.pendingReward,
      };
    }

    case "SUBMIT_WRONG": {
      if (state.phase !== "SUBMITTING" || state.activeChallengeId !== action.challengeId) {
        return state;
      }
      return {
        ...state,
        phase: "FEEDBACK_WRONG",
        hearts: action.nextHearts,
      };
    }

    case "SUBMIT_ABORTED": {
      if (state.phase !== "SUBMITTING" || state.activeChallengeId !== action.challengeId) {
        return state;
      }
      return { ...state, phase: "IDLE" };
    }

    case "RETRY": {
      if (state.phase !== "FEEDBACK_WRONG") return state;
      return {
        ...state,
        phase: "IDLE",
        selectedOptionId: null,
        selectedTokens: [],
      };
    }

    case "ADVANCE": {
      if (state.phase !== "FEEDBACK_CORRECT") return state;
      const isFinishing = action.nextChallengeId === null;
      return {
        ...state,
        phase: isFinishing ? "COMPLETED" : "IDLE",
        activeIndex: state.activeIndex + 1,
        activeChallengeId: action.nextChallengeId,
        selectedOptionId: null,
        selectedTokens: [],
        hearts:
          isFinishing && state.pendingReward
            ? state.pendingReward.newHearts
            : state.hearts,
        pendingReward: isFinishing ? null : state.pendingReward,
      };
    }

    case "REFILL_HEARTS": {
      return { ...state, hearts: action.hearts };
    }

    default:
      return state;
  }
}
