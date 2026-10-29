import Image from "next/image";
import { Loader, ShieldCheck, Users, QrCode, Sparkles } from "lucide-react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { pods } from "@/db/schema";
import { getUserProgress } from "@/db/queries";
import { RoleOnboardingHero } from "@/components/onboarding/role-onboarding-hero";

type Props = {
  searchParams?: {
    join?: string;
    code?: string;
  };
};

export default async function Home({ searchParams }: Props) {
  const userProgress = await getUserProgress();
  const isParent = userProgress?.role === "parent";

  const rawJoin = searchParams?.join || searchParams?.code || "";
  const joinCode = typeof rawJoin === "string" ? rawJoin.trim().toUpperCase() : "";

  let teamName = "";
  if (joinCode) {
    try {
      const targetPod = await db.query.pods.findFirst({
        where: eq(pods.inviteCode, joinCode),
        columns: { name: true },
      });
      if (targetPod) {
        teamName = targetPod.name;
      }
    } catch {
      // Graceful fallback
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      {/* Hero Section */}
      <div className="max-w-[1120px] mx-auto w-full flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 gap-8 lg:gap-14">
        {/* High-Resolution Croatian Hero Artwork (Paško the Dalmatian) */}
        <div className="relative w-[300px] h-[270px] sm:w-[420px] sm:h-[370px] lg:w-[460px] lg:h-[420px] shrink-0 drop-shadow-sm flex items-center justify-center">
          <Image
            src="/pasko-hero.jpg"
            width={500}
            height={450}
            alt="Paško the Dalmatian Pup learning Croatian with CroLingo"
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Hero Content & Role-Aware Onboarding Selector */}
        <div className="flex flex-col items-center lg:items-start gap-y-5 text-center lg:text-left max-w-[500px] w-full">
          {/* Cultural Heritage Pill Badge */}
          <div className="inline-flex items-center gap-x-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/90 rounded-full shadow-2xs">
            <svg width="14" height="14" viewBox="0 0 20 20" className="rounded-[3px] overflow-hidden border border-red-300 shrink-0" aria-hidden="true">
              <rect width="20" height="20" fill="#FFFFFF" />
              <rect x="0" y="0" width="5" height="5" fill="#DC2626" />
              <rect x="10" y="0" width="5" height="5" fill="#DC2626" />
              <rect x="5" y="5" width="5" height="5" fill="#DC2626" />
              <rect x="15" y="5" width="5" height="5" fill="#DC2626" />
              <rect x="0" y="10" width="5" height="5" fill="#DC2626" />
              <rect x="10" y="10" width="5" height="5" fill="#DC2626" />
              <rect x="5" y="15" width="5" height="5" fill="#DC2626" />
              <rect x="15" y="15" width="5" height="5" fill="#DC2626" />
            </svg>
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 leading-none">
              100% Focused on Croatian
            </span>
          </div>

          {/* Playful Bold Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-800 tracking-tight leading-tight">
              <span className="text-blue-900">Bok!</span> Who&apos;s learning Croatian today?
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-[440px]">
              Short, playful lessons for kids, families, and classrooms. Free to start with zero ads.
            </p>
          </div>

          {/* Interactive Role-Aware Action Gate */}
          <div className="w-full">
            <ClerkLoading>
              <div className="h-36 flex items-center justify-center w-full">
                <Loader className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            </ClerkLoading>

            <ClerkLoaded>
              <RoleOnboardingHero
                isParent={isParent}
                initialJoinCode={joinCode}
                initialTeamName={teamName}
              />
            </ClerkLoaded>
          </div>
        </div>
      </div>

      {/* 3-Step Educator & Parent Value Illustration Strip */}
      <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/90 border-2 border-slate-300/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full">
              Quick Setup Guide
            </span>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              How setup works for parents & educators
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200/90 shadow-2xs flex flex-col gap-1.5">
              <div className="text-2xl">1️⃣</div>
              <div className="text-sm font-black text-slate-900">Free Adult Account</div>
              <div className="text-xs text-slate-600 font-semibold leading-relaxed">
                Register as a parent or teacher in seconds. No credit card required.
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200/90 shadow-2xs flex flex-col gap-1.5">
              <div className="text-2xl">2️⃣</div>
              <div className="text-sm font-black text-slate-900">Zero Child Emails</div>
              <div className="text-xs text-slate-600 font-semibold leading-relaxed">
                Add children or paste a classroom roster. Learners never share emails or passwords.
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200/90 shadow-2xs flex flex-col gap-1.5">
              <div className="text-2xl">3️⃣</div>
              <div className="text-sm font-black text-slate-900">1-Tap Student Passes</div>
              <div className="text-xs text-slate-600 font-semibold leading-relaxed">
                Print QR badges or project smartboard join slides. One camera scan logs learners in!
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-semibold text-center sm:text-left mt-3.5">
            Free for diaspora families & heritage schools • COPPA & child-safety compliant • Protected learning sanctuary
          </p>
        </div>
      </div>
    </div>
  );
}
