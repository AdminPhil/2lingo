"use client";

import React from "react";
import Link from "next/link";
import { Compass, Layers, Sparkles } from "lucide-react";

import { ALL_STAGES } from "@/lib/theme-registry";
import { getLevelForUnitOrder } from "@/lib/v2/lesson-helpers";
import { cn } from "@/lib/utils";

type Props = {
  activeUnitOrder: number;
  selectedLevel: number;
};

const LEVEL_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: { title: "Level 1", subtitle: "Pre-A1 → A1.1" },
  2: { title: "Level 2", subtitle: "A1.2 → A2.1" },
  3: { title: "Level 3", subtitle: "Solid A2" },
  4: { title: "Level 4", subtitle: "Early B1" },
  5: { title: "Level 5", subtitle: "Solid B1" },
};

export const WorldNavigator = ({ activeUnitOrder, selectedLevel }: Props) => {
  const activeLevel = getLevelForUnitOrder(activeUnitOrder);

  // Dynamically derive available Levels & Worlds from ALL_STAGES (auto-scales to Worlds 13-20!)
  const levelsAvailable = Array.from(
    new Set(ALL_STAGES.map((s) => getLevelForUnitOrder(s.unitRange[0])))
  ).sort((a, b) => a - b);

  const visibleWorlds = ALL_STAGES.filter(
    (s) => getLevelForUnitOrder(s.unitRange[0]) === selectedLevel
  );

  const handleJump = (startUnit: number) => {
    const el = document.getElementById(`unit-${startUnit}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mb-6 bg-white/95 backdrop-blur-xs border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
      {/* Row 1: Level Tabs (renders only ~20 units per level for crisp iPad/mobile performance) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-x-2">
          <Layers className="h-4 w-4 text-blue-700 shrink-0" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Learning Levels
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Learning Levels">
          {levelsAvailable.map((lvl) => {
            const isSelected = lvl === selectedLevel;
            const isLearnerCurrentLevel = lvl === activeLevel;
            const meta = LEVEL_LABELS[lvl] || { title: `Level ${lvl}`, subtitle: "" };

            return (
              <Link
                key={lvl}
                href={`/learn?level=${lvl}`}
                role="tab"
                aria-selected={isSelected}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5",
                  isSelected
                    ? "bg-blue-900 text-white border-blue-950 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                )}
              >
                <span>{meta.title}</span>
                {meta.subtitle && (
                  <span
                    className={cn(
                      "hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                      isSelected ? "bg-white/20 text-blue-100" : "bg-slate-200/80 text-slate-500"
                    )}
                  >
                    {meta.subtitle}
                  </span>
                )}
                {isLearnerCurrentLevel && !isSelected && (
                  <span
                    className="h-2 w-2 rounded-full bg-emerald-500"
                    title="Your current active level"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Row 2: Fast-Travel World Jumper for the Active Level */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-x-1.5 shrink-0">
          <Compass className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Jump to World:
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {visibleWorlds.map((world) => {
            const [startUnit, endUnit] = world.unitRange;
            const isCurrentWorld =
              activeUnitOrder >= startUnit && activeUnitOrder <= endUnit;

            return (
              <button
                key={world.id}
                type="button"
                onClick={() => handleJump(startUnit)}
                className={cn(
                  "shrink-0 px-2.5 py-1.5 rounded-xl border-2 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
                  isCurrentWorld
                    ? `${world.solidBg} text-white border-black/20 shadow-xs`
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                )}
              >
                <span aria-hidden="true">{world.accentEmoji}</span>
                <span>
                  W{world.stage}: {world.stageName}
                </span>
                {isCurrentWorld && <Sparkles className="h-3 w-3 text-amber-300" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
