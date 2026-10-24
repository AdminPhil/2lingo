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
  ShieldCheck,
  Crown
} from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { pods, userProgress } from "@/db/schema";
import { isAdmin, isSuperAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { PodManagementCard } from "@/components/admin/pod-management-card";
import { LearnerHealthCard } from "@/components/admin/learner-health-card";
import { TrickyWordsCard } from "@/components/admin/tricky-words-card";
import { HowToAddChildrenCard } from "@/components/admin/how-to-add-children-card";
import { getTrickyWordsAnalytics } from "@/db/queries";

const AdminPage = async () => {
  const adminAllowed = await isAdmin();
  if (!adminAllowed) {
    redirect("/learn");
  }

  const superAdmin = await isSuperAdmin();
  const { userId } = auth();
  const user = await currentUser();

  // If Super-Admin, ensure Pod 1 (Zgomba Family) ownerId is linked to this user
  if (superAdmin && userId) {
    const pod1 = await db.query.pods.findFirst({
      where: (pods, { eq }) => eq(pods.id, 1),
    });
    if (pod1 && pod1.ownerId !== userId) {
      await db.update(pods).set({ ownerId: userId }).where(eq(pods.id, 1));
    }
  }

  // Fetch all pods with members
  const allPodsData = await db.query.pods.findMany({
    with: {
      members: true,
    },
    orderBy: (pods, { asc }) => [asc(pods.id)],
  });

  // Scope pods based on role:
  // Super-admin sees all pods (with Pod 1 as default active); regular parent sees only owned pods
  const accessiblePods = superAdmin
    ? allPodsData
    : allPodsData.filter((p) => p.ownerId === userId);

  const activePod = superAdmin
    ? (accessiblePods.find((p) => p.id === 1) || accessiblePods[0] || allPodsData[0])
    : accessiblePods[0];

  // Fetch learners:
  // If superAdmin: all young learners
  // If regular parent: strictly learners in their accessible pods
  const allLearners = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
  });

  const accessibleMemberUserIds = new Set(
    accessiblePods.flatMap((p) => p.members.map((m) => m.userId))
  );

  const learners = superAdmin
    ? allLearners
    : allLearners.filter((l) => accessibleMemberUserIds.has(l.userId));

  const learnersMap = new Map(allLearners.map((l) => [l.userId, l.userName]));

  const formattedPods = accessiblePods.map((p) => ({
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

  const analyticsData = await getTrickyWordsAnalytics();

  const podName = activePod?.name || "Zgomba Family";
  const inviteCode = activePod?.inviteCode || "ZGOMBA";
  const currentXp = activePod?.currentXp ?? 740;
  const targetXp = activePod?.targetXp ?? 1000;
  const progressPercent = Math.min(Math.round((currentXp / targetXp) * 100), 100);
  const parentName = user?.firstName || (superAdmin ? "Phil" : "Parent");

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
        <div className="bg-green-600 bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-x-2 mb-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 bg-white/20 rounded-full text-white inline-block">
                Family Learning Hub
              </span>
              {superAdmin && (
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-amber-400 text-amber-950 rounded-full inline-flex items-center gap-x-1 shadow-xs">
                  <Crown className="h-3.5 w-3.5 fill-amber-950" />
                  Super-Admin (philip.zgomba@gmail.com)
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Dobrodošli, {parentName}! 🇭🇷
            </h2>
            <p className="text-sm text-green-50 mt-1 max-w-xl">
              {superAdmin 
                ? "Full administrative platform oversight. Monitor family pods, oversee learner streaks, and adjust celebration goals!"
                : "Monitor your children's daily learning streaks, adjust family celebration goals, and celebrate their Croatian progress!"}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-green-800 hover:bg-green-50 font-black text-xs h-9 px-3.5 rounded-xl shadow-xs"
                asChild
              >
                <Link href="/learn">
                  <Sparkles className="h-4 w-4 mr-1.5 text-green-700" />
                  View Learning Path
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
            <p className="text-xs font-semibold text-green-100">Active Family Code</p>
            <p className="font-mono text-2xl font-black tracking-widest text-white mt-0.5">
              {inviteCode}
            </p>
          </div>
        </div>

        {/* 👨‍👩‍👧 How to Add Your Children Helper & Direct Account Creation */}
        <HowToAddChildrenCard
          podId={activePod?.id || 1}
          podName={podName}
          inviteCode={inviteCode}
        />

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
              ✓ Active Pod Management
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
              ✓ Active Mistake Analytics & Heatmap
            </div>
          </div>
        </div>

        {/* Pod Management Hub (CR-010, CR-020) */}
        <PodManagementCard
          pods={formattedPods}
          availableUsers={allLearners.map((l) => ({
            userId: l.userId,
            userName: l.userName,
            userImageSrc: l.userImageSrc,
          }))}
          isSuperAdmin={superAdmin}
        />

        {/* Tricky Words & Mistake Heatmap Analytics (CR-012) */}
        <TrickyWordsCard analytics={analyticsData} />

        {/* Learner Health & Magic Wand Overrides (CR-011) */}
        <LearnerHealthCard learners={learners} />
      </main>
    </div>
  );
};

export default AdminPage;
