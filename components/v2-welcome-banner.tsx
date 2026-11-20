"use client";

import { useEffect, useState, useTransition } from "react";
import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { computeV2PlacementFromXp } from "@/lib/v2/placement";
import { dismissV2PlacementBanner } from "@/actions/v2/placement-banner";

const STORAGE_KEY = "crolingo_v2_welcome_banner_seen";

type Props = {
  points: number;
  streak: number;
  initialDismissed?: boolean;
};

export const V2WelcomeBanner = ({
  points,
  streak,
  initialDismissed = false,
}: Props) => {
  const [visible, setVisible] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (initialDismissed || points <= 0) return;
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, [initialDismissed, points]);

  if (!visible) return null;

  const placement = computeV2PlacementFromXp(points);

  const handleDismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore storage errors
    }
    startTransition(async () => {
      await dismissV2PlacementBanner();
    });
  };

  return (
    <div
      role="status"
      className="mb-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 via-sky-50 to-amber-50/70 p-4 shadow-xs relative"
    >
      <button
        type="button"
        onClick={handleDismiss}
        disabled={pending}
        aria-label="Dismiss CroLingo v2 welcome banner"
        className="absolute top-3 right-3 rounded-lg p-1 text-slate-400 hover:bg-white/80 hover:text-slate-700 transition cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pr-6">
        <div className="h-10 w-10 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h2 className="text-sm sm:text-base font-black text-blue-950">
            Welcome to CroLingo v2!
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
            Your <strong>{points.toLocaleString()} XP</strong>,{" "}
            <strong>
              {streak} {streak === 1 ? "day" : "days"} streak
            </strong>
            , and family team are 100% saved. We placed you at{" "}
            <strong className="text-blue-900">{placement.label}</strong> so you can
            experience the new Listening and Sentence Builder lessons!
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleDismiss}
          disabled={pending}
          className="bg-blue-900 hover:bg-blue-950 text-white font-bold shrink-0 self-start sm:self-center cursor-pointer"
        >
          Let&apos;s Go!
        </Button>
      </div>
    </div>
  );
};
