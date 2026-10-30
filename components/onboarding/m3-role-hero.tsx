"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  KeyRound, 
  Sparkles, 
  ArrowRight, 
  Users, 
  GraduationCap, 
  ShieldCheck,
  Ticket,
  ChevronDown
} from "lucide-react";
import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut 
} from "@clerk/nextjs";

type Props = {
  isParent?: boolean;
  initialJoinCode?: string;
  initialTeamName?: string;
};

export const M3RoleHero = ({
  isParent = false,
  initialJoinCode = "",
  initialTeamName = "",
}: Props) => {
  const [selectedRole, setSelectedRole] = useState<"learner" | "parent" | "teacher">("learner");
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
            <button
              type="button"
              onClick={clearCode}
              className="text-emerald-700 hover:text-emerald-950 font-black text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Google Material 3 Segmented Button (Role Selector) */}
        <div 
          role="radiogroup" 
          aria-label="Select learner persona"
          className="w-full bg-[#EEF2F8] p-1.5 rounded-full border border-slate-300/80 flex items-center gap-1 shadow-2xs"
        >
          <button
            type="button"
            role="radio"
            aria-checked={selectedRole === "learner"}
            onClick={() => setSelectedRole("learner")}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === "learner"
                ? "bg-white text-blue-950 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🎒</span>
            <span className="hidden sm:inline">I&apos;m a</span>
            <span>Learner</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={selectedRole === "parent"}
            onClick={() => setSelectedRole("parent")}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === "parent"
                ? "bg-white text-blue-950 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>👨‍👩‍👧</span>
            <span className="hidden sm:inline">I&apos;m a</span>
            <span>Parent</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={selectedRole === "teacher"}
            onClick={() => setSelectedRole("teacher")}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === "teacher"
                ? "bg-white text-blue-950 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🏫</span>
            <span className="hidden sm:inline">I&apos;m a</span>
            <span>Teacher</span>
          </button>
        </div>

        {/* Lightweight 1-line Role Micro-Context (replaces bulky internal card header) */}
        <div className="w-full text-center lg:text-left px-1">
          {selectedRole === "learner" && (
            <p className="text-xs text-slate-500 font-semibold">
              Bite-sized Croatian lessons, daily streaks, and pod challenges for all ages.
            </p>
          )}
          {selectedRole === "parent" && (
            <p className="text-xs text-slate-500 font-semibold">
              Set up a family team in 2 minutes. Add children with zero emails and print QR badges.
            </p>
          )}
          {selectedRole === "teacher" && (
            <p className="text-xs text-slate-500 font-semibold">
              Paste class rosters, print lanyard passes, and project smartboard join slides.
            </p>
          )}
        </div>

        {/* Clean, Decluttered Material 3 Action Card (Focused on 1 Primary Task) */}
        <div className="w-full bg-white p-5 sm:p-6 rounded-[28px] border border-slate-200 shadow-sm flex flex-col gap-3">
          
          {/* 1. Primary Action CTA */}
          {selectedRole === "learner" && (
            <SignUpButton
              mode="modal"
              afterSignInUrl={learnerSignInUrl}
              afterSignUpUrl={learnerSignUpUrl}
            >
              <button
                type="button"
                className="w-full h-13 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <Sparkles className="h-5 w-5 text-amber-300 shrink-0" />
                <span>Start Learning (Free)</span>
              </button>
            </SignUpButton>
          )}

          {selectedRole === "parent" && (
            <SignUpButton
              mode="modal"
              afterSignInUrl="/welcome?role=parent"
              afterSignUpUrl="/welcome?role=parent"
            >
              <button
                type="button"
                className="w-full h-13 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <Users className="h-5 w-5 text-amber-300 shrink-0" />
                <span>Set Up Family Team</span>
              </button>
            </SignUpButton>
          )}

          {selectedRole === "teacher" && (
            <SignUpButton
              mode="modal"
              afterSignInUrl="/welcome?role=teacher"
              afterSignUpUrl="/welcome?role=teacher"
            >
              <button
                type="button"
                className="w-full h-13 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <GraduationCap className="h-5 w-5 text-amber-300 shrink-0" />
                <span>Set Up Classroom Team</span>
              </button>
            </SignUpButton>
          )}

          {/* 2. Sleek Secondary Action (Already have an account? Sign In) */}
          <SignInButton
            mode="modal"
            afterSignInUrl={
              selectedRole === "learner" 
                ? learnerSignInUrl 
                : "/admin"
            }
            afterSignUpUrl={
              selectedRole === "learner" 
                ? learnerSignUpUrl 
                : `/welcome?role=${selectedRole}`
            }
          >
            <button
              type="button"
              className="w-full h-10 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Already have an account?</span>
              <span className="font-extrabold text-blue-700 underline underline-offset-2">Log in</span>
            </button>
          </SignInButton>

          {/* 3. Progressive Disclosure for Team Join Code (Learner Mode Only) */}
          {selectedRole === "learner" && (
            <div className="pt-2">
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
                <form onSubmit={handleApplyCode} className="flex items-center gap-2 pt-1 animate-in fade-in">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      maxLength={10}
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE E.G. HRVAT3"
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-full font-mono font-bold text-xs uppercase tracking-wider text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-8 px-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black tracking-wide transition shadow-xs cursor-pointer"
                  >
                    Join
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(false)}
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center justify-center"
                    title="Hide code input"
                  >
                    ✕
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 4. Minimal Trust Guarantee */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>100% Free • COPPA Compliant • No Ads</span>
          </div>

        </div>
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
            className="w-full h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>{isParent ? "Open Parent & Educator Center" : "Continue Learning"}</span>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </Link>
        </div>
      </SignedIn>
    </div>
  );
};
