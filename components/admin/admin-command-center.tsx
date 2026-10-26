"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Sparkles,
  Trophy,
  Wand2,
  Brain,
  Crown,
  Copy,
  Check,
  UserPlus,
  GraduationCap,
  Settings,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PodManagementCard } from "@/components/admin/pod-management-card";
import { LearnerHealthCard } from "@/components/admin/learner-health-card";
import { TrickyWordsCard } from "@/components/admin/tricky-words-card";
import { HowToAddChildrenCard } from "@/components/admin/how-to-add-children-card";
import { AddChildModal } from "@/components/admin/add-child-modal";
import { ParentSetupWizardModal } from "@/components/admin/parent-setup-wizard-modal";
import { TeacherSetupWizardModal } from "@/components/admin/teacher-setup-wizard-modal";
import { JoinSlideModal } from "@/components/admin/join-slide-modal";
import { ADMIN_BTN_PRIMARY, ADMIN_BTN_SECONDARY } from "@/components/admin/admin-button-styles";
import type { TrickyWordsAnalytics } from "@/db/queries";

type FormattedPod = {
  id: number;
  name: string;
  type: string;
  inviteCode: string;
  targetXp: number | null;
  currentXp: number;
  celebrationUnlocked: boolean;
  memberCount: number;
  members: {
    userId: string;
    userName: string;
    role: string;
  }[];
};

type LearnerData = {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
  hearts: number;
  heartsUsed: number;
  streak: number;
  lastActiveDate: string | null;
};

type Props = {
  parentName: string;
  superAdmin: boolean;
  activePodId: number;
  isGlobalView?: boolean;
  podName: string;
  podType: string;
  inviteCode: string;
  currentXp: number;
  targetXp: number;
  progressPercent: number;
  activeStreakCount: number;
  formattedPods: FormattedPod[];
  learners: LearnerData[];
  availableUsers: {
    userId: string;
    userName: string;
    userImageSrc: string;
  }[];
  analyticsData: TrickyWordsAnalytics;
};

