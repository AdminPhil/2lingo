"use client";

import { useEffect, useReducer, useRef } from "react";
import Image from "next/image";
import Confetti from "react-confetti";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAudio, useMount, useWindowSize } from "@/lib/hooks/browser-hooks";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import { Header } from "@/app/lesson/header";
import { Footer } from "@/app/lesson/footer";
import { Challenge } from "@/app/lesson/challenge";
import { ResultCard } from "@/app/lesson/result-card";
import { QuestionBubble } from "@/app/lesson/question-bubble";

import {
  V2QuizChallenge,
  canSubmitAnswer,
  createInitialQuizState,
  gradeChallengeAnswer,
  quizReducer,
} from "./quiz-machine";
import { ListenPrompt } from "./listen-prompt";
import { BuildSentenceBoard } from "./build-sentence-board";

type SubmitCorrectResult = {
  error?: string;
  isLessonCompleted?: boolean;
  newHearts?: number;
  heartsAwarded?: boolean;
  heartRewardAmount?: number;
  isSuperIzazovCompleted?: boolean;
};

type SubmitWrongResult = {
  error?: string;
  hearts?: number;
  depleted?: boolean;
};

type Props = {
  lessonId: number;
  challenges: V2QuizChallenge[];
  initialHearts: number;
  initialPercentage: number;
  isSuperIzazov?: boolean;
  lessonOrder?: number;
  onSubmitCorrect: (challengeId: number) => Promise<SubmitCorrectResult | void>;
  onSubmitWrong: (
    challengeId: number,
    selectedOptionId?: number
  ) => Promise<SubmitWrongResult | void>;
};

