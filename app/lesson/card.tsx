import Image from "next/image";
import { useCallback, useState } from "react";
import { useAudio, useKey } from "react-use";
import { Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { challenges } from "@/db/schema";
import { speakText } from "@/lib/tts";

type Props = {
  id: number;
  imageSrc: string | null;
  audioSrc: string | null;
  text: string;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  status?: "correct" | "wrong" | "none";
  type: typeof challenges.$inferSelect["type"];
};

export const Card = ({
  id,
  imageSrc,
  audioSrc,
  text,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
}: Props) => {
  const [hasImageError, setHasImageError] = useState(false);
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });

  const playSound = useCallback(() => {
    if (audioSrc) {
      controls.play();
    } else {
      speakText(text);
    }
  }, [audioSrc, controls, text]);

  const handleClick = useCallback(() => {
    if (disabled) return;

    playSound();
    onClick();
  }, [disabled, playSound, onClick]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative h-full border-2 rounded-2xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 overflow-hidden transition-all",
        // Padding: compact on mobile, generous on desktop
        type === "SELECT" ? "p-3 sm:p-4 lg:p-5 flex flex-col justify-between" : "p-3.5 lg:p-4 w-full",
        selected && "border-sky-400 bg-sky-50/70 hover:bg-sky-50/70",
        selected && status === "correct" && "border-green-400 bg-green-50/80 hover:bg-green-50/80",
        selected && status === "wrong" && "border-rose-400 bg-rose-50/80 hover:bg-rose-50/80",
        disabled && "pointer-events-none hover:bg-white opacity-60"
      )}
    >
      {audio}

      {/* Case 1: SELECT (Image Card) Layout */}
      {type === "SELECT" && (
        <>
          {/* Top-Right Keyboard Shortcut Hotkey Badge */}
          <div
            className={cn(
              "absolute top-2 right-2 lg:top-2.5 lg:right-2.5 h-5 w-5 lg:h-6 lg:w-6 border-2 flex items-center justify-center rounded-md text-neutral-400 lg:text-xs text-[10px] font-bold bg-white/90 shadow-2xs z-10 select-none",
              selected && "border-sky-300 text-sky-600 bg-sky-50",
              selected && status === "correct" && "border-green-500 text-green-600 bg-green-50",
              selected && status === "wrong" && "border-rose-500 text-rose-600 bg-rose-50"
            )}
            title={`Keyboard shortcut: ${shortcut}`}
          >
            {shortcut}
          </div>

          {/* Centered Image */}
          {imageSrc && !hasImageError ? (
            <div className="relative aspect-square my-2 max-h-[75px] sm:max-h-[95px] lg:max-h-[130px] w-full flex items-center justify-center">
              <Image
                src={imageSrc}
                fill
                alt={text}
                className="object-contain"
                onError={() => setHasImageError(true)}
              />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Bottom Label & Audio Button Row */}
          <div className="flex items-center justify-between gap-x-2 pt-1 w-full min-w-0 mt-auto">
            <p
              className={cn(
                "text-neutral-700 text-sm lg:text-base font-bold truncate leading-tight",
                selected && "text-sky-600",
                selected && status === "correct" && "text-green-600",
                selected && status === "wrong" && "text-rose-600"
              )}
            >
              {text}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playSound();
              }}
              className="p-1 hover:bg-black/10 rounded-lg transition text-neutral-400 hover:text-sky-600 shrink-0 cursor-pointer"
              title="Read aloud"
              aria-label="Read aloud"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {/* Case 2: ASSIST (Text List Card) Layout */}
      {type === "ASSIST" && (
        <div className="flex items-center justify-between gap-x-3 w-full">
          <div className="flex items-center gap-x-3 min-w-0">
            {/* Left Keyboard Shortcut Hotkey Badge */}
            <div
              className={cn(
                "h-6 w-6 lg:h-7 lg:w-7 border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-xs text-[11px] font-bold shrink-0 bg-white/90 shadow-2xs select-none",
                selected && "border-sky-300 text-sky-600 bg-sky-50",
                selected && status === "correct" && "border-green-500 text-green-600 bg-green-50",
                selected && status === "wrong" && "border-rose-500 text-rose-600 bg-rose-50"
              )}
              title={`Keyboard shortcut: ${shortcut}`}
            >
              {shortcut}
            </div>

            {/* Option Text */}
            <p
              className={cn(
                "text-neutral-700 text-sm lg:text-base font-bold truncate",
                selected && "text-sky-600",
                selected && status === "correct" && "text-green-600",
                selected && status === "wrong" && "text-rose-600"
              )}
            >
              {text}
            </p>
          </div>

          {/* Right Audio Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playSound();
            }}
            className="p-1.5 hover:bg-black/10 rounded-lg transition text-neutral-400 hover:text-sky-600 shrink-0 cursor-pointer"
            title="Read aloud"
            aria-label="Read aloud"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
