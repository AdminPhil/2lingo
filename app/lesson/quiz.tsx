"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useAudio, useWindowSize, useMount } from "react-use";

import { reduceHearts } from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { usePracticeModal } from "@/store/use-practice-modal";
import { upsertChallengeProgress } from "@/actions/challenge-progress";

import { Header } from "./header";
import { Footer } from "./footer";
import { Challenge } from "./challenge";
import { ResultCard } from "./result-card";
import { QuestionBubble } from "./question-bubble";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: typeof challengeOptions.$inferSelect[];
  })[];
  userSubscription: typeof userSubscription.$inferSelect & {
    isActive: boolean;
  } | null;
  isSuperIzazov?: boolean;
  lessonOrder?: number;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
  isSuperIzazov = false,
  lessonOrder = 1,
}: Props) => {
  const { open: openHeartsModal, setOnRefillCallback } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useEffect(() => {
    setOnRefillCallback(() => {
      setHearts(5);
    });
    return () => setOnRefillCallback(undefined);
  }, [setOnRefillCallback]);

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();

  const router = useRouter();

  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [
    correctAudio,
    _c,
    correctControls,
  ] = useAudio({ src: "/correct.wav" });
  const [
    incorrectAudio,
    _i,
    incorrectControls,
  ] = useAudio({ src: "/incorrect.wav" });
  const [pending, startTransition] = useTransition();

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
  const [pendingCompletionReward, setPendingCompletionReward] = useState<{
    newHearts: number;
    heartsAwarded: boolean;
    heartRewardAmount: number;
    isSuperIzazovCompleted: boolean;
  } | null>(null);

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      // BUG-026 & CR-068: Apply heart reward and toast only when transitioning to the completion screen
      const isFinishingLesson = activeIndex + 1 >= challenges.length;
      if (isFinishingLesson && pendingCompletionReward) {
        setHearts(pendingCompletionReward.newHearts);
        if (pendingCompletionReward.isSuperIzazovCompleted) {
          toast.success("👑 Super Izazov riješen! Zaradio si +3 srca! ❤️❤️❤️");
        } else {
          toast.success("🎉 Lekcija završena! Zaradio si +1 srce! ❤️");
        }
        setPendingCompletionReward(null);
      }

      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // BUG-026 & CR-068: Queue lesson completion heart reward for the completion screen transition
            if (response?.isLessonCompleted && typeof response.newHearts === "number") {
              setPendingCompletionReward({
                newHearts: response.newHearts,
                heartsAwarded: Boolean(response.heartsAwarded),
                heartRewardAmount: response.heartRewardAmount ?? (isSuperIzazov ? 3 : 1),
                isSuperIzazovCompleted: Boolean(response.isSuperIzazovCompleted),
              });
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."))
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id, selectedOption)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) {
              const nextHearts =
                typeof response?.hearts === "number"
                  ? response.hearts
                  : Math.max(hearts - 1, 0);
              setHearts(nextHearts);

              // BUG-025: Immediately prompt for practice when the last heart is lost (1 -> 0)
              if (response?.depleted || nextHearts === 0) {
                openHeartsModal();
              }
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."))
      });
    }
  };

  if (!challenge) {
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
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-black text-neutral-800">
            {isSuperIzazov ? (
              <>Svaka čast! 🌟<br /> Osvojio si zlatnu krunu i +3 srca! 🏆❤️❤️❤️</>
            ) : (
              <>Svaka čast! 🌟<br /> Završio si lekciju i osvojio +1 srce! ❤️</>
            )}
          </h1>

          <div className="inline-flex items-center gap-x-2 px-4 py-2 bg-rose-50 border-2 border-rose-300 rounded-2xl shadow-xs text-rose-700 font-black text-sm sm:text-base animate-pulse">
            <span>{isSuperIzazov ? "❤️❤️❤️" : "❤️"}</span>
            <span>
              {isSuperIzazov
                ? "Super Izazov Nagrada: +3 Srca zarađena!"
                : "Nagrada za lekciju: +1 Srce zarađeno!"}
            </span>
          </div>

          <div className="flex items-center gap-x-4 w-full">
            <ResultCard
              variant="points"
              value={challenges.length * 10}
            />
            <ResultCard
              variant="hearts"
              value={hearts}
            />
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

  const title = challenge.type === "ASSIST" 
    ? "Select the correct meaning"
    : challenge.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-8">
            <div className="space-y-3">
              <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                {title}
              </h1>
              {lessonOrder === 1 && (
                <div className="flex items-center gap-x-2.5 px-3.5 py-2.5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-900 text-xs sm:text-sm font-semibold shadow-2xs">
                  <span className="text-base sm:text-lg leading-none shrink-0" aria-hidden="true">
                    🔊
                  </span>
                  <span>
                    <strong className="font-black text-sky-950">Poslušaj i poveži (Listen &amp; Connect):</strong> Tap each card to hear how the Croatian word sounds — you&apos;ll use these words in the next lessons!
                  </span>
                </div>
              )}
            </div>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
