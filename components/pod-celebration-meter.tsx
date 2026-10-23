"use client";

import { useState } from "react";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Sparkles, Trophy, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  podName?: string;
  currentXp?: number;
  targetXp?: number;
  celebrationUnlocked?: boolean;
};

export const PodCelebrationMeter = ({
  podName = "Zgomba Family",
  currentXp = 740,
  targetXp = 1000,
  celebrationUnlocked = false,
}: Props) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);

  const percentage = Math.min(Math.round((currentXp / targetXp) * 100), 100);
  const remainingXp = Math.max(targetXp - currentXp, 0);
  const isGoalMet = currentXp >= targetXp || celebrationUnlocked;

  const triggerCelebration = () => {
    setShowConfetti(true);
    setIsCelebrationModalOpen(true);
    setTimeout(() => setShowConfetti(false), 9000);
  };

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={600}
            tweenDuration={9000}
          />
        </div>
      )}

      <div className="w-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-amber-300/80 rounded-2xl p-4 mb-6 shadow-xs relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-x-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              {isGoalMet ? (
                <Trophy className="h-5 w-5 animate-bounce" />
              ) : (
                <PartyPopper className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <span className="font-extrabold text-neutral-800 text-base sm:text-lg">
                  {podName} Weekly Goal
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-amber-500 text-white rounded-full">
                  {percentage}%
                </span>
              </div>
              <p className="text-xs text-amber-900/70 font-medium">
                Collaborative Team Celebration Meter
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm sm:text-base font-black text-amber-950 font-mono">
              {currentXp}
            </span>
            <span className="text-xs text-amber-700 font-bold"> / {targetXp} XP</span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-amber-200/60 h-4 rounded-full overflow-hidden p-0.5 border border-amber-300">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isGoalMet
                ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-green-500 animate-pulse"
                : "bg-gradient-to-r from-amber-500 to-orange-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Status & Action */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {isGoalMet ? (
            <>
              <p className="text-xs sm:text-sm font-bold text-green-700 flex items-center gap-x-1.5">
                <span>🎉</span>
                <span>Team Goal Reached! Celebration unlocked for the whole family!</span>
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={triggerCelebration}
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-sm text-xs cursor-pointer self-start sm:self-auto"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Celebrate Together! 🎊
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-amber-950/80 font-medium flex items-center gap-x-1">
                <span>🌟</span>
                <span>
                  Only <strong className="text-amber-800 font-bold">{remainingXp} XP</strong> to go! Every lesson earned helps reach the goal!
                </span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={triggerCelebration}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:bg-amber-100/60 self-start sm:self-auto"
                title="Preview Celebration"
              >
                🎉 Preview Celebration
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Celebration Dialog Modal */}
      <Dialog open={isCelebrationModalOpen} onOpenChange={setIsCelebrationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center w-full justify-center mb-4">
              <Image
                src="/mascot.svg"
                alt="Celebration Mascot"
                height={95}
                width={95}
                className="animate-bounce"
              />
            </div>
            <DialogTitle className="text-center font-extrabold text-2xl text-neutral-800">
              Čestitamo! Family Goal Achieved! 🏆
            </DialogTitle>
            <DialogDescription className="text-center text-base text-neutral-600">
              The <strong className="text-amber-600 font-bold">{podName}</strong> hit their collaborative weekly target of <span className="font-bold text-green-600">{targetXp} XP</span>!
            </DialogDescription>
          </DialogHeader>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 my-2 text-center text-xs text-amber-800 font-semibold">
            🤝 Teamwork unlocked! Every practice question answered by Adriana, Vanessa, and Silvia brought the team across the finish line!
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="primary"
              className="w-full text-base font-bold bg-amber-500 hover:bg-amber-600 text-white"
              size="lg"
              onClick={() => setIsCelebrationModalOpen(false)}
            >
              Keep Learning Together! 🇭🇷
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