export const V2Quiz = ({
  lessonId,
  challenges,
  initialHearts,
  initialPercentage,
  isSuperIzazov = false,
  lessonOrder = 1,
  onSubmitCorrect,
  onSubmitWrong,
}: Props) => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const { open: openHeartsModal, setOnRefillCallback } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [correctAudio, , correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, , incorrectControls] = useAudio({ src: "/incorrect.wav" });

  const [state, dispatch] = useReducer(quizReducer, undefined, () =>
    createInitialQuizState(challenges, initialHearts, initialPercentage)
  );

  // Synchronous ref guard prevents same-tick double-submits before reducer re-renders
  const submitLockRef = useRef(false);

  useEffect(() => {
    setOnRefillCallback(() => dispatch({ type: "REFILL_HEARTS", hearts: 5 }));
    return () => setOnRefillCallback(undefined);
  }, [setOnRefillCallback]);

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const challenge = challenges[state.activeIndex];
  const footerStatus: "correct" | "wrong" | "none" =
    state.phase === "FEEDBACK_CORRECT"
      ? "correct"
      : state.phase === "FEEDBACK_WRONG"
        ? "wrong"
        : "none";
  const isSubmitting = state.phase === "SUBMITTING";

  const handleAction = () => {
    if (submitLockRef.current || isSubmitting) return;

    if (state.phase === "FEEDBACK_WRONG") {
      dispatch({ type: "RETRY" });
      return;
    }

    if (state.phase === "FEEDBACK_CORRECT") {
      const nextChallenge = challenges[state.activeIndex + 1];
      if (!nextChallenge && state.pendingReward) {
        if (state.pendingReward.isSuperIzazovCompleted) {
          toast.success("👑 Super Izazov riješen! Zaradio si +3 srca! ❤️❤️❤️");
        } else {
          toast.success("🎉 Lekcija završena! Zaradio si +1 srce! ❤️");
        }
      }
      dispatch({ type: "ADVANCE", nextChallengeId: nextChallenge?.id ?? null });
      return;
    }

    if (!challenge || !canSubmitAnswer(challenge, state)) return;

    const submittedChallengeId = challenge.id;
    const isCorrect = gradeChallengeAnswer(challenge, state);

    submitLockRef.current = true;
    dispatch({ type: "START_SUBMIT" });

    if (isCorrect) {
      onSubmitCorrect(submittedChallengeId)
        .then((response) => {
          if (response?.error === "hearts") {
            dispatch({ type: "SUBMIT_ABORTED", challengeId: submittedChallengeId });
            openHeartsModal();
            return;
          }

          correctControls.play();
          dispatch({
            type: "SUBMIT_SUCCESS",
            challengeId: submittedChallengeId,
            totalChallenges: challenges.length,
            reward:
              response?.isLessonCompleted && typeof response.newHearts === "number"
                ? {
                    newHearts: response.newHearts,
                    heartsAwarded: Boolean(response.heartsAwarded),
                    heartRewardAmount: response.heartRewardAmount ?? (isSuperIzazov ? 3 : 1),
                    isSuperIzazovCompleted: Boolean(response.isSuperIzazovCompleted),
                  }
                : null,
          });
        })
        .catch(() => {
          dispatch({ type: "SUBMIT_ABORTED", challengeId: submittedChallengeId });
          toast.error("Something went wrong. Please try again.");
        })
        .finally(() => {
          submitLockRef.current = false;
        });
    } else {
      onSubmitWrong(submittedChallengeId, state.selectedOptionId ?? undefined)
        .then((response) => {
          if (response?.error === "hearts") {
            dispatch({ type: "SUBMIT_ABORTED", challengeId: submittedChallengeId });
            openHeartsModal();
            return;
          }

          incorrectControls.play();
          const nextHearts =
            typeof response?.hearts === "number"
              ? response.hearts
              : Math.max(state.hearts - 1, 0);

          dispatch({
            type: "SUBMIT_WRONG",
            challengeId: submittedChallengeId,
            nextHearts,
          });

          if (response?.depleted || nextHearts === 0) {
            openHeartsModal();
          }
        })
        .catch(() => {
          dispatch({ type: "SUBMIT_ABORTED", challengeId: submittedChallengeId });
          toast.error("Something went wrong. Please try again.");
        })
        .finally(() => {
          submitLockRef.current = false;
        });
    }
  };

  if (state.phase === "COMPLETED" || !challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-6 max-w-lg mx-auto text-center items-center justify-center h-full px-4">
          <Image src="/finish.svg" alt="Finish" className="hidden lg:block" height={100} width={100} />
          <Image src="/finish.svg" alt="Finish" className="block lg:hidden" height={50} width={50} />
          <h1 className="text-xl lg:text-3xl font-black text-neutral-800">
            {isSuperIzazov ? (
              <>Svaka čast! 🌟<br /> Osvojio si zlatnu krunu i +3 srca! 🏆❤️❤️❤️</>
            ) : (
              <>Svaka čast! 🌟<br /> Završio si lekciju i osvojio +1 srce! ❤️</>
            )}
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={state.hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "LISTEN"
      ? "Listen and select the Croatian phrase"
      : challenge.type === "BUILD_SENTENCE"
        ? "Build the Croatian sentence"
        : challenge.type === "ASSIST"
          ? "Select the correct meaning"
          : challenge.prompt;

  const correctOpt = challenge.options.find((o) => o.correct);

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={state.hearts}
        percentage={state.percentage}
        hasActiveSubscription={false}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-8">
            <div className="space-y-3">
              <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                {title}
              </h1>
              {lessonOrder === 1 && challenge.type === "SELECT" && (
                <div className="flex items-center gap-x-2.5 px-3.5 py-2.5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-900 text-xs sm:text-sm font-semibold shadow-2xs">
                  <span className="text-base sm:text-lg leading-none shrink-0" aria-hidden="true">
                    🔊
                  </span>
                  <span>
                    <strong className="font-black text-sky-950">Poslušaj i poveži (Listen &amp; Connect):</strong>{" "}
                    Tap each card to hear how the Croatian word sounds!
                  </span>
                </div>
              )}
            </div>

            <div>
              {challenge.type === "LISTEN" && (
                <ListenPrompt
                  audioSrc={challenge.audioSrc || correctOpt?.audioSrc}
                  fallbackText={correctOpt?.text}
                  disabled={isSubmitting}
                />
              )}

              {(challenge.type === "ASSIST" || challenge.type === "BUILD_SENTENCE") && (
                <QuestionBubble question={challenge.prompt} />
              )}

              {challenge.type === "BUILD_SENTENCE" ? (
                <BuildSentenceBoard
                  wordBank={challenge.wordBank || []}
                  selectedTokens={state.selectedTokens}
                  status={footerStatus}
                  disabled={isSubmitting}
                  onAddToken={(index, word) =>
                    dispatch({ type: "ADD_TOKEN", index, word })
                  }
                  onRemoveToken={(index) =>
                    dispatch({ type: "REMOVE_TOKEN", index })
                  }
                  onClear={() => dispatch({ type: "CLEAR_TOKENS" })}
                />
              ) : (
                <Challenge
                  options={challenge.options.map((o) => ({
                    id: o.id,
                    challengeId: challenge.id,
                    text: o.text,
                    correct: o.correct,
                    imageSrc: o.imageSrc ?? null,
                    audioSrc: o.audioSrc ?? null,
                  }))}
                  onSelect={(id) => dispatch({ type: "SELECT_OPTION", optionId: id })}
                  status={footerStatus}
                  selectedOption={state.selectedOptionId ?? undefined}
                  disabled={isSubmitting}
                  type={challenge.type === "SELECT" ? "SELECT" : "ASSIST"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={
          isSubmitting || (state.phase === "IDLE" && !canSubmitAnswer(challenge, state))
        }
        status={footerStatus}
        onCheck={handleAction}
      />
    </>
  );
};
