"use client";

import { useState } from "react";
import { 
  Brain, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Flame, 
  Compass, 
  Volume2, 
  ChevronRight,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrickyWordsAnalytics } from "@/db/queries";

type Props = {
  analytics: TrickyWordsAnalytics;
};

export const TrickyWordsCard = ({ analytics }: Props) => {
  const [activeTab, setActiveTab] = useState<"words" | "units" | "prompts">("words");

  const {
    topTrickyWords,
    unitMasteries,
    conversationPrompts,
    totalMistakes,
    totalCompleted,
    overallAccuracyRate,
  } = analytics;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs mb-10">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-100 bg-linear-to-r from-purple-50 via-white to-pink-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-x-3.5">
          <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-sm">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <h3 className="font-black text-xl text-neutral-800">
                Tricky Words & Mistake Heatmap
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                CR-012 Live
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Formative assessment analytics across completed Croatian challenges
            </p>
          </div>
        </div>

        {/* Accuracy KPI Pill */}
        <div className="flex items-center gap-x-3 bg-white p-2.5 px-4 rounded-2xl border border-purple-200/80 shadow-xs">
          <div className="text-right">
            <p className="text-[11px] font-bold text-muted-foreground uppercase">Family Precision</p>
            <p className="text-xl font-black text-purple-600">{overallAccuracyRate}%</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-left">
            <p className="text-[11px] font-bold text-muted-foreground uppercase">Mastered</p>
            <p className="text-sm font-black text-neutral-800">{totalCompleted} <span className="text-xs text-slate-400 font-normal">pts</span></p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 px-6 bg-slate-50/70 gap-x-2 pt-2">
        <button
          onClick={() => setActiveTab("words")}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold flex items-center gap-x-2 border-b-2 transition ${
            activeTab === "words"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>Top Tricky Words ({topTrickyWords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("units")}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold flex items-center gap-x-2 border-b-2 transition ${
            activeTab === "units"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Unit Heatmap (Units 1–20)</span>
        </button>

        <button
          onClick={() => setActiveTab("prompts")}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold flex items-center gap-x-2 border-b-2 transition ${
            activeTab === "prompts"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Family Dinner Prompts</span>
        </button>
      </div>

      {/* Tab 1: Top Tricky Words */}
      {activeTab === "words" && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Challenges where the sisters used hearts or made repeated retries:
            </p>
            <span className="text-xs font-bold text-purple-600">
              {totalMistakes} logged retry events
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topTrickyWords.map((item, idx) => (
              <div
                key={item.challengeId}
                className="p-4 rounded-2xl border-2 border-slate-100 hover:border-purple-300 hover:shadow-xs transition bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-400">
                      #{idx + 1} • {item.unitTitle}
                    </span>
                    <span
                      className={`font-black text-[11px] px-2 py-0.5 rounded-full border ${
                        item.accuracyRate < 60
                          ? "bg-rose-100 text-rose-700 border-rose-200"
                          : item.accuracyRate < 80
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {item.accuracyRate}% Accuracy
                    </span>
                  </div>

                  <h4 className="text-base font-black text-neutral-800">
                    {item.correctAnswer}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    Prompt: {item.question}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-x-1.5 text-slate-500">
                    <span className="font-bold text-rose-500">Confusion:</span>
                    <span>Mistook for <strong className="text-neutral-700">{item.commonDistractor}</strong></span>
                  </div>
                  <span className="text-slate-400 font-semibold shrink-0">
                    💔 {item.missCount} {item.missCount === 1 ? "retry" : "retries"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Unit Heatmap */}
      {activeTab === "units" && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              Curriculum progression and mastery breakdown across all 20 units:
            </p>
            <div className="flex items-center gap-x-3 text-xs">
              <span className="flex items-center gap-x-1 font-bold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Mastered (90%+)
              </span>
              <span className="flex items-center gap-x-1 font-bold text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Solid (75-89%)
              </span>
              <span className="flex items-center gap-x-1 font-bold text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Needs Review
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {unitMasteries.map((unit) => {
              const isUpcoming = unit.status === "Upcoming";
              return (
                <div
                  key={unit.unitId}
                  className={`p-3.5 rounded-2xl border-2 transition ${
                    isUpcoming
                      ? "border-slate-100 bg-slate-50/50 opacity-70"
                      : unit.status === "Mastered"
                      ? "border-emerald-200 bg-emerald-50/30"
                      : unit.status === "Solid"
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-amber-200 bg-amber-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-neutral-800">
                      Unit {unit.unitOrder}
                    </span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
                        isUpcoming
                          ? "bg-slate-100 text-slate-500 border-slate-200"
                          : unit.status === "Mastered"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : unit.status === "Solid"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {unit.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground truncate font-medium" title={unit.description}>
                    {unit.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">
                      {isUpcoming ? "Locked" : `${unit.completedCount} solved`}
                    </span>
                    <span className={
                      isUpcoming 
                        ? "text-slate-400" 
                        : unit.accuracyRate >= 90 
                        ? "text-emerald-700" 
                        : "text-amber-700"
                    }>
                      {isUpcoming ? "—" : `${unit.accuracyRate}%`}
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full ${
                        isUpcoming
                          ? "bg-slate-300"
                          : unit.accuracyRate >= 90
                          ? "bg-emerald-500"
                          : unit.accuracyRate >= 75
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: isUpcoming ? "0%" : `${unit.accuracyRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Family Conversation Prompts */}
      {activeTab === "prompts" && (
        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-extrabold text-base text-neutral-800">
              Offline Croatian Reinforcement Prompts 🇭🇷
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Turn everyday family moments into natural language practice based on the tricky words identified above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {conversationPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-linear-to-b from-purple-50/50 to-white p-5 rounded-2xl border-2 border-purple-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-purple-100 text-purple-800 border border-purple-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {prompt.timing}
                    </span>
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </div>

                  <h5 className="font-black text-sm text-neutral-800">
                    {prompt.theme}
                  </h5>

                  <div className="my-3.5 p-3 bg-white rounded-xl border border-purple-100 shadow-2xs">
                    <p className="font-black text-purple-900 text-sm">
                      &ldquo;{prompt.croatian}&rdquo;
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {prompt.english}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {prompt.parentTip}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-100 text-[11px] text-purple-700 font-bold">
                  🎯 Targets: {prompt.targetWords}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
