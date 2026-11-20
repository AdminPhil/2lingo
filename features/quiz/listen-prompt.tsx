"use client";

import { useRef, useState } from "react";
import { Volume2, Snail } from "lucide-react";
import { cn } from "@/lib/utils";
import { speakText } from "@/lib/tts";

type Props = {
  audioSrc?: string | null;
  fallbackText?: string;
  disabled?: boolean;
};

/**
 * Tier 3 Challenge UI: Audio-Only Listening Prompt (`LISTEN`)
 * Trains learners' Croatian listening comprehension without English visual crutches.
 */
export const ListenPrompt = ({ audioSrc, fallbackText = "", disabled }: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeMode, setActiveMode] = useState<"normal" | "slow" | null>(null);

  const playAtRate = (rate: number, mode: "normal" | "slow") => {
    if (disabled) return;
    setActiveMode(mode);

    if (audioSrc && audioRef.current) {
      try {
        audioRef.current.playbackRate = rate;
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            setActiveMode(null);
          });
        }
        return;
      } catch {
        setActiveMode(null);
      }
    }

    if (fallbackText) {
      speakText(fallbackText);
      setTimeout(() => setActiveMode(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-3 mb-6">
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
          onEnded={() => setActiveMode(null)}
        />
      )}
      <div className="flex items-center justify-center gap-x-4">
        <button
          type="button"
          onClick={() => playAtRate(1, "normal")}
          disabled={disabled}
          aria-label="Play Croatian audio"
          className={cn(
            "h-20 w-20 rounded-3xl bg-sky-500 hover:bg-sky-600 text-white border-b-4 border-sky-700 active:border-b-0 active:translate-y-0.5 flex items-center justify-center shadow-md transition-all cursor-pointer",
            activeMode === "normal" && "ring-4 ring-sky-200 scale-105",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <Volume2 className="h-9 w-9" />
        </button>

        <button
          type="button"
          onClick={() => playAtRate(0.72, "slow")}
          disabled={disabled}
          aria-label="Play slowly"
          title="Play slowly (0.72x)"
          className={cn(
            "h-14 w-14 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border-2 border-b-4 border-sky-300 active:border-b-2 active:translate-y-0.5 flex items-center justify-center transition-all cursor-pointer",
            activeMode === "slow" && "ring-4 ring-sky-200 scale-105",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <Snail className="h-6 w-6" />
        </button>
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Tap speaker to listen • Snail for slow speed
      </p>
    </div>
  );
};
