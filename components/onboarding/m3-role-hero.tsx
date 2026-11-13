"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Users,
  GraduationCap,
  ShieldCheck,
  Ticket,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  isParent?: boolean;
  initialJoinCode?: string;
  initialTeamName?: string;
};

type SetupRole = "parent" | "teacher" | null;

const ROLE_SETUP_CONFIG = {
  parent: {
    icon: "👨‍👩‍👧",
    title: "Family Setup",
    description:
      "Create a private family circle in 2 minutes and add children without needing child email addresses.",
    bullets: [
      "COPPA-compliant child accounts (username + password)",
      "Printable 1-tap QR login badges for kids",
      "Parent dashboard for heart refills & tricky word insights",
    ],
    ctaLabel: "Set Up Family Team",
    CtaIcon: Users,
    redirectUrl: "/welcome?role=parent",
  },
  teacher: {
    icon: "🏫",
    title: "Classroom Setup",
    description:
      "Launch a heritage language classroom up to 50 students with instant roster import and smartboard slides.",
    bullets: [
      "Paste a class roster to auto-provision student accounts",
      "Print 8-up lanyard QR passes for zero-typing login",
      "Project smartboard join slides for fast class starts",
    ],
    ctaLabel: "Set Up Classroom Team",
    CtaIcon: GraduationCap,
    redirectUrl: "/welcome?role=teacher",
  },
} as const;

