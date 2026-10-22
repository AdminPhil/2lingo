"use client";

import { toast } from "sonner";
import Image from "next/image";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useAudio, useWindowSize, useMount } from "react-use";

import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { awardPracticeSessionHeart } from "@/actions/user-progress";

import { Header } from "../header";
import { Footer } from "../footer";
import { Challenge } from "../challenge";
import { ResultCard } from "../result-card";
import { QuestionBubble } from "../question-bubble";

type ChallengeWithOpts = typeof challenges.$inferSelect & {
  completed: boolean;
  challengeOptions: typeof challengeOptions.$inferSelect[];
};

type Props = {
  initialChallenges: ChallengeWithOpts[];
  initialHearts: number;
  userSubscription: typeof userSubscription.$inferSelect & {
    isActive: boolean;
  } | null;
};

export const PracticeQuiz = ({
  initialChallenges,
  initialHearts,
  userSubscription,
}: Props) => {
  const router = useRouter();
  const { width, height } = useWindowSize();

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
  const [challengeList, setChallengeList] = useState<ChallengeWithOpts[]>(initialChallenges);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
  const [hearts, setHearts] = useState<number>(initialHearts);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const challenge = challengeList[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const percentage = Math.min(
    Math.round((activeIndex / challengeList.length) * 100),
    100
  );

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption && status === "none") return;

    if (status === "wrong") {
      // Re-queue the missed challenge to the end so the child can master it without heart loss
      const missed = challenge;
      setChallengeList((prev) => [...prev, missed]);
      setActiveIndex((prev) => prev + 1);
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      if (activeIndex + 1 >= challengeList.length) {
        // Complete practice session & award +1 Heart!
        startTransition(() => {
          awardPracticeSessionHeart()
            .then(() => {
              setHearts((prev) => Math.min(prev + 1, 5));
              setIsCompleted(true);
            })
            .catch(() => {
              toast.error("Could not save practice progress. Please try again.");
            });
        });
        return;
      }

      setActiveIndex((prev) => prev + 1);
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((opt) => opt.correct);
    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      correctControls.play();
      setStatus("correct");
    } else {
      incorrectControls.play();
      setStatus("wrong");
    }
  };

  if (isCompleted) {
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
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full px-4">
          <Image
            src="/finish.svg"
            alt="Finish Mascot"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="Finish Mascot"
            className="block lg:hidden"
            height={70}
            width={70}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-800">
            Heart Recharged! ❤️
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Awesome practice! You reviewed Croatian words and earned +1 Heart to continue your journey!
          </p>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard
              variant="points"
              value={10}
            />
            <ResultCard
              variant="hearts"
              value={hearts}
            />
          </div>
        </div>
        <footer className="lg:-h[140px] h-[100px] border-t-2 border-transparent bg-green-100">
          <div className="max-w-[1140px] h-full mx-auto flex items-center justify-end px-6 lg:px-10">
            <button
              onClick={() => router.push("/learn")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition"
            >
              Continue Adventure
            </button>
          </div>
        </footer>
      </>
    );
  }

  const title = challenge?.type === "ASSIST"
    ? "Select the correct meaning"
    : challenge?.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1 flex flex-col">
        {/* Practice Banner */}
        <div className="bg-amber-100 text-amber-800 text-center py-2 text-sm font-semibold border-b border-amber-200">
          ⚡ Practice Mode • Answer 3 review questions to earn +1 ❤️ (Mistakes don&apos;t cost hearts)
        </div>
        <div className="h-full flex items-center justify-center flex-1">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-8 my-6">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge?.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge?.type || "SELECT"}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || (!selectedOption && status === "none")}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
