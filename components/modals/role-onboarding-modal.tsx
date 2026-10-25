"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Users, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft,
  Heart,
  Trophy,
  Check
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoleModal } from "@/store/use-role-modal";
import { createFamilyOnboarding, selectLearnerRole } from "@/actions/family-onboarding";

type Props = {
  initialOpen?: boolean;
};

export const RoleOnboardingModal = ({ initialOpen = false }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, open, close } = useRoleModal();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Step state: 'choose_role' | 'parent_wizard'
  const [step, setStep] = useState<"choose_role" | "parent_wizard">("choose_role");

  // Parent form state
  const [familyName, setFamilyName] = useState("");
  const [targetXp, setTargetXp] = useState<number>(1000);
  const [customCode, setCustomCode] = useState("");

  useEffect(() => {
    setIsClient(true);
    if (initialOpen) {
      open();
    }
  }, [initialOpen, open]);

  if (!isClient) {
    return null;
  }

  const handleSelectLearner = () => {
    startTransition(async () => {
      try {
        const res = await selectLearnerRole();
        if (res?.success) {
          toast.success("Dobrodošao! Let's start learning Croatian! 🇭🇷");
          close();
          router.refresh();
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) {
      toast.error("Please enter a name for your family circle.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createFamilyOnboarding({
          familyName,
          targetXp,
          customCode: customCode.trim() || undefined,
        });

        if (res?.error) {
          toast.error(res.error);
        } else if (res?.success) {
          toast.success(`🎉 Family pod "${res.pod.name}" created! Join code: ${res.pod.inviteCode}`);
          close();
          setTimeout(() => {
            router.push("/admin");
          }, 150);
        }
      } catch (err) {
        toast.error("Failed to create family circle. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => {
      // Don't accidentally close if pending
      if (!pending && !openState) {
        close();
      }
    }}>
      <DialogContent className="max-w-lg overflow-hidden border-2 border-slate-200 p-0 sm:rounded-2xl">
        {step === "choose_role" ? (
          <div className="p-6">
            <DialogHeader className="text-center sm:text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-slate-200/90 shadow-sm bg-white">
                  <Image
                    src="/mascot.png"
                    alt="Paško the Dalmatian"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-800">
                🇭🇷 Dobrodošli u CroLingo!
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-sm mt-1">
                Are you joining today as a parent or a young learner?
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              {/* Option A: Parent / Educator */}
              <button
                type="button"
                onClick={() => setStep("parent_wizard")}
                disabled={pending}
                className="group relative flex flex-col items-start p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 hover:border-emerald-500 transition-all text-left shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-base">
                  Parent / Educator
                </div>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-1 mb-2">
                  Family Circle Admin
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Create a family pod, track your children&apos;s progress, celebrate weekly goals, and support tricky words.
                </p>
                <div className="mt-4 flex items-center text-xs font-bold text-emerald-700 gap-1 group-hover:translate-x-1 transition-transform">
                  Set up circle <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>

              {/* Option B: Young Learner */}
              <button
                type="button"
                onClick={handleSelectLearner}
                disabled={pending}
                className="group relative flex flex-col items-start p-5 rounded-2xl border-2 border-sky-200 bg-sky-50/50 hover:bg-sky-100/60 hover:border-sky-500 transition-all text-left shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                <div className="h-10 w-10 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-base">
                  Young Learner
                </div>
                <div className="text-xs font-semibold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-full mt-1 mb-2">
                  Student Access
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Start practicing Croatian right away, earn XP, climb the pod leaderboard, and collect crowns.
                </p>
                <div className="mt-4 flex items-center text-xs font-bold text-sky-700 gap-1 group-hover:translate-x-1 transition-transform">
                  Start learning <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateFamily} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("choose_role")}
                disabled={pending}
                className="h-8 px-2 text-slate-500 hover:text-slate-800"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            <DialogHeader className="text-left mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <DialogTitle className="text-xl font-black text-slate-800">
                  Create Your Family Circle
                </DialogTitle>
              </div>
              <DialogDescription className="text-slate-500 font-medium text-xs mt-1">
                Give your family circle a name and invite your children to learn together.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Family Circle Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. The Horvat Family"
                  value={familyName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFamilyName(e.target.value)}
                  disabled={pending}
                  className="h-11 rounded-xl border-2 focus-visible:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Weekly Celebration Target (XP)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000].map((xp) => (
                    <button
                      key={xp}
                      type="button"
                      onClick={() => setTargetXp(xp)}
                      disabled={pending}
                      className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        targetXp === xp
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      {xp} XP {xp === 1000 && "⭐"}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  1,000 XP unlocks the weekly pod celebration animation when reached.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Custom Pod Join Code (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. HORVAT (or leave blank to auto-generate)"
                  value={customCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomCode(e.target.value.toUpperCase())}
                  disabled={pending}
                  maxLength={10}
                  className="h-11 rounded-xl border-2 uppercase font-mono tracking-wider focus-visible:ring-emerald-500 font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Children will type this 6-character code to join your family circle.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={pending || !familyName.trim()}
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {pending ? (
                    <span>Creating your family circle...</span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Create Circle & Open Parent Center
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
