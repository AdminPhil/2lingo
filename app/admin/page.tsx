import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Users, 
  Sparkles, 
  Flame, 
  ArrowLeft, 
  Heart, 
  Trophy, 
  Wand2, 
  Brain,
  ShieldCheck
} from "lucide-react";

import db from "@/db/drizzle";
import { pods, userProgress } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PodManagementCard } from "@/components/admin/pod-management-card";
import { LearnerHealthCard } from "@/components/admin/learner-health-card";

const AdminPage = async () => {
  if (!isAdmin()) {
    redirect("/learn");
  }

  // Fetch active pod (Zgomba Family)
  const activePod = await db.query.pods.findFirst({
    where: (pods, { eq }) => eq(pods.id, 1),
  });

  // Fetch all young learners
  const learners = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
  });

  const allPodsData = await db.query.pods.findMany({
    with: {
      members: true,
    },
    orderBy: (pods, { asc }) => [asc(pods.id)],
  });

  const learnersMap = new Map(learners.map((l) => [l.userId, l.userName]));

  const formattedPods = allPodsData.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    inviteCode: p.inviteCode,
    targetXp: p.targetXp,
    currentXp: p.currentXp,
    celebrationUnlocked: p.celebrationUnlocked,
    memberCount: p.members.length,
    members: p.members.map((m) => ({
      userId: m.userId,
      userName: learnersMap.get(m.userId) || "Learner",
      role: m.role,
    })),
  }));

  const podName = activePod?.name || "Zgomba Family";
  const inviteCode = activePod?.inviteCode || "ZGOMBA";
  const currentXp = activePod?.currentXp ?? 740;
  const targetXp = activePod?.targetXp ?? 1000;
  const progressPercent = Math.min(Math.round((currentXp / targetXp) * 100), 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="p-2 bg-green-100 rounded-xl text-green-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-neutral-800 leading-tight">
                Parent & Educator Center
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                2lingo Croatian Family Oversight
              </p>
            </div>
          </div>

          <Button variant="ghost" size="sm" asChild className="font-bold text-neutral-600 hover:text-neutral-900 border border-slate-200">
            <Link href="/learn">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Croatian Map
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-green-600 to-lime-600 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 bg-white/20 rounded-full text-white inline-block mb-2">
              Family Learning Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Dobrodošli, Phil! 🇭🇷
            </h2>
            <p className="text-sm text-green-50 mt-1 max-w-xl">
              Monitor Adriana, Vanessa, and Silvia&apos;s daily learning streaks, adjust family pod goals, and keep the enthusiasm burning high!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
            <p className="text-xs font-semibold text-green-100">Active Family Code</p>
            <p className="font-mono text-2xl font-black tracking-widest text-white mt-0.5">
              {inviteCode}
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Pod */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="p-3.5 bg-blue-100 rounded-2xl text-blue-700">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Active Pod</p>
              <h3 className="text-lg font-black text-neutral-800">{podName}</h3>
              <p className="text-xs text-blue-600 font-semibold">{learners.length} Active Learners</p>
            </div>
          </div>

          {/* Card 2: Team Goal */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="p-3.5 bg-amber-100 rounded-2xl text-amber-700">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-muted-foreground uppercase">Weekly Team Goal</p>
                <span className="text-xs font-black text-amber-600">{progressPercent}%</span>
              </div>
              <h3 className="text-lg font-black text-neutral-800">
                {currentXp} <span className="text-xs text-muted-foreground font-normal">/ {targetXp} XP</span>
              </h3>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Card 3: Motivation */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/80 shadow-xs flex items-center gap-x-4">
            <div className="p-3.5 bg-rose-100 rounded-2xl text-rose-700">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Family Habit Status</p>
              <h3 className="text-lg font-black text-neutral-800">Streak Active 🔥</h3>
              <p className="text-xs text-rose-600 font-semibold">All 3 Sisters Practicing</p>
            </div>
          </div>
        </div>

        {/* Action Hub Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-green-400 transition shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-x-2 text-green-700 font-extrabold text-base mb-1.5">
                <Users className="h-5 w-5" />
                <span>Family Pods Hub</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Manage learning pods, set custom codes like <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">ZGOMBA</code>, and adjust weekly celebration goals.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-green-700 font-bold">
              ✓ Ready for CR-010 Controls
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-amber-400 transition shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-x-2 text-amber-700 font-extrabold text-base mb-1.5">
                <Wand2 className="h-5 w-5" />
                <span>Parent Magic Wand</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                One-click heart refills, streak protection grace days, and real-life dinner accomplishment XP praise.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-amber-700 font-bold">
              ✓ Active Magic Wand Overrides
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-purple-400 transition shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-x-2 text-purple-700 font-extrabold text-base mb-1.5">
                <Brain className="h-5 w-5" />
                <span>Tricky Words Analytics</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                See which words the girls miss most across Units 1–20 and get conversation prompts for family dinners.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-purple-700 font-bold">
              ✓ Ready for CR-012 Controls
            </div>
          </div>
        </div>

        {/* Pod Management Hub (CR-010) */}
        <PodManagementCard pods={formattedPods} />

        {/* Learner Health & Magic Wand Overrides (CR-011) */}
        <LearnerHealthCard learners={learners} />
      </main>
    </div>
  );
};

export default AdminPage;
