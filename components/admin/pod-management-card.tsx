"use client";

import { useState, useTransition } from "react";
import { Users, Edit3, Plus, Trophy, Copy, Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updatePodSettings, createPod, deletePod, removePodMember } from "@/actions/pod";
import { AddMemberToPodModal } from "@/components/admin/add-member-to-pod-modal";

type PodData = {
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

type Props = {
  pods: PodData[];
  availableUsers?: {
    userId: string;
    userName: string;
    userImageSrc?: string;
  }[];
  isSuperAdmin?: boolean;
};

export const PodManagementCard = ({ pods: initialPods, availableUsers = [], isSuperAdmin = false }: Props) => {
  const podsList = initialPods;
  const [editingPod, setEditingPod] = useState<PodData | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [targetPodForAdd, setTargetPodForAdd] = useState<PodData | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editTargetXp, setEditTargetXp] = useState(1000);
  const [editType, setEditType] = useState<"family" | "classroom">("family");

  // Create form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"family" | "classroom">("family");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code "${code}"!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openEditModal = (pod: PodData) => {
    setEditingPod(pod);
    setEditName(pod.name);
    setEditCode(pod.inviteCode);
    setEditTargetXp(pod.targetXp || 1000);
    setEditType(pod.type === "classroom" ? "classroom" : "family");
  };

  const handleRemoveMember = (podId: number, memberUserId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from this team? Their account and progress are kept.`)) return;
    startTransition(async () => {
      try {
        const res = await removePodMember(podId, memberUserId);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success(`Removed ${memberName} from the team.`);
        }
      } catch {
        toast.error("Failed to remove member.");
      }
    });
  };

  const handleUpdate = () => {
    if (!editingPod) return;
    if (!editName.trim()) {
      toast.error("Team name cannot be empty.");
      return;
    }
    if (!editCode.trim()) {
      toast.error("Team code cannot be empty.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await updatePodSettings(editingPod.id, {
          name: editName,
          inviteCode: editCode,
          targetXp: editTargetXp,
          type: editType,
        });

        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("Team settings updated successfully!");
          setEditingPod(null);
        }
      } catch {
        toast.error("Failed to update team settings.");
      }
    });
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Please enter a team name.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createPod(newName, newType);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success(`Created team "${newName}" with code ${res?.pod?.inviteCode}!`);
          setIsCreateOpen(false);
          setNewName("");
          setNewType("family");
        }
      } catch {
        toast.error("Failed to create team.");
      }
    });
  };

  const handleDelete = (podId: number) => {
    if (confirm("Are you sure you want to delete this team?")) {
      startTransition(async () => {
        try {
          const res = await deletePod(podId);
          if (res?.error) {
            toast.error(res.error);
          } else {
            toast.success("Team deleted.");
          }
        } catch {
          toast.error("Failed to delete team.");
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs mb-8">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <div className="flex items-center gap-x-2">
            <h3 className="font-extrabold text-lg text-neutral-800">
              Family & Classroom Learning Teams
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded-full">
              {podsList.length} Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure team join codes, custom team names, and weekly collaborative celebration targets.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 border-b-2 border-blue-800 text-white font-extrabold text-xs shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create New Team
        </Button>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {podsList.map((pod) => (
          <div
            key={pod.id}
            className="border-2 border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition flex flex-col justify-between bg-slate-50/50"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-x-2.5">
                  <div className="p-2 bg-blue-100 rounded-xl text-blue-800">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-neutral-800">
                      {pod.name}
                    </h4>
                    <span className="text-xs text-muted-foreground capitalize">
                      {pod.type === "classroom" ? "Classroom" : "Family"} Team • ID: {pod.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-x-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(pod)}
                    className="h-8 px-2 text-xs font-bold text-neutral-600 border border-slate-200 bg-white"
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  {pod.id !== 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(pod.id)}
                      className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Code & Goal Details */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-xs font-bold uppercase">Team Code</span>
                    <span className="font-mono font-black text-blue-800 text-sm">{pod.inviteCode}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopy(pod.inviteCode)}
                      title="Copy code"
                      className="h-7 w-7 p-0 cursor-pointer"
                    >
                      {copiedCode === pod.inviteCode ? (
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-xs font-bold uppercase">Weekly Team Goal</span>
                  <span className="font-extrabold text-neutral-800 text-sm flex items-center gap-x-1">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    {pod.targetXp || 1000} XP
                  </span>
                </div>
              </div>

              {/* Member list preview */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Members ({pod.members.length}):
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTargetPodForAdd(pod)}
                    className="h-6 px-2 text-xs font-extrabold text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add User</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pod.members.map((m) => (
                    <span
                      key={m.userId}
                      className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg flex items-center gap-x-1"
                    >
                      <span>{m.userName}</span>
                      {(m.role === "owner" || m.role === "admin") && (
                        <span className="text-xs bg-blue-100 text-blue-900 px-1.5 rounded font-bold uppercase">
                          {m.role === "owner" ? "Parent" : "Admin"}
                        </span>
                      )}
                      {m.role !== "owner" && (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => handleRemoveMember(pod.id, m.userId, m.userName)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          title={`Remove ${m.userName} from team`}
                          aria-label={`Remove ${m.userName} from team`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Pod Dialog Modal */}
      <Dialog open={!!editingPod} onOpenChange={(open) => !open && setEditingPod(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-xl text-neutral-800">
              Edit Team Settings
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-neutral-600">
              Customize team mode, name, unique team code, and weekly collaborative XP celebration target.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Team Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: "family", label: "🏠 Family Team", sub: "Up to 15 members" },
                  { key: "classroom", label: "🏫 Classroom Team", sub: "Up to 50 students" },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setEditType(opt.key)}
                    className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition ${
                      editType === opt.key
                        ? "border-blue-600 bg-blue-50/70 text-blue-950"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-sm font-black block">{opt.label}</span>
                    <span className="text-xs text-slate-600">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Zgomba Family"
                className="w-full text-sm font-semibold py-2 px-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-hidden transition"
                disabled={pending}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Custom Team Code
              </label>
              <input
                type="text"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                placeholder="e.g. ZGOMBA"
                maxLength={10}
                className="w-full font-mono text-base font-black tracking-widest uppercase py-2 px-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-hidden transition"
                disabled={pending}
              />
              <span className="text-xs text-muted-foreground mt-0.5 block">
                Must be unique. Kids enter this code to join.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Weekly Team Celebration Goal (Family & Classroom Tiers)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2000, 3000, 5000, 10000].map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant={editTargetXp === val ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setEditTargetXp(val)}
                    className="text-xs font-bold border border-slate-200"
                  >
                    {val.toLocaleString()} XP
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-y-2 mt-4">
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={pending}
              className="w-full text-base font-bold bg-blue-600 hover:bg-blue-700 border-b-2 border-blue-800 text-white"
            >
              {pending ? "Saving..." : "Save Team Settings"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setEditingPod(null)}
              disabled={pending}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User to Pod Dialog Modal */}
      {targetPodForAdd && (
        <AddMemberToPodModal
          isOpen={!!targetPodForAdd}
          onOpenChange={(open) => !open && setTargetPodForAdd(null)}
          podId={targetPodForAdd.id}
          podName={targetPodForAdd.name}
          existingMemberIds={targetPodForAdd.members.map((m) => m.userId)}
          availableUsers={availableUsers}
        />
      )}

      {/* Create Pod Dialog Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-xl text-neutral-800">
              Create a New Learning Team
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-neutral-600">
              Set up a new Family Team or Classroom Team!
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Team Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: "family", label: "🏠 Family Team", sub: "Up to 15 members" },
                { key: "classroom", label: "🏫 Classroom Team", sub: "Up to 50 students" },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setNewType(opt.key)}
                  className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition ${
                    newType === opt.key
                      ? "border-blue-600 bg-blue-50/70 text-blue-950"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="text-sm font-black block">{opt.label}</span>
                  <span className="text-xs text-slate-600">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="my-3">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Team Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Cousins Club"
              className="w-full text-sm font-semibold py-2 px-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-hidden transition"
              disabled={pending}
            />
          </div>

          <DialogFooter className="flex flex-col gap-y-2">
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={pending || !newName.trim()}
              className="w-full text-base font-bold bg-blue-600 hover:bg-blue-700 border-b-2 border-blue-800 text-white"
            >
              {pending ? "Creating..." : "Create Team"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsCreateOpen(false)}
              disabled={pending}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
