"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Tablet,
  Monitor,
  Download,
  FileSpreadsheet,
  Trophy,
  Loader2,
  Maximize2,
  Minimize2,
  Users,
} from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMultipleChildAccounts } from "@/actions/child-account";
import { updatePodSettings } from "@/actions/pod";
import {
  CLASSROOM_AVATARS,
  CLASSROOM_XP_TIERS,
  ClassroomRosterDraft,
  parseBulkClassroomRoster,
  formatClassroomRosterCsv,
  buildClassroomUsername,
  buildClassroomPassword,
} from "@/lib/classroom-roster";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  podId: number;
  podName: string;
  inviteCode: string;
};

type CreatedClassroomStudent = {
  id: string;
  name: string;
  username: string;
  password: string;
  userImageSrc: string;
  inviteCode: string;
  qrCodeUrl?: string;
};

const MAX_CLASSROOM_STUDENTS = 35;
const BATCH_CHUNK_SIZE = 5;

export const TeacherSetupWizardModal = ({
  isOpen,
  onOpenChange,
  podId,
  podName,
  inviteCode,
}: Props) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [pending, startTransition] = useTransition();

  // Step 1 State: Classroom Identity, Chalkboard Code & Weekly XP Goal
  const [classroomName, setClassroomName] = useState(
    podName && !podName.includes("Family") ? podName : "Subotnja Škola — Razred 3B"
  );
  const [customInviteCode, setCustomInviteCode] = useState(inviteCode || "HRVAT1");
  const [targetXp, setTargetXp] = useState<number>(5000);

  // Step 2 State: Bulk Paste & Editable Roster Table
  const [bulkPasteText, setBulkPasteText] = useState("");
  const [roster, setRoster] = useState<ClassroomRosterDraft[]>([
    {
      id: "student-1",
      name: "",
      username: "",
      password: "",
      avatar: CLASSROOM_AVATARS[0].src,
    },
  ]);
  const [provisioningProgress, setProvisioningProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);

  // Step 3 State: Provisioned Students & Print Kit Mode
  const [createdStudents, setCreatedStudents] = useState<CreatedClassroomStudent[]>([]);
  const [printMode, setPrintMode] = useState<"badges" | "master">("badges");
  const [copiedRoster, setCopiedRoster] = useState(false);
  const [origin, setOrigin] = useState("https://2lingo.onrender.com");

  // Step 4 State: Full-Screen Smartboard Projector Join Slide
  const [isProjectorFullscreen, setIsProjectorFullscreen] = useState(false);
  const [smartboardJoinQrUrl, setSmartboardJoinQrUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (inviteCode) {
      setCustomInviteCode(inviteCode);
    }
  }, [inviteCode]);

  // Generate Smartboard Join QR whenever origin or customInviteCode changes
  useEffect(() => {
    const cleanCode = (customInviteCode || inviteCode || "HRVAT1").trim().toUpperCase();
    const joinUrl = `${origin}/?join=${encodeURIComponent(cleanCode)}`;
    QRCode.toDataURL(joinUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((url) => setSmartboardJoinQrUrl(url))
      .catch(() => {});
  }, [origin, customInviteCode, inviteCode]);

  // Step 1 Submit: Configure Classroom Pod Mode, Code, and Weekly XP Target
  const handleStep1Next = () => {
    const cleanName = classroomName.trim();
    const cleanCode = customInviteCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!cleanName) {
      toast.error("Please enter a classroom name (e.g., Razred 3B).");
      return;
    }
    if (cleanCode.length < 4 || cleanCode.length > 10) {
      toast.error("Chalkboard code must be between 4 and 10 letters/numbers.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await updatePodSettings(podId, {
          name: cleanName,
          inviteCode: cleanCode,
          targetXp,
          type: "classroom",
        });

        if (res && "error" in res && res.error) {
          toast.error(res.error);
          return;
        }

        setCustomInviteCode(cleanCode);
        toast.success(`Classroom "${cleanName}" configured (${targetXp.toLocaleString()} XP goal)!`);
        setCurrentStep(2);
      } catch {
        toast.error("Could not update classroom settings. Proceeding to roster.");
        setCurrentStep(2);
      }
    });
  };

  // Step 2: Parse Quick Paste Roster into Table
  const handleGenerateFromPaste = () => {
    if (!bulkPasteText.trim()) {
      toast.error("Paste at least one student name first.");
      return;
    }

    const parsed = parseBulkClassroomRoster(
      bulkPasteText,
      customInviteCode || inviteCode,
      MAX_CLASSROOM_STUDENTS
    );

    if (parsed.length === 0) {
      toast.error("No valid student names found (each name must be at least 2 characters).");
      return;
    }

    setRoster(parsed);
    toast.success(`Generated ${parsed.length} student rows with Croatian diacritic-safe usernames!`);
  };

  const handleAddStudentRow = () => {
    if (roster.length >= MAX_CLASSROOM_STUDENTS) {
      toast.error(`You can provision up to ${MAX_CLASSROOM_STUDENTS} students per batch.`);
      return;
    }
    const nextIdx = roster.length;
    const nextAvatar = CLASSROOM_AVATARS[nextIdx % CLASSROOM_AVATARS.length].src;
    setRoster((prev) => [
      ...prev,
      {
        id: `student-${Date.now()}-${nextIdx}`,
        name: "",
        username: "",
        password: "",
        avatar: nextAvatar,
      },
    ]);
  };

  const handleRemoveStudentRow = (id: string) => {
    if (roster.length <= 1) return;
    setRoster((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateStudentRow = (
    id: string,
    field: keyof ClassroomRosterDraft,
    value: string
  ) => {
    setRoster((prev) => {
      const used = new Set(
        prev.filter((r) => r.id !== id && r.username).map((r) => r.username)
      );
      return prev.map((row, idx) => {
        if (row.id !== id) return row;
        if (field === "name") {
          const autoUsername = value.trim()
            ? buildClassroomUsername(value, customInviteCode || inviteCode, used)
            : "";
          const autoPassword = value.trim()
            ? buildClassroomPassword(value, idx)
            : "";
          return {
            ...row,
            name: value,
            username: autoUsername,
            password: row.password || autoPassword,
          };
        }
        return { ...row, [field]: value };
      });
    });
  };

  // Step 2 Submit: Chunked Batch Provisioning (up to 35 students in chunks of 5)
  const handleStep2Submit = () => {
    const validRows = roster.filter((r) => r.name.trim().length >= 2);
    if (validRows.length === 0) {
      toast.error("Please enter at least one student name (at least 2 characters).");
      return;
    }

    const usedUsernames = new Set<string>();
    const payloads = validRows.map((r, idx) => {
      let cleanUser = r.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
      if (cleanUser.length < 4) {
        cleanUser = buildClassroomUsername(
          r.name,
          customInviteCode || inviteCode,
          usedUsernames
        );
      } else {
        let candidate = cleanUser;
        let suffix = 2;
        while (usedUsernames.has(candidate)) {
          candidate = `${cleanUser}${suffix}`;
          suffix++;
        }
        cleanUser = candidate;
        usedUsernames.add(cleanUser);
      }

      const cleanPass =
        r.password.trim().length >= 6
          ? r.password.trim()
          : buildClassroomPassword(r.name, idx);

      return {
        childName: r.name.trim(),
        username: cleanUser,
        password: cleanPass,
        userImageSrc: r.avatar,
        podId,
      };
    });

    startTransition(async () => {
      const allCreated: CreatedClassroomStudent[] = [];
      setProvisioningProgress({ completed: 0, total: payloads.length });

      try {
        for (let i = 0; i < payloads.length; i += BATCH_CHUNK_SIZE) {
          const chunk = payloads.slice(i, i + BATCH_CHUNK_SIZE);
          const res = await createMultipleChildAccounts(chunk);

          if (res?.error || !res?.success || !res?.created) {
            toast.error(
              res?.error ||
                `Stopped at student ${i + 1}: Failed to provision batch.`
            );
            if (allCreated.length === 0) {
              setProvisioningProgress(null);
              return;
            }
            break;
          }

          for (const student of res.created) {
            const loginUrl = `${origin}/kid-login?u=${encodeURIComponent(
              student.username
            )}&p=${encodeURIComponent(student.password)}&c=${encodeURIComponent(
              customInviteCode || inviteCode
            )}`;
            let qrUrl = "";
            try {
              qrUrl = await QRCode.toDataURL(loginUrl, {
                width: 200,
                margin: 1,
                color: { dark: "#0f172a", light: "#ffffff" },
              });
            } catch {}

            allCreated.push({
              ...student,
              inviteCode: customInviteCode || inviteCode,
              qrCodeUrl: qrUrl,
            });
          }

          setProvisioningProgress({
            completed: Math.min(i + chunk.length, payloads.length),
            total: payloads.length,
          });
        }

        setProvisioningProgress(null);

        if (allCreated.length > 0) {
          setCreatedStudents(allCreated);
          toast.success(
            `Provisioned ${allCreated.length} student ${
              allCreated.length === 1 ? "account" : "accounts"
            } for ${classroomName}!`
          );
          setCurrentStep(3);
          router.refresh();
        }
      } catch {
        setProvisioningProgress(null);
        toast.error("Something went wrong while provisioning student accounts.");
      }
    });
  };

  // Step 3: Print Kit & CSV Export
  const handlePrintKit = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const csvContent = formatClassroomRosterCsv(createdStudents, origin);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = classroomName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
    a.href = url;
    a.download = `crolingo_roster_${slug || "classroom"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Classroom Roster CSV!");
  };

  const handleCopyAllCredentials = () => {
    const lines = createdStudents.map(
      (s, i) =>
        `${i + 1}. ${s.name} | Username: ${s.username} | PIN: ${s.password} | Class Code: ${s.inviteCode}`
    );
    const text = `🇭🇷 CroLingo Classroom Roster — ${classroomName} (Code: ${customInviteCode})\n\n${lines.join(
      "\n"
    )}`;
    navigator.clipboard.writeText(text);
    setCopiedRoster(true);
    toast.success("Copied full classroom roster to clipboard!");
    setTimeout(() => setCopiedRoster(false), 2500);
  };

  // Chunk students into pages of 8 for 8-Up Lanyard Badge printing
  const badgePages: CreatedClassroomStudent[][] = [];
  for (let i = 0; i < createdStudents.length; i += 8) {
    badgePages.push(createdStudents.slice(i, i + 8));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 rounded-3xl border-2 border-indigo-200 shadow-2xl">
        {/* Top Progress Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-indigo-900 p-6 text-white rounded-t-3xl print:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                <GraduationCap className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 block">
                  Učionica Onboarding • Step {currentStep} of 4
                </span>
                <DialogTitle className="text-xl sm:text-2xl font-black text-white">
                  Teacher & Classroom Setup Wizard 🇭🇷
                </DialogTitle>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2.5 rounded-full transition-all ${
                    step === currentStep
                      ? "w-8 bg-amber-400"
                      : step < currentStep
                      ? "w-4 bg-emerald-400"
                      : "w-2.5 bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>

          <DialogDescription className="text-indigo-100 text-xs sm:text-sm">
            {currentStep === 1 &&
              "Step 1: Name your Croatian classroom, customize your 6-letter chalkboard code, and set a weekly class XP goal."}
            {currentStep === 2 &&
              "Step 2: Paste your student list (up to 35 students) to auto-generate Croatian diacritic-safe usernames, PINs, and mascots."}
            {currentStep === 3 &&
              "Step 3: Print 8-Up Lanyard QR Badges, a 1-Page Teacher Master Roster Key, or export your CSV gradebook."}
            {currentStep === 4 &&
              "Step 4: Project the full-screen Smartboard Join Slide or hand out Lanyard QR Badges for shared classroom iPads!"}
          </DialogDescription>
        </div>

        <div className="p-6 sm:p-8">
          {/* ========================================================= */}
          {/* STEP 1: CLASSROOM IDENTITY & WEEKLY CLASS XP GOAL         */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    Classroom / Razred Name
                  </label>
                  <Input
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                    placeholder="e.g. Subotnja Škola — Razred 3B"
                    className="h-12 text-base font-extrabold border-2 border-slate-300 rounded-xl bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Displayed on the class leaderboard and student QR badges.
                  </p>
                </div>

                <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-5">
                  <label className="block text-xs font-black uppercase tracking-wider text-indigo-800 mb-2">
                    Chalkboard Join Code (4–10 Chars)
                  </label>
                  <Input
                    value={customInviteCode}
                    onChange={(e) =>
                      setCustomInviteCode(
                        e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                      )
                    }
                    maxLength={10}
                    placeholder="e.g. ZAGREB3B"
                    className="h-12 text-lg font-mono font-black tracking-widest uppercase border-2 border-indigo-300 rounded-xl bg-white text-indigo-950"
                  />
                  <p className="text-xs text-indigo-700 mt-2">
                    Easy for students to type on Chromebooks or scan from the Smartboard.
                  </p>
                </div>
              </div>

              {/* Weekly Class XP Goal Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
                  Weekly Class Celebration Goal (Classroom Mode: Up to 50 Students)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CLASSROOM_XP_TIERS.map((tier) => {
                    const selected = targetXp === tier.targetXp;
                    return (
                      <button
                        key={tier.targetXp}
                        type="button"
                        onClick={() => setTargetXp(tier.targetXp)}
                        className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                          selected
                            ? "border-indigo-600 bg-indigo-50/80 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black uppercase tracking-wider text-indigo-700">
                            {tier.label}
                          </span>
                          <Trophy
                            className={`h-4 w-4 ${
                              selected ? "text-amber-500" : "text-slate-300"
                            }`}
                          />
                        </div>
                        <p className="text-xl font-black text-slate-900">
                          {tier.targetXp.toLocaleString()} XP
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          {tier.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="font-bold text-slate-500"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={pending}
                  onClick={handleStep1Next}
                  className="bg-indigo-600 hover:bg-indigo-700 font-black px-6 h-12 rounded-xl cursor-pointer"
                >
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Next: Import Student Roster
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: BULK PASTE ROSTER & INTERACTIVE PREVIEW TABLE     */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Quick Paste Box */}
              <div className="bg-indigo-50/60 border-2 border-indigo-200 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-black text-sm text-indigo-950 flex items-center gap-1.5">
                      <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
                      Quick Paste Student Roster (Up to 35 Students)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Paste student names (one per line or comma-separated). Croatian letters (č, ć, š, ž, đ) are automatically normalized for login usernames!
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleGenerateFromPaste}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs h-9 px-3.5 rounded-xl shrink-0 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
                    Auto-Fill Table →
                  </Button>
                </div>

                <textarea
                  value={bulkPasteText}
                  onChange={(e) => setBulkPasteText(e.target.value)}
                  rows={3}
                  placeholder={
                    "Luka Kovačić\nMia Horvat\nStjepan Radić\nAna-Marija Babić"
                  }
                  className="w-full rounded-xl border-2 border-indigo-200 bg-white p-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Editable Roster Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Student Roster Preview ({roster.length} / {MAX_CLASSROOM_STUDENTS})
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddStudentRow}
                    disabled={roster.length >= MAX_CLASSROOM_STUDENTS}
                    className="text-xs font-extrabold text-indigo-700 hover:text-indigo-900 h-8"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Student Row
                  </Button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {roster.map((student, idx) => (
                    <div
                      key={student.id}
                      className="bg-slate-50 border-2 border-slate-200 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      <div className="sm:col-span-1 flex items-center gap-2">
                        <span className="text-xs font-black text-slate-400 w-5">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          title="Cycle Croatian Mascot"
                          onClick={() => {
                            const currentIdx = CLASSROOM_AVATARS.findIndex(
                              (a) => a.src === student.avatar
                            );
                            const nextAvatar =
                              CLASSROOM_AVATARS[
                                (currentIdx + 1) % CLASSROOM_AVATARS.length
                              ].src;
                            handleUpdateStudentRow(student.id, "avatar", nextAvatar);
                          }}
                          className="h-8 w-8 rounded-full bg-white border border-slate-300 overflow-hidden shrink-0 cursor-pointer"
                        >
                          <Image
                            src={student.avatar}
                            alt="Avatar"
                            width={32}
                            height={32}
                            className="object-contain p-0.5"
                          />
                        </button>
                      </div>

                      <div className="sm:col-span-4">
                        <Input
                          value={student.name}
                          onChange={(e) =>
                            handleUpdateStudentRow(student.id, "name", e.target.value)
                          }
                          placeholder="Student Name (e.g. Luka K.)"
                          className="h-9 text-xs font-bold bg-white"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <Input
                          value={student.username}
                          onChange={(e) =>
                            handleUpdateStudentRow(
                              student.id,
                              "username",
                              e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
                            )
                          }
                          placeholder="username"
                          className="h-9 text-xs font-mono font-bold bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          value={student.password}
                          onChange={(e) =>
                            handleUpdateStudentRow(student.id, "password", e.target.value)
                          }
                          placeholder="PIN (6+ chars)"
                          className="h-9 text-xs font-mono font-bold bg-white"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        {roster.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStudentRow(student.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove student"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Batch Progress Bar */}
              {provisioningProgress && (
                <div className="bg-indigo-950 text-white rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs font-black mb-2">
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                      Provisioning student accounts & generating QR badges...
                    </span>
                    <span className="text-amber-300">
                      {provisioningProgress.completed} / {provisioningProgress.total}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (provisioningProgress.completed /
                            Math.max(provisioningProgress.total, 1)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => setCurrentStep(1)}
                  className="font-bold text-slate-600"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  disabled={pending}
                  onClick={handleStep2Submit}
                  className="bg-emerald-600 hover:bg-emerald-700 font-black px-6 h-12 rounded-xl cursor-pointer"
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Provisioning Class...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create {roster.filter((r) => r.name.trim().length >= 2).length || 1}{" "}
                      Student Accounts & QR Kit →
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: TEACHER PRINT KIT (8-UP BADGES + MASTER ROSTER)   */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Print Mode Switcher & Action Bar (Hidden when printing) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-100 p-3.5 rounded-2xl print:hidden">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPrintMode("badges")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      printMode === "badges"
                        ? "bg-indigo-900 text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    8-Up Lanyard QR Badges ({createdStudents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintMode("master")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      printMode === "master"
                        ? "bg-indigo-900 text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    1-Page Teacher Master Key
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handlePrintKit}
                    className="font-black text-xs h-9 rounded-xl cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5 mr-1.5" />
                    Print {printMode === "badges" ? "8-Up Badges" : "Master Key"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDownloadCsv}
                    className="font-bold text-xs h-9 bg-white border border-slate-200 rounded-xl cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5 text-indigo-700" />
                    Export CSV
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAllCredentials}
                    className="font-bold text-xs h-9 bg-white border border-slate-200 rounded-xl cursor-pointer"
                  >
                    {copiedRoster ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy All
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* MODE A: 8-Up Paginated Lanyard QR Badges (2x4 Grid per Letter Page) */}
              {printMode === "badges" && (
                <div className="space-y-6">
                  {badgePages.map((pageStudents, pageIdx) => (
                    <div
                      key={pageIdx}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-2 print:gap-3 print:break-after-page"
                    >
                      {pageStudents.map((student) => (
                        <div
                          key={student.id}
                          className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs print:shadow-none"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-200 overflow-hidden shrink-0">
                                <Image
                                  src={student.userImageSrc}
                                  alt={student.name}
                                  width={36}
                                  height={36}
                                  className="object-contain p-0.5"
                                />
                              </div>
                              <div className="truncate">
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block truncate">
                                  🇭🇷 {classroomName}
                                </span>
                                <h4 className="text-sm font-black text-slate-900 truncate">
                                  {student.name}
                                </h4>
                              </div>
                            </div>

                            <div className="bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200 text-[11px] space-y-0.5">
                              <p className="text-slate-600">
                                User:{" "}
                                <strong className="font-mono font-black text-slate-900">
                                  {student.username}
                                </strong>
                              </p>
                              <p className="text-slate-600">
                                PIN:{" "}
                                <strong className="font-mono font-black text-emerald-700">
                                  {student.password}
                                </strong>{" "}
                                • Code:{" "}
                                <strong className="font-mono font-black text-indigo-700">
                                  {student.inviteCode}
                                </strong>
                              </p>
                            </div>
                          </div>

                          {student.qrCodeUrl && (
                            <div className="flex flex-col items-center shrink-0">
                              <div className="p-1.5 bg-white border-2 border-slate-200 rounded-xl">
                                <img
                                  src={student.qrCodeUrl}
                                  alt={`QR for ${student.name}`}
                                  className="h-20 w-20"
                                />
                              </div>
                              <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                                Scan on iPad
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* MODE B: 1-Page Teacher Master Roster Key (Desk Reference Sheet) */}
              {printMode === "master" && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-slate-900">
                        🇭🇷 Teacher Master Roster Key — {classroomName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Chalkboard Code:{" "}
                        <strong className="font-mono text-indigo-700">
                          {customInviteCode}
                        </strong>{" "}
                        • Keep at teacher desk for instant PIN lookup or backup QR scan.
                      </p>
                    </div>
                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                      {createdStudents.length} Students
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-black uppercase text-[10px]">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Student</th>
                          <th className="py-2.5 px-3">Username</th>
                          <th className="py-2.5 px-3">PIN / Password</th>
                          <th className="py-2.5 px-3">Class Code</th>
                          <th className="py-2.5 px-3 text-center">Desk Backup QR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {createdStudents.map((s, idx) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-black text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-extrabold text-slate-900 flex items-center gap-2">
                              <Image
                                src={s.userImageSrc}
                                alt={s.name}
                                width={24}
                                height={24}
                                className="rounded-full border border-slate-200"
                              />
                              {s.name}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-slate-800">
                              {s.username}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-emerald-700">
                              {s.password}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-indigo-700">
                              {s.inviteCode}
                            </td>
                            <td className="py-1.5 px-3 text-center">
                              {s.qrCodeUrl && (
                                <img
                                  src={s.qrCodeUrl}
                                  alt={`Backup QR ${s.name}`}
                                  className="h-10 w-10 mx-auto border border-slate-200 rounded"
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 print:hidden">
                <span className="text-xs text-slate-500 font-medium">
                  Tip: Laminate the 8-Up badges for shared classroom iPad carts!
                </span>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setCurrentStep(4)}
                  className="bg-indigo-600 hover:bg-indigo-700 font-black px-6 h-12 rounded-xl cursor-pointer"
                >
                  Next: Smartboard Join Slide & iPad Cart Guide
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: SMARTBOARD PROJECTOR JOIN SLIDE & IPAD CART GUIDE */}
          {/* ========================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Projector / Smartboard Join Slide */}
              <div
                className={`${
                  isProjectorFullscreen
                    ? "fixed inset-0 z-50 bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-950 p-8 sm:p-14 flex flex-col justify-between overflow-y-auto"
                    : "bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-indigo-400/30 shadow-xl"
                } text-white`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-widest">
                      🇭🇷 Učionica Join Slide
                    </span>
                    <span className="text-xs font-bold text-indigo-200 hidden sm:inline">
                      Project on classroom Smartboard or TV
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsProjectorFullscreen((prev) => !prev)}
                    className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-black text-xs rounded-xl cursor-pointer"
                  >
                    {isProjectorFullscreen ? (
                      <>
                        <Minimize2 className="h-4 w-4 mr-1.5" />
                        Exit Full Screen
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-4 w-4 mr-1.5" />
                        Full-Screen Smartboard Mode
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
                  <div className="md:col-span-7 space-y-4">
                    <h3
                      className={`font-black leading-tight ${
                        isProjectorFullscreen
                          ? "text-4xl sm:text-6xl"
                          : "text-2xl sm:text-3xl"
                      }`}
                    >
                      Join {classroomName}!
                    </h3>

                    <div className="space-y-3">
                      <div className="bg-white/10 border border-white/15 rounded-2xl p-4">
                        <span className="text-xs font-black uppercase tracking-widest text-amber-300 block mb-1">
                          Step 1 • Open Browser or Scan QR
                        </span>
                        <p
                          className={`font-mono font-black text-white ${
                            isProjectorFullscreen ? "text-2xl sm:text-3xl" : "text-lg"
                          }`}
                        >
                          {origin.replace(/^https?:\/\//, "")}
                        </p>
                      </div>

                      <div className="bg-white/10 border border-white/15 rounded-2xl p-4">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-300 block mb-1">
                          Step 2 • Enter Classroom Code
                        </span>
                        <p
                          className={`font-mono font-black tracking-widest text-amber-300 ${
                            isProjectorFullscreen
                              ? "text-4xl sm:text-6xl"
                              : "text-3xl sm:text-4xl"
                          }`}
                        >
                          {customInviteCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex flex-col items-center justify-center">
                    {smartboardJoinQrUrl && (
                      <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-amber-400 flex flex-col items-center">
                        <img
                          src={smartboardJoinQrUrl}
                          alt="Classroom Join QR"
                          className={
                            isProjectorFullscreen ? "h-64 w-64" : "h-44 w-44"
                          }
                        />
                        <span className="text-xs font-black text-slate-900 mt-2 uppercase tracking-wider">
                          Scan to Join {customInviteCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-indigo-200 border-t border-white/15 pt-4">
                  <span>
                    Weekly Class Celebration Goal:{" "}
                    <strong className="text-amber-300 font-black">
                      {targetXp.toLocaleString()} XP
                    </strong>
                  </span>
                  <span>
                    Have a Lanyard QR Badge? Point your iPad camera at your badge to log in with 1 tap!
                  </span>
                </div>
              </div>

              {/* Shared Classroom iPad Cart Best Practices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Tablet className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">
                      Shared Classroom iPad Carts (Grades K–3)
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Hand each student their printed <strong>Lanyard QR Badge</strong> from Step 3. They point the iPad camera at their badge and tap the yellow banner to log straight into their Croatian path!
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 flex gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">
                      Chromebook Lab & Older Students (Grades 4–8)
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Project the <strong>Smartboard Join Slide</strong> above. Students can sign in with their username/PIN from your Master Roster Key or self-join with code <strong>{customInviteCode}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep(3)}
                  className="font-bold text-slate-600"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back to Print Kit
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    onOpenChange(false);
                    router.refresh();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 font-black px-8 h-12 rounded-xl cursor-pointer"
                >
                  Finish Classroom Setup 🎉
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
