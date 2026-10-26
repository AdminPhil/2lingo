import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { podMembers, pods, userProgress } from "@/db/schema";
import { isAdmin, isSuperAdmin } from "@/lib/admin";
import { evaluateDailyHeartRefill } from "@/lib/heart-refill";
import { generateRandomPodCode } from "@/lib/pod-code";
import { Button } from "@/components/ui/button";
import { AdminCommandCenter } from "@/components/admin/admin-command-center";
import { getTrickyWordsAnalytics } from "@/db/queries";

type Props = {
  searchParams?: {
    podId?: string;
  };
};

const AdminPage = async ({ searchParams }: Props) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const adminAllowed = await isAdmin();
  if (!adminAllowed) {
    redirect("/learn?intent=parent");
  }

  const superAdmin = await isSuperAdmin();
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

  // If regular parent has no team yet, auto-provision their Family Team
  if (!superAdmin && userId) {
    const existingOwnedPod = await db.query.pods.findFirst({
      where: (pods, { eq }) => eq(pods.ownerId, userId),
    });
    if (!existingOwnedPod) {
      const parentFirstName = user?.firstName || user?.username || "Family";
      const [createdPod] = await db
        .insert(pods)
        .values({
          name: `${parentFirstName}'s Family Team`,
          type: "family",
          inviteCode: generateRandomPodCode(),
          ownerId: userId,
          targetXp: 1000,
          currentXp: 0,
          celebrationUnlocked: false,
          weekNumber: 1,
        })
        .returning();

      if (createdPod) {
        await db.insert(podMembers).values({
          podId: createdPod.id,
          userId,
          role: "owner",
        });
      }
    }
  }

  // Fetch all teams/pods with members
  const allPodsData = await db.query.pods.findMany({
    with: {
      members: true,
    },
    orderBy: (pods, { asc }) => [asc(pods.id)],
  });

  // Scope teams based on role:
  // Super-admin sees all teams (with Team 1 as default active); regular parent/teacher sees owned teams
  const accessiblePods = superAdmin
    ? allPodsData
    : allPodsData.filter((p) => p.ownerId === userId);

  const isGlobalView = superAdmin && searchParams?.podId === "all";
  const requestedPodId =
    searchParams?.podId && !isGlobalView ? Number(searchParams.podId) : null;
  const activePod =
    (requestedPodId
      ? accessiblePods.find((p) => p.id === requestedPodId)
      : null) ||
    (superAdmin
      ? accessiblePods.find((p) => p.id === 1) || accessiblePods[0] || allPodsData[0]
      : accessiblePods[0]);

  const allLearners = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
  });

  // Ensure daily overnight heart top-up is reflected across all learners in the Parent Center roster
  const todayStr = new Date().toISOString().split("T")[0];
  for (const learner of allLearners) {
    const refillEval = evaluateDailyHeartRefill(
      learner.hearts,
      learner.lastHeartRefillDate,
      todayStr
    );
    if (refillEval.shouldUpdate) {
      await db
        .update(userProgress)
        .set({
          hearts: refillEval.hearts,
          lastHeartRefillDate: refillEval.lastHeartRefillDate,
        })
        .where(eq(userProgress.userId, learner.userId));
      learner.hearts = refillEval.hearts;
      learner.lastHeartRefillDate = refillEval.lastHeartRefillDate;
    }
  }

  // Scope learners to the currently selected active team (or all accessible teams if Super-Admin on default view without explicit filter)
  const activePodMemberIds = new Set(
    activePod ? activePod.members.map((m) => m.userId) : []
  );
  const accessibleMemberUserIds = new Set(
    accessiblePods.flatMap((p) => p.members.map((m) => m.userId))
  );

  // CR-074: Roster is always strictly scoped to the highlighted team,
  // unless a Super-Admin explicitly selects the "All Platform" view (?podId=all).
  const learners = isGlobalView
    ? allLearners
    : activePod
    ? allLearners.filter((l) => activePodMemberIds.has(l.userId))
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

  const analyticsUserIds =
    isGlobalView ? undefined : learners.map((l) => l.userId);
  const analyticsData = await getTrickyWordsAnalytics(analyticsUserIds);

  const podName = activePod?.name || "Family Team";
  const podType = activePod?.type || "family";
  const inviteCode = activePod?.inviteCode || "ZGOMBA";
  const currentXp = activePod?.currentXp ?? 0;
  const targetXp = activePod?.targetXp ?? 1000;
  const progressPercent = Math.min(Math.round((currentXp / targetXp) * 100), 100);
  const parentName = user?.firstName || (superAdmin ? "Phil" : "Parent");
  const activeStreakCount = learners.filter((l) => l.streak > 0 || l.points > 0).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Sticky Top Navigation Bar with SVG Croatian Šahovnica Crest & Ribbon */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-x-3">
            {/* Crisp SVG Croatian Šahovnica Shield Crest (Zero Windows "HR" emoji fallback) */}
            <div className="h-10 w-10 rounded-xl bg-blue-900 flex items-center justify-center shadow-xs shrink-0 border border-blue-950">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="rounded-xs overflow-hidden"
                aria-label="Hrvatska Šahovnica"
              >
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
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-blue-900 tracking-tight hidden sm:inline">
                  CroLingo
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <h1 className="font-extrabold text-base sm:text-lg text-neutral-800 leading-tight">
                  Parent & Educator Center
                </h1>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Croatian Family & Classroom Team Oversight
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="font-extrabold text-neutral-700 hover:text-blue-900 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl"
          >
            <Link href="/learn">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Learning Path
            </Link>
          </Button>
        </div>

        {/* Symmetrical 2-Row Croatian Checkerboard Ribbon (Šahovnica) */}
        <div className="w-full border-t border-slate-200 bg-white">
          <div
            className="h-2 w-full bg-[length:16px_8px] bg-repeat-x"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8' shape-rendering='crispEdges'%3E%3Crect width='16' height='8' fill='%23FFFFFF'/%3E%3Crect x='0' y='0' width='4' height='4' fill='%23DC2626'/%3E%3Crect x='8' y='0' width='4' height='4' fill='%23DC2626'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23DC2626'/%3E%3Crect x='12' y='4' width='4' height='4' fill='%23DC2626'/%3E%3C/svg%3E")`,
            }}
            title="Hrvatska Šahovnica"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <AdminCommandCenter
          parentName={parentName}
          superAdmin={superAdmin}
          activePodId={activePod?.id || 1}
          isGlobalView={isGlobalView}
          podName={podName}
          podType={podType}
          inviteCode={inviteCode}
          currentXp={currentXp}
          targetXp={targetXp}
          progressPercent={progressPercent}
          activeStreakCount={activeStreakCount}
          formattedPods={formattedPods}
          learners={learners}
          availableUsers={allLearners.map((l) => ({
            userId: l.userId,
            userName: l.userName,
            userImageSrc: l.userImageSrc,
          }))}
          analyticsData={analyticsData}
        />
      </main>
    </div>
  );
};

export default AdminPage;