export const AdminCommandCenter = ({
  parentName,
  superAdmin,
  activePodId,
  isGlobalView = false,
  podName,
  podType,
  inviteCode,
  currentXp,
  targetXp,
  progressPercent,
  activeStreakCount,
  formattedPods,
  learners,
  availableUsers,
  analyticsData,
}: Props) => {
  const [activeTab, setActiveTab] = useState<"learners" | "analytics" | "teams">("learners");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("https://twolingo.onrender.com");

  // Quick Launch Modals inside Tab 1 Toolbar
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isFamilyWizardOpen, setIsFamilyWizardOpen] = useState(false);
  const [isClassroomWizardOpen, setIsClassroomWizardOpen] = useState(false);
  const [isJoinSlideOpen, setIsJoinSlideOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const isClassroom = podType === "classroom";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    toast.success(`Copied Team Code "${inviteCode}"!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInviteLink = () => {
    const link = `${origin}/?join=${encodeURIComponent(inviteCode)}`;
    navigator.clipboard.writeText(`Join our CroLingo team with code: ${inviteCode}\n${link}`);
    setCopiedLink(true);
    toast.success("Copied Team Invite Link to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      {/* =================================================================== */}
      {/* DUAL-ROLE TEAM SWITCHER BAR (Shown when user manages > 1 Team!)     */}
      {/* =================================================================== */}
      {(formattedPods.length > 1 || superAdmin) && (
        <div className="mb-5 bg-white p-2.5 rounded-2xl border-2 border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 px-2">
              Your Teams ({formattedPods.length}):
            </span>

            {formattedPods.map((pod) => {
              const isSelected = !isGlobalView && pod.id === activePodId;
              const isPodClassroom = pod.type === "classroom";
              return (
                <Link
                  key={pod.id}
                  href={`/admin?podId=${pod.id}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                    isSelected
                      ? "bg-blue-900 text-white border-2 border-blue-900 shadow-xs"
                      : "bg-white text-slate-700 border-2 border-slate-400 hover:border-blue-900 hover:bg-blue-50"
                  }`}
                >
                  <span>{isPodClassroom ? "🏫" : "🏠"}</span>
                  <span>{pod.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : isPodClassroom
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                        : "bg-blue-100 text-blue-800 border border-blue-300"
                    }`}
                  >
                    {isPodClassroom ? "Classroom Team" : "Family Team"} • {pod.memberCount}
                  </span>
                </Link>
              );
            })}

            {superAdmin && (
              <Link
                href="/admin?podId=all"
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 border-2 ${
                  isGlobalView
                    ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-400 hover:border-blue-900 hover:bg-blue-50"
                }`}
                title="Super-Admin: every learner on the platform"
              >
                <span>??</span>
                <span>All Platform</span>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("teams")}
            className="text-xs font-extrabold text-blue-900 hover:bg-blue-50 border-2 border-slate-400 rounded-xl h-9 px-3 self-end sm:self-auto cursor-pointer"
          >
            + Manage Teams
          </Button>
        </div>
      )}

      {/* =================================================================== */}
      {/* HERITAGE NAVY HERO + INTEGRATED 3-KPI STRIP                         */}
      {/* =================================================================== */}
      <div className="bg-blue-900 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-md mb-6 border border-blue-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/15">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-4 border-white/80 bg-white shadow-md shrink-0">
              <Image
                src="/mascot.png"
                fill
                sizes="80px"
                alt="Paško the Dalmatian"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 bg-blue-700/80 border border-blue-400/30 rounded-full text-blue-100">
                  {isClassroom
                    ? "🏫 Classroom Team Mode (Max 50)"
                    : "🏠 Family Team Mode (Max 15)"}
                </span>
                {superAdmin && (
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 bg-amber-400 text-amber-950 rounded-full inline-flex items-center gap-x-1 shadow-xs">
                    <Crown className="h-3.5 w-3.5 fill-amber-950" />
                    Super-Admin (philip.zgomba@gmail.com)
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Dobrodošli, {parentName}!
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-0.5 max-w-xl">
                Viewing <strong className="text-white underline decoration-amber-400 underline-offset-4">{isGlobalView ? "All Platform Learners" : podName}</strong> — monitor daily streaks, manage weekly team celebration goals, and support your learners.
              </p>
            </div>
          </div>

          {/* Consolidated 1-Click Copy Team Join Code Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 px-4 border border-white/20 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div>
              <span className="text-xs font-bold text-blue-200 block">
                {isClassroom ? "Classroom Team Code" : "Family Team Code"}
              </span>
              <span className="font-mono text-2xl font-black tracking-widest text-amber-300">
                {inviteCode}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border-b-2 border-blue-800 font-black text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-amber-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3 w-3 text-amber-300" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <span>Copy Invite Link</span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsJoinSlideOpen(true)}
              className="px-3.5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 border-b-2 border-amber-600 font-black text-xs cursor-pointer shadow-xs flex flex-col items-center justify-center gap-0.5"
              title="Show a big QR code and join instructions for a projector or tablet"
            >
              <span className="text-sm">📺 Join Slide</span>
              <span className="text-xs font-bold opacity-80">Big QR + Code</span>
            </button>
          </div>
        </div>

        {/* Integrated 3-KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-800/80 border border-blue-400/20 flex items-center justify-center text-white shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200 uppercase">
                {isClassroom ? "Class Team Roster" : "Family Team Roster"}
              </p>
              <p className="text-base font-black text-white">
                {learners.length} Active {learners.length === 1 ? "Learner" : "Learners"}
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-800/80 border border-blue-400/20 flex items-center justify-center text-amber-300 shrink-0">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-blue-200 uppercase">Weekly Team Goal</p>
                <span className="text-xs font-black text-amber-300">{progressPercent}%</span>
              </div>
              <p className="text-base font-black text-white">
                {currentXp.toLocaleString()}{" "}
                <span className="text-xs text-blue-200 font-normal">
                  / {targetXp.toLocaleString()} XP
                </span>
              </p>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-800/80 border border-blue-400/20 flex items-center justify-center text-amber-300 shrink-0">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200 uppercase">Team Momentum</p>
              <p className="text-base font-black text-white">
                {activeStreakCount > 0 ? "Streak Active 🔥" : "Ready to Start 🌱"}
              </p>
              <p className="text-xs text-blue-100 font-semibold">
                {learners.length === 0
                  ? "Add learners to start tracking"
                  : activeStreakCount === learners.length
                  ? `All ${learners.length} ${learners.length === 1 ? "Learner" : "Learners"} Practicing`
                  : `${activeStreakCount} of ${learners.length} ${learners.length === 1 ? "Learner" : "Learners"} Practicing`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* INTERACTIVE 3-TAB WORKSPACE BAR (Replaces Dead Preview Cards)       */}
      {/* =================================================================== */}
      <div className="bg-white p-1.5 rounded-2xl border-2 border-slate-200 shadow-xs mb-6 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab("learners")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "learners"
              ? "bg-blue-600 text-white border-b-4 border-blue-800 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Wand2 className="h-4 w-4" />
          <span>{isClassroom ? "Student Roster & Overrides" : "Team Roster & Magic Wand"}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "learners"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {learners.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "analytics"
              ? "bg-blue-600 text-white border-b-4 border-blue-800 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Brain className="h-4 w-4" />
          <span>Tricky Words & Prompts</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "analytics"
                ? "bg-white/20 text-white"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            {analyticsData.overallAccuracyRate}% Accuracy
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("teams")}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "teams"
              ? "bg-blue-600 text-white border-b-4 border-blue-800 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Team Settings & Setup Guide</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: TEAM ROSTER & MAGIC WAND (ABOVE THE FOLD BY DEFAULT!)        */}
      {/* =================================================================== */}
      {activeTab === "learners" && (
        <div className="space-y-6">
          {/* Adaptive First-Time Setup Guide: Only expanded automatically when 0 learners */}
          {learners.length === 0 && (
            <HowToAddChildrenCard
              podId={activePodId}
              podName={podName}
              inviteCode={inviteCode}
            />
          )}

          <LearnerHealthCard
            learners={learners}
            teamName={isGlobalView ? "All Platform" : podName}
            podId={isGlobalView ? undefined : activePodId}
            headerActions={
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => setIsAddChildOpen(true)}
                  className={ADMIN_BTN_PRIMARY}
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Add Learner
                </Button>
                {!isClassroom && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => setIsFamilyWizardOpen(true)}
                  className={ADMIN_BTN_SECONDARY}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  Family Wizard
                </Button>
                )}
                {isClassroom && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => setIsClassroomWizardOpen(true)}
                  className={ADMIN_BTN_SECONDARY}
                >
                  <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-blue-700" />
                  Classroom Wizard
                </Button>
                )}
              </>
            }
          />
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: TRICKY WORDS, 20-UNIT HEATMAP & TEAM CONVERSATION PROMPTS    */}
      {/* =================================================================== */}
      {activeTab === "analytics" && (
        <TrickyWordsCard analytics={analyticsData} />
      )}

      {/* =================================================================== */}
      {/* TAB 3: TEAM SETTINGS, WIZARDS & DEVICE SETUP GUIDE                  */}
      {/* =================================================================== */}
      {activeTab === "teams" && (
        <div className="space-y-6">
          <PodManagementCard
            pods={formattedPods}
            availableUsers={availableUsers}
            isSuperAdmin={superAdmin}
          />

          <HowToAddChildrenCard
            podId={activePodId}
            podName={podName}
            inviteCode={inviteCode}
          />
        </div>
      )}

      {/* Quick-Action Modals */}
      <JoinSlideModal
        isOpen={isJoinSlideOpen}
        onOpenChange={setIsJoinSlideOpen}
        podName={podName}
        inviteCode={inviteCode}
      />

      <AddChildModal
        isOpen={isAddChildOpen}
        onOpenChange={setIsAddChildOpen}
        podId={activePodId}
        podName={podName}
      />

      <ParentSetupWizardModal
        isOpen={isFamilyWizardOpen}
        onOpenChange={setIsFamilyWizardOpen}
        podId={activePodId}
        podName={podName}
        inviteCode={inviteCode}
      />

      <TeacherSetupWizardModal
        isOpen={isClassroomWizardOpen}
        onOpenChange={setIsClassroomWizardOpen}
        podId={activePodId}
        podName={podName}
        inviteCode={inviteCode}
      />
    </>
  );
};
