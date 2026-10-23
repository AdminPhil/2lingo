"use client";

import { useState, useTransition } from "react";
import { Hand, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { claimCheer } from "@/actions/cheer";

type Cheer = {
  id: number;
  senderName: string;
  type: string;
  createdAt: Date;
};

type Props = {
  cheers: Cheer[];
};

export const CheerBanner = ({ cheers: initialCheers }: Props) => {
  const [cheers, setCheers] = useState(initialCheers);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  if (!cheers || cheers.length === 0) {
    return null;
  }

  const currentCheer = cheers[0];

  const onClaim = (id: number) => {
    setPendingId(id);
    startTransition(async () => {
      try {
        const res = await claimCheer(id);
        if (res?.success) {
          toast.success("🌟 +5 XP Bonus claimed! High-five received! 👋");
          setCheers((prev) => prev.filter((c) => c.id !== id));
        } else {
          toast.error(res?.error || "Failed to claim cheer.");
        }
      } catch {
        toast.error("Something went wrong claiming cheer.");
      } finally {
        setPendingId(null);
      }
    });
  };

  return (
    <div className="w-full bg-amber-500 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white rounded-2xl p-3.5 mb-6 shadow-md flex items-center justify-between gap-3 animate-pulse">
      <div className="flex items-center gap-x-2.5">
        <div className="p-2 bg-white/20 rounded-xl">
          <Hand className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-extrabold text-sm sm:text-base leading-tight">
            {currentCheer.senderName} sent you a High-Five! 👋
          </p>
          <p className="text-xs text-white/90 font-medium">
            Family Cheer • Tap to collect your +5 XP bonus!
          </p>
        </div>
      </div>

      <Button
        variant="primary"
        size="sm"
        disabled={pendingId === currentCheer.id}
        onClick={() => onClaim(currentCheer.id)}
        className="bg-white hover:bg-neutral-100 text-amber-700 font-extrabold text-xs shadow-xs shrink-0 cursor-pointer"
      >
        <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500" />
        {pendingId === currentCheer.id ? "Claiming..." : "Claim +5 XP"}
      </Button>
    </div>
  );
};
