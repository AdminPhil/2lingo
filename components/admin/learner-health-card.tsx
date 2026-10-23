"use client";

import { useState, useTransition } from "react";
import { Heart, Flame, Sparkles, Wand2, ShieldCheck, Plus, Check } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  adminRefillHearts, 
  adminProtectStreak, 
  adminAwardPraiseXp 
} from "@/actions/admin-overrides";

type LearnerData = {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
  hearts: number;
  heartsUsed: number;
  streak: number;
  lastActiveDate: string | null;
};

type Props = {
  learners: LearnerData[];
};

export const LearnerHealthCard = ({ learners: initialLearners }: Props) => {
  const [learners, setLearners] = useState(initialLearners);
  const [praiseTarget, setPraiseTarget] = useState<LearnerData | null>(null);
  const [praiseAmount, setPraiseAmount] = useState(50);
  const [praiseReason, setPraiseReason] = useState("Spoke Croatian at dinner! 🇭🇷");
  const [pending, startTransition] = useTransition();

  const handleRefill = (learner: LearnerData) => {
    startTransition(async () => {
      try {
        const res = await adminRefillHearts(learner.userId);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success(`❤️ Refilled ${learner.userName}'s hearts to 5/5!`);
          setLearners((prev) =>
            prev.map((l) =>
              l.userId === learner.userId ? { ...l, hearts: 5 } : l
            )
          );
        }
      } catch {
        toast.error("Failed to refill hearts.");
      }
    });
  };

  const handleProtectStreak = (learner: LearnerData) => {
    startTransition(async () => {
      try {
        const res = await adminProtectStreak(learner.userId);
        if (res?.error || res?.streak === undefined) {
          toast.error(res?.error || "Failed to protect streak.");
        } else {
          const streak = res.streak;
          toast.success(`🔥 Granted streak grace to ${learner.userName}! Streak: ${streak} days`);
          setLearners((prev) =>
            prev.map((l) =>
              l.userId === learner.userId ? { ...l, streak } : l
            )
          );
        }
      } catch {
        toast.error("Failed to protect streak.");
      }
    });
  };

  const handleAwardPraise = () => {
    if (!praiseTarget) return;

    startTransition(async () => {
      try {
        const res = await adminAwardPraiseXp(
          praiseTarget.userId,
          praiseAmount,
          praiseReason
        );
        if (res?.error || res?.newPoints === undefined) {
          toast.error(res?.error || "Failed to award praise XP.");
        } else {
          const newPoints = res.newPoints;
          toast.success(`🌟 Awarded +${praiseAmount} XP to ${praiseTarget.userName} for "${praiseReason}"!`);
          setLearners((prev) =>
            prev.map((l) =>
              l.userId === praiseTarget.userId
                ? { ...l, points: newPoints }
                : l
            )
          );
          setPraiseTarget(null);
        }
      } catch {
        toast.error("Failed to award praise XP.");
      }
    });
  };

  const praisePresets = [
    { amount: 50, label: "Spoke Croatian at dinner! 🇭🇷" },
    { amount: 25, label: "Helped sister practice! 🤝" },
    { amount: 30, label: "Great perseverance & focus! ⭐" },
    { amount: 100, label: "Mastered a full unit milestone! 🏆" },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs mb-8">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-x-2">
              <h3 className="font-extrabold text-lg text-neutral-800">
                Learner Health & Parent Magic Wand
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full flex items-center gap-x-1">
                <Wand2 className="h-3 w-3" /> Overrides
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Refill hearts on-demand, grant streak grace days, and reward real-life conversational wins.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {learners.map((learner, idx) => (
            <div
              key={learner.userId}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition"
            >
              {/* Learner Info */}
              <div className="flex items-center gap-x-3.5">
                <span className="text-sm font-black text-slate-400 w-5">
                  #{idx + 1}
                </span>
                <Avatar className="h-12 w-12 border-2 border-green-500 shrink-0">
                  <AvatarImage src={learner.userImageSrc} />
                </Avatar>
                <div>
                  <div className="flex items-center gap-x-2">
                    <h4 className="font-black text-neutral-800 text-base">
                      {learner.userName}
                    </h4>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {learner.points} XP
                    </span>
                  </div>

                  {/* Health Pills */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                    <span className="flex items-center gap-x-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <Flame className="h-3.5 w-3.5" />
                      <span>{learner.streak} Day Flame</span>
                    </span>
                    <span className="flex items-center gap-x-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{learner.hearts}/5 Hearts</span>
                    </span>
                    <span className="text-slate-500 font-medium">
                      💔 {learner.heartsUsed} lifetime mistakes
                    </span>
                  </div>
                </div>
              </div>

              {/* Parent Magic Wand Actions */}
              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending || learner.hearts >= 5}
                  onClick={() => handleRefill(learner)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 bg-white h-8"
                  title="Refill to 5/5 hearts immediately"
                >
                  <Heart className="h-3.5 w-3.5 mr-1 text-rose-500" />
                  {learner.hearts >= 5 ? "Hearts Full" : "Refill ❤️"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => handleProtectStreak(learner)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200/80 bg-white h-8"
                  title="Grant a grace day to preserve flame streak"
                >
                  <Flame className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  Grace Day 🔥
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={pending}
                  onClick={() => {
                    setPraiseTarget(learner);
                    setPraiseAmount(50);
                    setPraiseReason("Spoke Croatian at dinner! 🇭🇷");
                  }}
                  className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white h-8 cursor-pointer"
                  title="Award praise XP for offline achievements"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Praise XP 🌟
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Praise XP Dialog Modal */}
      <Dialog open={!!praiseTarget} onOpenChange={(open) => !open && setPraiseTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-xl text-neutral-800">
              Award Praise XP to {praiseTarget?.userName} 🌟
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-neutral-600">
              Celebrate real-life Croatian effort, table conversations, and sibling teamwork!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Select Achievement Preset
              </label>
              <div className="space-y-1.5">
                {praisePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setPraiseAmount(preset.amount);
                      setPraiseReason(preset.label);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border-2 text-xs font-bold flex items-center justify-between transition ${
                      praiseReason === preset.label
                        ? "border-amber-500 bg-amber-50/70 text-amber-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>{preset.label}</span>
                    <span className="font-extrabold text-amber-600 font-mono">
                      +{preset.amount} XP
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Custom Reason Note
              </label>
              <input
                type="text"
                value={praiseReason}
                onChange={(e) => setPraiseReason(e.target.value)}
                placeholder="e.g. Practiced with Baka on FaceTime!"
                className="w-full text-sm font-semibold py-2 px-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 outline-hidden transition"
                disabled={pending}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-y-2 mt-2">
            <Button
              variant="primary"
              onClick={handleAwardPraise}
              disabled={pending}
              className="w-full text-base font-bold bg-amber-500 hover:bg-amber-600 text-white"
            >
              {pending ? "Awarding..." : `Award +${praiseAmount} XP to ${praiseTarget?.userName}`}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPraiseTarget(null)}
              disabled={pending}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