export const M3RoleHero = ({
  isParent = false,
  initialJoinCode = "",
  initialTeamName = "",
}: Props) => {
  const [setupRole, setSetupRole] = useState<SetupRole>(null);
  const [joinCodeInput, setJoinCodeInput] = useState(initialJoinCode);
  const [activeJoinCode, setActiveJoinCode] = useState(initialJoinCode);
  const [showCodeInput, setShowCodeInput] = useState(Boolean(initialJoinCode));

  const handleApplyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = joinCodeInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    setActiveJoinCode(clean);
  };

  const clearCode = () => {
    setActiveJoinCode("");
    setJoinCodeInput("");
    setShowCodeInput(false);
  };

  const learnerRedirectUrl = activeJoinCode
    ? `/learn?join=${encodeURIComponent(activeJoinCode)}`
    : "/learn";

  const activeConfig = setupRole ? ROLE_SETUP_CONFIG[setupRole] : null;

  return (
    <div className="w-full flex flex-col items-center lg:items-start gap-y-4">
      {/* Signed Out Experience */}
      <SignedOut>
        {/* Active Join Banner if user scanned QR or entered team code */}
        {activeJoinCode && (
          <div className="w-full p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-2.5 shadow-2xs animate-in fade-in">
            <span className="text-xl">🎉</span>
            <div className="flex-1">
              <span>You&apos;re joining team </span>
              <span className="font-mono font-black tracking-widest bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                {activeJoinCode}
              </span>
              {initialTeamName && (
                <span className="font-extrabold text-emerald-800"> ({initialTeamName})</span>
              )}
              <span>. Sign up below to join automatically!</span>
            </div>
            <button
              type="button"
              onClick={clearCode}
              className="text-emerald-700 hover:text-emerald-950 font-black text-xs px-2 py-1 cursor-pointer"
              aria-label="Clear team code"
            >
              ✕
            </button>
          </div>
        )}

        {/* Material 3 Action Stack: Returning User ABOVE New User, unified h-12 (48px) */}
        <div className="w-full flex flex-col gap-3">
          {/* 1. Returning User FIRST (Material 3 Tonal/Outlined 48px) */}
          <SignInButton
            mode="modal"
            afterSignInUrl={learnerRedirectUrl}
            afterSignUpUrl={learnerRedirectUrl}
          >
            <button
              type="button"
              className="w-full h-12 px-6 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 font-bold text-sm sm:text-base transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Already have an account?</span>
              <span className="font-black text-blue-700 underline underline-offset-2">
                Log in
              </span>
            </button>
          </SignInButton>

          {/* 2. New Learner Direct CTA SECOND (Material 3 Filled 48px) */}
          <SignUpButton
            mode="modal"
            afterSignInUrl={learnerRedirectUrl}
            afterSignUpUrl={learnerRedirectUrl}
          >
            <button
              type="button"
              className="w-full h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-amber-300 shrink-0" />
              <span>Start Learning (Free)</span>
            </button>
          </SignUpButton>

          {/* 3. Progressive Disclosure for Team Join Code */}
          <div className="pt-1">
            {!showCodeInput && !activeJoinCode ? (
              <button
                type="button"
                onClick={() => setShowCodeInput(true)}
                className="w-full text-xs font-bold text-slate-500 hover:text-blue-700 transition flex items-center justify-center gap-1.5 py-1.5 cursor-pointer"
              >
                <Ticket className="h-3.5 w-3.5 text-slate-400" />
                <span>Have a class or family team code?</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
            ) : (
              <form
                onSubmit={handleApplyCode}
                className="flex items-center gap-2 pt-1 animate-in fade-in"
              >
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    maxLength={10}
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE E.G. HRVAT3"
                    className="w-full h-10 pl-8 pr-3 bg-slate-50 border border-slate-300 rounded-full font-mono font-bold text-xs uppercase tracking-wider text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black tracking-wide transition shadow-xs cursor-pointer"
                >
                  Join
                </button>
                <button
                  type="button"
                  onClick={() => setShowCodeInput(false)}
                  className="h-10 w-10 rounded-full text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer"
                  title="Hide code input"
                >
                  ✕
                </button>
              </form>
            )}
          </div>

          {/* 4. Minimal Trust Guarantee */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>100% Free • COPPA Compliant • No Ads</span>
          </div>
        </div>

        {/* Clean White Role Cards for Parents & Teachers (No grey bar) */}
        <div className="w-full space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500 text-center lg:text-left px-1">
            Setting up for a family or classroom?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <button
              type="button"
              onClick={() => setSetupRole("parent")}
              className="bg-white hover:bg-rose-50/50 border border-slate-200 hover:border-rose-400 rounded-2xl p-3.5 text-left transition shadow-2xs hover:shadow-sm cursor-pointer flex items-center gap-3"
            >
              <span className="text-2xl shrink-0">👨‍👩‍👧</span>
              <div>
                <div className="text-sm font-black text-slate-900">
                  I&apos;m a Parent
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  Family circle &amp; child setup →
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSetupRole("teacher")}
              className="bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 rounded-2xl p-3.5 text-left transition shadow-2xs hover:shadow-sm cursor-pointer flex items-center gap-3"
            >
              <span className="text-2xl shrink-0">🏫</span>
              <div>
                <div className="text-sm font-black text-slate-900">
                  I&apos;m a Teacher
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  Class roster &amp; QR passes →
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Exitable Pop-up Setup Dialog for Parent / Teacher */}
        <Dialog open={Boolean(setupRole)} onOpenChange={(open) => !open && setSetupRole(null)}>
          <DialogContent className="sm:max-w-md rounded-[28px] p-6 bg-white border border-slate-200">
            {activeConfig && (
              <div className="space-y-4">
                <DialogHeader className="text-left space-y-1.5 pr-6">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{activeConfig.icon}</span>
                    <DialogTitle className="text-lg font-black text-slate-900">
                      {activeConfig.title}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-sm text-slate-600 font-medium leading-relaxed">
                    {activeConfig.description}
                  </DialogDescription>
                </DialogHeader>

                <ul className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {activeConfig.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-xs font-bold text-slate-700"
                    >
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Returning User ABOVE New User, unified Material 3 h-12 (48px) */}
                <div className="flex flex-col gap-2.5 pt-1">
                  <SignInButton
                    mode="modal"
                    afterSignInUrl="/admin"
                    afterSignUpUrl={activeConfig.redirectUrl}
                  >
                    <button
                      type="button"
                      onClick={() => setTimeout(() => setSetupRole(null), 50)}
                      className="w-full h-12 px-6 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 font-bold text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Already have an account?</span>
                      <span className="font-black text-blue-700 underline underline-offset-2">
                        Log in
                      </span>
                    </button>
                  </SignInButton>

                  <SignUpButton
                    mode="modal"
                    afterSignInUrl="/admin"
                    afterSignUpUrl={activeConfig.redirectUrl}
                  >
                    <button
                      type="button"
                      onClick={() => setTimeout(() => setSetupRole(null), 50)}
                      className="w-full h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm hover:shadow-md cursor-pointer"
                    >
                      <activeConfig.CtaIcon className="h-5 w-5 text-amber-300 shrink-0" />
                      <span>{activeConfig.ctaLabel}</span>
                    </button>
                  </SignUpButton>

                  <button
                    type="button"
                    onClick={() => setSetupRole(null)}
                    className="w-full h-10 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                  >
                    ← Back to Main Page
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </SignedOut>

      {/* Signed In Experience */}
      <SignedIn>
        <div className="w-full bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <span className="text-base font-black text-slate-900">
              Welcome back! Ready to continue?
            </span>
          </div>

          <Link
            href={isParent ? "/admin" : "/learn"}
            className="w-full h-12 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>
              {isParent ? "Open Parent & Educator Center" : "Continue Learning"}
            </span>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </Link>
        </div>
      </SignedIn>
    </div>
  );
};
