"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, ChevronDown, Plus, Sparkles, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useChildOnboardingModal } from "@/store/use-child-onboarding-modal";

type PodOption = {
  id: number;
  name: string;
  type: string;
  inviteCode: string;
  memberCount: number;
  currentXp: number;
  targetXp: number | null;
  role: string;
};

type Props = {
  pods: PodOption[];
  activePodId: number;
};

export const PodSwitcher = ({ pods, activePodId }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open: openJoinModal } = useChildOnboardingModal();

  const handleSelectPod = (podId: number) => {
    if (podId === activePodId) return;
    router.push(`/leaderboard?podId=${podId}`);
  };

  const activePod = pods.find((p) => p.id === activePodId) || pods[0];

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border-2 border-slate-200/80 rounded-2xl p-3 sm:px-4 shadow-xs">
        {/* Pod Selector / Indicator */}
        <div className="flex items-center gap-x-3 overflow-x-auto py-1">
          <div className="p-2 bg-green-100 rounded-xl text-green-700 shrink-0">
            <Users className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 hidden md:inline">
              Active Circle:
            </span>

            {pods.length > 0 ? (
              pods.map((pod) => {
                const isActive = pod.id === activePodId;
                return (
                  <button
                    key={pod.id}
                    type="button"
                    onClick={() => handleSelectPod(pod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-green-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    <span>{pod.name}</span>
                    {isActive && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })
            ) : (
              <span className="text-sm font-bold text-slate-700">
                {activePod?.name || "Family Circle"}
              </span>
            )}
          </div>
        </div>

        {/* Join Another Pod CTA */}
        <Button
          variant="secondary"
          size="sm"
          onClick={openJoinModal}
          className="border-2 border-green-500/80 bg-green-50 hover:bg-green-100 text-green-700 font-black text-xs h-9 px-3 rounded-xl shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Join a Pod</span>
        </Button>
      </div>
    </div>
  );
};
