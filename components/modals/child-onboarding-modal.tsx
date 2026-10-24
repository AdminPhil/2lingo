"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, Sparkles, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChildOnboardingModal } from "@/store/use-child-onboarding-modal";
import { joinPodByCode } from "@/actions/pod";

type Props = {
  initialOpen?: boolean;
};

const CODE_LENGTH = 6;

export const ChildOnboardingModal = ({ initialOpen = false }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, open, close } = useChildOnboardingModal();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setIsClient(true);
    if (initialOpen) {
      // Check if user previously dismissed
      const dismissed = typeof window !== "undefined" && localStorage.getItem("dismissed_pod_onboarding") === "true";
      if (!dismissed) {
        open();
      }
    }
  }, [initialOpen, open]);

  // Focus first tile when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isClient) {
    return null;
  }

  const handleDigitChange = (index: number, value: string) => {
    const cleanChar = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanChar;
    setDigits(newDigits);

    // Auto-advance to next input
    if (cleanChar && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (i < pasted.length) {
        newDigits[i] = pasted[i];
      }
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const fullCode = digits.join("").trim();

  const handleJoin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (fullCode.length < 3) {
      toast.error("Please enter your complete pod join code.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await joinPodByCode(fullCode);
        if (res?.error) {
          toast.error(res.error);
        } else if (res?.success) {
          toast.success(`🎉 Dobrodošao u ${res.podName || "pod"}!`);
          if (typeof window !== "undefined") {
            localStorage.setItem("dismissed_pod_onboarding", "true");
          }
          close();
          router.push(`/leaderboard?podId=${res.podId || ""}`);
          router.refresh();
        }
      } catch (err) {
        toast.error("Could not join pod. Please check the code and try again.");
      }
    });
  };

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dismissed_pod_onboarding", "true");
    }
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => {
      if (!pending && !openState) {
        close();
      }
    }}>
      <DialogContent className="max-w-md overflow-hidden border-2 border-slate-200 p-6 sm:rounded-2xl">
        <DialogHeader className="text-center sm:text-center mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="relative h-20 w-20 animate-bounce">
              <Image
                src="/mascot.svg"
                alt="2Lingo Mascot"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-800">
            🇭🇷 Join Your Pod!
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium text-sm mt-1 px-4">
            Do you have a Family or School Pod code from your parent or teacher?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleJoin} className="space-y-6">
          {/* Large Kid-Friendly Letter Tiles */}
          <div>
            <div className="flex justify-center gap-2 sm:gap-3 my-2" onPaste={handlePaste}>
              {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digits[index]}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={pending}
                  className={`h-14 w-11 sm:h-16 sm:w-13 text-center text-2xl font-black uppercase font-mono rounded-xl border-2 transition-all outline-none ${
                    digits[index]
                      ? "border-green-500 bg-green-50 text-green-700 shadow-xs"
                      : "border-slate-300 bg-white text-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  }`}
                  aria-label={`Code letter ${index + 1}`}
                />
              ))}
            </div>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Type or paste your 6-letter family or classroom code (e.g. <span className="font-mono font-bold text-slate-600">ZGOMBA</span>)
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <Button
              type="submit"
              disabled={pending || fullCode.length < 3}
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {pending ? (
                <span>Joining circle...</span>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Join Learning Circle
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleDismiss}
              disabled={pending}
              className="w-full h-10 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              I don&apos;t have a code yet (I&apos;ll join later)
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
