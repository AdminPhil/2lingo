"use client";

import React from "react";
import { Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type WorldItem = {
  worldNum: number;
  name: string;
  emoji: string;
  startUnit: number;
  endUnit: number;
  level: 1 | 2;
  activeColor: string;
};

const WORLDS: WorldItem[] = [
  {
    worldNum: 1,
    name: "Zagreb",
    emoji: "🏰",
    startUnit: 1,
    endUnit: 5,
    level: 1,
    activeColor: "bg-red-500 text-white border-red-600 shadow-red-200",
  },
  {
    worldNum: 2,
    name: "Obala",
    emoji: "🌊",
    startUnit: 6,
    endUnit: 10,
    level: 1,
    activeColor: "bg-sky-500 text-white border-sky-600 shadow-sky-200",
  },
  {
    worldNum: 3,
    name: "Plitvice",
    emoji: "🌲",
    startUnit: 11,
    endUnit: 15,
    level: 1,
    activeColor: "bg-emerald-500 text-white border-emerald-600 shadow-emerald-200",
  },
  {
    worldNum: 4,
    name: "Dubrovnik",
    emoji: "👑",
    startUnit: 16,
    endUnit: 20,
    level: 1,
    activeColor: "bg-blue-700 text-white border-blue-900 shadow-blue-200",
  },
  {
    worldNum: 5,
    name: "Istra",
    emoji: "🏛️",
    startUnit: 21,
    endUnit: 25,
    level: 2,
    activeColor: "bg-amber-500 text-white border-amber-600 shadow-amber-200",
  },
  {
    worldNum: 6,
    name: "Slavonija",
    emoji: "🌾",
    startUnit: 26,
    endUnit: 30,
    level: 2,
    activeColor: "bg-emerald-600 text-white border-emerald-700 shadow-emerald-200",
  },
  {
    worldNum: 7,
    name: "Zagorje",
    emoji: "🏰",
    startUnit: 31,
    endUnit: 35,
    level: 2,
    activeColor: "bg-purple-600 text-white border-purple-800 shadow-purple-200",
  },
];

type Props = {
  activeUnitOrder?: number;
};

export const WorldNavigator = ({ activeUnitOrder = 1 }: Props) => {
  const currentWorldNum = React.useMemo(() => {
    const found = WORLDS.find(
      (w) => activeUnitOrder >= w.startUnit && activeUnitOrder <= w.endUnit
    );
    return found ? found.worldNum : 1;
  }, [activeUnitOrder]);

  const handleJump = (startUnit: number) => {
    const el = document.getElementById(`unit-${startUnit}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-3 mb-6 shadow-xs">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Skoči u Svijet • Fast-Travel
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> 7 Svjetova • 35 Jedinica
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {WORLDS.map((world) => {
          const isCurrent = world.worldNum === currentWorldNum;
          return (
            <button
              key={world.worldNum}
              type="button"
              onClick={() => handleJump(world.startUnit)}
              className={cn(
                "group relative shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all active:translate-y-0.5",
                isCurrent
                  ? cn(world.activeColor, "shadow-sm scale-[1.02]")
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100"
              )}
            >
              <span className="text-sm leading-none">{world.emoji}</span>
              <span className="whitespace-nowrap">
                W{world.worldNum}: {world.name}
              </span>
              {world.worldNum === 7 && (
                <span className="ml-0.5 px-1 py-0.2 rounded-md bg-amber-400 text-amber-950 text-[9px] font-black uppercase tracking-tight">
                  Novo
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
