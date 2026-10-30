import Image from "next/image";
import { Loader, ShieldCheck, Users, QrCode, Sparkles, Tv, Heart } from "lucide-react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { pods } from "@/db/schema";
import { getUserProgress } from "@/db/queries";
import { M3RoleHero } from "@/components/onboarding/m3-role-hero";

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
        
        {/* Authentic Croatian Hero Artwork (Paško the Dalmatian) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[460px] rounded-[32px] bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-rose-50/20 border border-slate-200/80 p-6 flex flex-col items-center justify-center shadow-xs">
            
            {/* Ambient Tonal Glow Layers */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />

            {/* Paško Hero Image (Authentic file from public/pasko-hero.jpg) */}
            <div className="relative w-full h-[280px] sm:h-[340px] flex items-center justify-center">
              <Image
                src="/pasko-hero.jpg"
                fill
                alt="Paško the Dalmatian Pup learning Croatian with CroLingo"
                className="object-contain drop-shadow-sm select-none"
                priority
              />
            </div>

            {/* Clean Paško Caption (No overlapping corner badges) */}
            <div className="w-full max-w-sm mt-3 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-center gap-2 text-center">
              <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                Paško kaže:
              </span>
              <span className="text-xs font-bold text-slate-700">
                &ldquo;Idemo učiti hrvatski!&rdquo; (Let&apos;s learn Croatian!)
              </span>
            </div>
          </div>
        </div>

        {/* Hero Content & Role-Aware Action Module */}
        <div className="flex flex-col items-center lg:items-start gap-y-4 text-center lg:text-left max-w-[500px] w-full">
          {/* Croatian Cultural Heritage Assist Chip */}
          <div className="inline-flex items-center gap-x-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/90 rounded-full shadow-2xs">
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
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 leading-none">
              100% Focused on Croatian
            </span>
          </div>

          {/* Display Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              <span className="text-blue-900">Bok!</span> Who&apos;s learning Croatian today?
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-[440px]">
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
              <M3RoleHero
                isParent={isParent}
                initialJoinCode={joinCode}
                initialTeamName={teamName}
              />
            </ClerkLoaded>
          </div>
        </div>
      </div>

      {/* Responsive Bento Feature Grid */}
      <div className="max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-100/80 border border-blue-200 px-3.5 py-1.5 rounded-full">
              Why Families & Heritage Schools Love CroLingo
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Croatian language learning sanctuary
          </span>
        </div>

        {/* 4-Card Expressive Tonal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Bento Card 1: Zero Child Emails */}
          <div className="p-5 bg-[#EEF2F8] hover:bg-[#E2E8F0] transition-colors rounded-[24px] border border-slate-200 shadow-2xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Zero Child Emails</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Add children or paste a classroom roster. Young learners never share emails, passwords, or personal data.
              </p>
            </div>
            <div className="text-[11px] font-black text-blue-700 flex items-center gap-1">
              <span>COPPA Compliant</span>
              <span>✓</span>
            </div>
          </div>

          {/* Bento Card 2: 1-Tap QR Student Badges */}
          <div className="p-5 bg-rose-50/80 hover:bg-rose-100/60 transition-colors rounded-[24px] border border-rose-200 shadow-2xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">1-Tap Student Passes</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Print 8-up lanyard badges or desk passes. Students tap their camera once to log in with zero typing!
              </p>
            </div>
            <div className="text-[11px] font-black text-rose-700 flex items-center gap-1">
              <span>Print Kit Ready</span>
              <span>🖨️</span>
            </div>
          </div>

          {/* Bento Card 3: Smartboard Join Slides */}
          <div className="p-5 bg-amber-50/80 hover:bg-amber-100/60 transition-colors rounded-[24px] border border-amber-200 shadow-2xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Tv className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Smartboard Join Slides</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Project giant class codes on interactive whiteboards or iPad carts for fast, coordinated lesson starts.
              </p>
            </div>
            <div className="text-[11px] font-black text-amber-800 flex items-center gap-1">
              <span>Classroom Mode</span>
              <span>📺</span>
            </div>
          </div>

          {/* Bento Card 4: Encouraging Hearts & Streaks */}
          <div className="p-5 bg-emerald-50/80 hover:bg-emerald-100/60 transition-colors rounded-[24px] border border-emerald-200 shadow-2xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Encouraging Hearts</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Earn hearts through review quizzes, daily morning top-ups, and offline Croatian conversation praise awards.
              </p>
            </div>
            <div className="text-[11px] font-black text-emerald-800 flex items-center gap-1">
              <span>Pedagogy Standard</span>
              <span>✨</span>
            </div>
          </div>

        </div>

        <p className="text-xs text-slate-500 font-semibold text-center sm:text-left mt-4">
          Free for diaspora families & heritage language schools • Protected educational sanctuary • 25 Units across 5 Worlds
        </p>
      </div>
    </div>
  );
}
