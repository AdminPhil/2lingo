"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectedToken = {
  index: number;
  word: string;
};

type Props = {
  wordBank: string[];
  selectedTokens: SelectedToken[];
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
  onAddToken: (index: number, word: string) => void;
  onRemoveToken: (index: number) => void;
  onClear: () => void;
};

/**
 * Tier 5 Challenge UI: Active Word-Bank Sentence Assembly (`BUILD_SENTENCE`)
 * Trains active Croatian word order, clitic placement, and case endings.
 */
export const BuildSentenceBoard = ({
  wordBank,
  selectedTokens,
  status,
  disabled,
  onAddToken,
  onRemoveToken,
  onClear,
}: Props) => {
  const usedIndices = new Set(selectedTokens.map((t) => t.index));
  const locked = disabled || status !== "none";

  return (
    <div className="flex flex-col gap-y-6 w-full">
      {/* Answer Construction Tray */}
      <div
        data-testid="sentence-tray"
        className={cn(
          "min-h-[84px] w-full rounded-2xl border-2 border-dashed p-3.5 flex flex-wrap items-center gap-2 transition-colors bg-slate-50/70",
          status === "none" && "border-slate-300",
          status === "correct" && "border-green-400 bg-green-50/80 border-solid",
          status === "wrong" && "border-rose-400 bg-rose-50/80 border-solid"
        )}
      >
        {selectedTokens.length === 0 ? (
          <span className="text-sm font-semibold text-slate-400 select-none">
            Tap Croatian words below to build your sentence...
          </span>
        ) : (
          selectedTokens.map((token) => (
            <button
              key={`tray-${token.index}`}
              type="button"
              disabled={locked}
              onClick={() => onRemoveToken(token.index)}
              className={cn(
                "px-3.5 py-2 rounded-xl border-2 border-b-4 text-sm sm:text-base font-bold transition-all cursor-pointer",
                status === "none" &&
                  "bg-white border-sky-400 text-sky-900 hover:bg-sky-50 active:border-b-2",
                status === "correct" && "bg-green-100 border-green-500 text-green-900",
                status === "wrong" && "bg-rose-100 border-rose-500 text-rose-900",
                locked && "pointer-events-none"
              )}
            >
              {token.word}
            </button>
          ))
        )}

        {selectedTokens.length > 0 && status === "none" && !disabled && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear sentence"
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition cursor-pointer"
            title="Clear all words"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Word Bank Pool */}
      <div
        data-testid="word-bank"
        className="flex flex-wrap items-center justify-center gap-2.5 pt-2"
      >
        {wordBank.map((word, index) => {
          const isUsed = usedIndices.has(index);
          return (
            <button
              key={`bank-${index}-${word}`}
              type="button"
              disabled={locked || isUsed}
              onClick={() => onAddToken(index, word)}
              className={cn(
                "px-4 py-2.5 rounded-xl border-2 border-b-4 text-sm sm:text-base font-bold transition-all",
                isUsed
                  ? "bg-slate-100 border-slate-200 border-b-2 text-transparent select-none cursor-default"
                  : "bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 active:border-b-2 active:translate-y-0.5 cursor-pointer",
                locked && !isUsed && "opacity-60 pointer-events-none"
              )}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
