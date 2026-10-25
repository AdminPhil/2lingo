"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, ArrowRight, Loader2 } from "lucide-react";
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
import { useParentalGateModal } from "@/store/use-parental-gate-modal";
import { unlockParentAccess } from "@/actions/family-onboarding";

export const ParentalGateModal = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useParentalGateModal();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [num1, setNum1] = useState(14);
  const [num2, setNum2] = useState(17);
  const [answer, setAnswer] = useState("");

  const generateChallenge = () => {
    const a = Math.floor(Math.random() * 20) + 12; // 12 - 31
    const b = Math.floor(Math.random() * 20) + 11; // 11 - 30
    setNum1(a);
    setNum2(b);
    setAnswer("");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      generateChallenge();
    }
  }, [isOpen]);

  if (!isClient) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = num1 + num2;
    const provided = parseInt(answer.trim(), 10);

    if (isNaN(provided) || provided !== expected) {
      toast.error("Incorrect answer. Parent access is protected.");
      generateChallenge();
      return;
    }

    startTransition(async () => {
      try {
        const res = await unlockParentAccess();
        if (res?.success) {
          toast.success("🎉 Parent & Educator access unlocked! Welcome!");
          close();
          router.push("/admin");
          router.refresh();
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !pending && !open && close()}>
      <DialogContent className="max-w-md p-6 sm:rounded-2xl border-2 border-slate-200">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-black text-slate-900">
                Za Odrasle • Grown-Ups Only
              </DialogTitle>
              <p className="text-xs text-slate-500 font-medium">
                Parent & Educator Center Verification
              </p>
            </div>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
            To ensure young learners stay safely on their learning path, please solve this quick math problem to unlock parent controls and family pods:
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="p-4 bg-slate-50 border-2 border-slate-200/90 rounded-2xl flex flex-col items-center justify-center gap-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Adult Verification Challenge
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wider">
              {num1} + {num2} = ?
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Answer
            </label>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter result..."
              className="h-12 text-center text-lg font-bold border-2 border-slate-300 focus:border-blue-900 rounded-xl"
              disabled={pending}
            />
          </div>

          <div className="flex items-center gap-x-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={close}
              disabled={pending}
              className="w-1/2 h-12 rounded-xl text-slate-600 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending || !answer.trim()}
              className="w-1/2 h-12 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-black flex items-center justify-center gap-x-2 shadow-xs cursor-pointer"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Enter Admin</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
