"use client";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { V2Quiz } from "./v2-quiz";
import type { V2QuizChallenge, V2QuizChoiceOption } from "./quiz-machine";

type IncomingChallenge = {
  id: number;
  order: number;
  type: string;
  question: string;
  completed: boolean;
  payload?: Record<string, unknown> | null;
  challengeOptions: {
    id: number;
    challengeId: number;
    text: string;
    correct: boolean;
    imageSrc: string | null;
    audioSrc: string | null;
  }[];
};

type Props = {
  initialLessonId: number;
  initialLessonChallenges: IncomingChallenge[];
  initialHearts: number;
  initialPercentage: number;
  isSuperIzazov?: boolean;
  lessonOrder?: number;
};

export function normalizeIncomingChallenges(
  rows: IncomingChallenge[]
): V2QuizChallenge[] {
  return rows.map((row) => {
    const payload = (row.payload ?? {}) as {
      audioSrc?: string;
      targetSentence?: string;
      acceptedAnswers?: string[];
      wordBank?: string[];
    };

    const options: V2QuizChoiceOption[] = (row.challengeOptions || []).map((opt) => ({
      id: opt.id,
      text: opt.text,
      correct: opt.correct,
      imageSrc: opt.imageSrc,
      audioSrc: opt.audioSrc,
    }));

    const supportedType =
      row.type === "LISTEN" || row.type === "BUILD_SENTENCE" || row.type === "ASSIST"
        ? row.type
        : "SELECT";

    return {
      id: row.id,
      order: row.order,
      type: supportedType,
      prompt: row.question,
      completed: row.completed,
      options,
      audioSrc:
        payload.audioSrc ??
        options.find((o) => o.correct && o.audioSrc)?.audioSrc ??
        null,
      targetSentence: payload.targetSentence,
      acceptedAnswers: Array.isArray(payload.acceptedAnswers)
        ? payload.acceptedAnswers
        : undefined,
      wordBank: Array.isArray(payload.wordBank) ? payload.wordBank : undefined,
    };
  });
}

export const LessonQuizClient = ({
  initialLessonId,
  initialLessonChallenges,
  initialHearts,
  initialPercentage,
  isSuperIzazov = false,
  lessonOrder = 1,
}: Props) => {
  const normalized = normalizeIncomingChallenges(initialLessonChallenges);

  return (
    <V2Quiz
      lessonId={initialLessonId}
      challenges={normalized}
      initialHearts={initialHearts}
      initialPercentage={initialPercentage}
      isSuperIzazov={isSuperIzazov}
      lessonOrder={lessonOrder}
      onSubmitCorrect={(challengeId) => upsertChallengeProgress(challengeId)}
      onSubmitWrong={(challengeId, selectedOptionId) =>
        reduceHearts(challengeId, selectedOptionId)
      }
    />
  );
};
