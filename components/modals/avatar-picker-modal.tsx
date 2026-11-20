"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CLASSROOM_AVATARS } from "@/lib/classroom-roster";
import { updateLearnerAvatar } from "@/actions/user-progress";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarSrc: string;
  userName?: string;
  onAvatarUpdated?: (newSrc: string) => void;
};

export const AvatarPickerModal = ({
  isOpen,
  onOpenChange,
  currentAvatarSrc,
  userName,
  onAvatarUpdated,
}: Props) => {
  const [selectedSrc, setSelectedSrc] = useState<string>(currentAvatarSrc);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen) {
      setSelectedSrc(currentAvatarSrc);
    }
  }, [isOpen, currentAvatarSrc]);

  const handleSave = () => {
    if (!selectedSrc) return;
    startTransition(async () => {
      try {
        const res = await updateLearnerAvatar(selectedSrc);
        if (res.error) {
          toast.error(res.error);
          return;
        }
        const chosen = CLASSROOM_AVATARS.find((a) => a.src === selectedSrc);
        toast.success(
          chosen ? `Mascot updated to ${chosen.label}!` : "Mascot avatar updated!"
        );
        onAvatarUpdated?.(selectedSrc);
        onOpenChange(false);
      } catch {
        toast.error("Could not save your mascot right now. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-2xl border-2 border-slate-200">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <DialogTitle className="text-center font-black text-xl text-slate-800">
              Choose Your Croatian Mascot
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-sm text-slate-600 font-medium">
            {userName
              ? `Pick who cheers you on across /learn and the Leaderboard, ${userName}!`
              : "Pick your favorite CroLingo mascot to display on your profile & leaderboard!"}
          </DialogDescription>
        </DialogHeader>

        <div
          role="radiogroup"
          aria-label="Croatian Mascot Avatars"
          className="grid grid-cols-3 gap-3 py-3"
        >
          {CLASSROOM_AVATARS.map((mascot) => {
            const isSelected = selectedSrc === mascot.src;
            return (
              <button
                key={mascot.src}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedSrc(mascot.src)}
                className={cn(
                  "group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  isSelected
                    ? "border-blue-600 bg-blue-50/80 shadow-sm scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                  <Image
                    src={mascot.src}
                    alt={mascot.label}
                    fill
                    className="object-cover"
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-extrabold tracking-tight",
                    isSelected ? "text-blue-900" : "text-slate-700"
                  )}
                >
                  {mascot.label}
                </span>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs"
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() => onOpenChange(false)}
            className="font-bold text-slate-600"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending || selectedSrc === currentAvatarSrc}
            onClick={handleSave}
            className="font-extrabold"
          >
            {pending ? "Saving..." : "Save Mascot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
