"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  KeyRound, 
  Sparkles, 
  ArrowRight, 
  Users, 
  GraduationCap, 
  BookOpen, 
  QrCode, 
  ShieldCheck,
  CheckCircle2,
  Ticket
} from "lucide-react";
import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut 
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type Props = {
  isParent: boolean;
  initialJoinCode?: string;
  initialTeamName?: string;
};

export const RoleOnboardingHero = ({
  isParent,
  initialJoinCode = "",
  initialTeamName = "",
}: Props) => {
  const [selectedRole, setSelectedRole] = useState<"learner" | "parent" | "teacher">("learner");
  const [joinCodeInput, setJoinCodeInput] = useState(initialJoinCode);
  const [activeJoinCode, setActiveJoinCode] = useState(initialJoinCode);

  const handleApplyCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = joinCodeInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    setActiveJoinCode(clean);
  };

  const learnerSignUpUrl = activeJoinCode ? `/learn?join=${encodeURIComponent(activeJoinCode)}` : "/learn";
  const learnerSignInUrl = activeJoinCode ? `/learn?join=${encodeURIComponent(activeJoinCode)}` : "/learn";

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
              {initialTeamName && <span className="font-extrabold text-emerald-800"> ({initialTeamName})</span>}
              <span>. Sign up below to join automatically!</span>
            </div>
          </div>
        )}

        {/* 3-Way Role Selector Pill Bar */}
        <div className="w-full bg-slate-100/90 p-1.5 rounded-2xl border-2 border-slate-300 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSelectedRole("learner")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === "learner"
                ? "bg-white text-blue-900 shadow-xs border border-slate-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🎒</span>
            <span className="hidden sm:inline">I&apos;m a</span>
            <span>Learner</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("parent")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === "parent"
                ? "bg-white text-blue-900 shadow-xs border border-slate-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>👨‍👩‍👧</span>
            <span className="hidden sm:inline">I&apos;m a</span>
            <span>Parent</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("teacher")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === "teacher"
                ? "bg-white text-blue-900 shadow-xs border border-slate-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🏫</span>
            <span className="hidden sm:inline">I&apos;m a</span>
            <span>Teacher</span>
          </button>
        </div>

        {/* Dynamic Role Action Card */}
        <div className="w-full bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col gap-4">
          {/* Role Header Description */}
          {selectedRole === "learner" && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Student & Independent Learner
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Playful bite-sized lessons, streak rewards, and team challenges.
              </p>
            </div>
          )}

          {selectedRole === "parent" && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">👨‍👩‍👧</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Croatian Family Team Setup
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Set up your family in 2 minutes. Add children with zero emails and print 1-tap QR badges.
              </p>
            </div>
          )}

          {selectedRole === "teacher" && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏫</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Classroom & Heritage School Setup
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Paste your student roster, print desk or lanyard passes, and show live join slides on your smartboard.
              </p>
            </div>
          )}

          {/* Action Buttons for Selected Role */}
          {selectedRole === "learner" && (
            <div className="flex flex-col gap-3">
              <SignUpButton
                mode="modal"
                afterSignInUrl={learnerSignInUrl}
                afterSignUpUrl={learnerSignUpUrl}
              >
                <Button
                  size="lg"
                  className="w-full text-sm sm:text-base font-black bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-x-2.5 h-13 rounded-2xl shadow-sm tracking-normal cursor-pointer"
                >
                  <Sparkles className="h-5 w-5 text-amber-300 shrink-0" />
                  <span>I&apos;m New Here! Start Learning</span>
                </Button>
              </SignUpButton>

              <SignInButton
                mode="modal"
                afterSignInUrl={learnerSignInUrl}
                afterSignUpUrl={learnerSignUpUrl}
              >
                <Button
                  size="lg"
                  variant="default"
                  className="w-full text-sm sm:text-base font-black bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-300 hover:border-slate-400 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-x-2.5 h-13 rounded-2xl shadow-sm tracking-normal cursor-pointer"
                >
                  <KeyRound className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>I Already Have an Account</span>
                </Button>
              </SignInButton>

              {/* Team Code Inline Join Form */}
              <form onSubmit={handleApplyCode} className="mt-1 pt-3 border-t border-slate-200 flex items-center gap-2">
                <Ticket className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-xs font-black text-slate-600 whitespace-nowrap">Have a code?</span>
                <input
                  type="text"
                  maxLength={10}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. HRVAT3"
                  className="flex-1 font-mono font-black tracking-widest uppercase text-xs sm:text-sm px-2.5 py-1.5 border-2 border-slate-300 rounded-xl outline-none focus:border-blue-600 transition"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 px-3 font-black text-xs bg-slate-800 hover:bg-slate-900 text-white rounded-xl cursor-pointer"
                >
                  Join
                </Button>
              </form>
            </div>
          )}

          {selectedRole === "parent" && (
            <div className="flex flex-col gap-3">
              <SignUpButton
                mode="modal"
                afterSignInUrl="/welcome?role=parent"
                afterSignUpUrl="/welcome?role=parent"
              >
                <Button
                  size="lg"
                  className="w-full text-sm sm:text-base font-black bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-x-2.5 h-13 rounded-2xl shadow-sm tracking-normal cursor-pointer"
                >
                  <Users className="h-5 w-5 text-amber-300 shrink-0" />
                  <span>Set Up Family Team (Free)</span>
                </Button>
              </SignUpButton>

              <SignInButton
                mode="modal"
                afterSignInUrl="/admin"
                afterSignUpUrl="/welcome?role=parent"
              >
                <Button
                  size="lg"
                  variant="default"
                  className="w-full text-sm sm:text-base font-black bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-300 hover:border-slate-400 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-x-2.5 h-13 rounded-2xl shadow-sm tracking-normal cursor-pointer"
                >
                  <KeyRound className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Parent Sign In</span>
                </Button>
              </SignInButton>
            </div>
          )}

          {selectedRole === "teacher" && (
            <div className="flex flex-col gap-3">
              <SignUpButton
                mode="modal"
                afterSignInUrl="/welcome?role=teacher"
                afterSignUpUrl="/welcome?role=teacher"
              >
                <Button
                  size="lg"
                  className="w-full text-sm sm:text-base font-black bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-x-2.5 h-13 rounded-2xl shadow-sm tracking-normal cursor-pointer"
                >
                  <GraduationCap className="h-5 w-5 text-amber-300 shrink-0" />
                  <span>Set Up Classroom Team (Free)</span>
                </Button>
              </SignUpButton>

              <SignInButton
                mode="modal"
                afterSignInUrl="/admin"
                afterSignUpUrl="/welcome?role=teacher"
              >
                <Button
                  size="lg"
                  variant="default"
                  className="w-full text-sm sm:text-base font-black bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-300 hover:border-slate-400 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-x-2.5 h-13 rounded-2xl shadow-sm tracking-normal cursor-pointer"
                >
                  <KeyRound className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Teacher Sign In</span>
                </Button>
              </SignInButton>
            </div>
          )}

          {/* Guarantee Pill Floor */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-semibold pt-1 border-t border-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>100% Free • COPPA Compliant • No Credit Card</span>
          </div>
        </div>
      </SignedOut>

      {/* Signed In Experience */}
      <SignedIn>
        <div className="w-full bg-white p-5 rounded-3xl border-2 border-slate-300 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <span className="text-base font-black text-slate-900">
              Welcome back! Ready to continue?
            </span>
          </div>

          <Button
            size="lg"
            className="w-full text-base font-black h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-0.5 shadow-sm flex items-center justify-center gap-x-2.5 tracking-normal cursor-pointer"
            asChild
          >
            <Link href={isParent ? "/admin" : "/learn"}>
              <span>{isParent ? "Open Parent & Educator Center" : "Continue Learning"}</span>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </Link>
          </Button>
        </div>
      </SignedIn>
    </div>
  );
};
