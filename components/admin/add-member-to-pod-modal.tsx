"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { UserPlus, Search, Check, Shield, GraduationCap, X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAddUsersToPod } from "@/actions/pod";

type UserOption = {
  userId: string;
  userName: string;
  userImageSrc?: string;
};

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  podId: number;
  podName: string;
  existingMemberIds: string[];
  availableUsers: UserOption[];
};

export const AddMemberToPodModal = ({
  isOpen,
  onOpenChange,
  podId,
  podName,
  existingMemberIds,
  availableUsers,
}: Props) => {
  const [search, setSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [role, setRole] = useState<"member" | "admin">("member");
  const [pending, startTransition] = useTransition();

  const handleClose = () => {
    setSearch("");
    setSelectedUserIds([]);
    setRole("member");
    onOpenChange(false);
  };

  const filteredUsers = availableUsers.filter((user) =>
    user.userName.toLowerCase().includes(search.toLowerCase()) ||
    user.userId.toLowerCase().includes(search.toLowerCase())
  );

  const availableEligibleUsers = filteredUsers.filter(
    (u) => !existingMemberIds.includes(u.userId)
  );

  const allEligibleSelected =
    availableEligibleUsers.length > 0 &&
    availableEligibleUsers.every((u) => selectedUserIds.includes(u.userId));

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (allEligibleSelected) {
      setSelectedUserIds((prev) =>
        prev.filter((id) => !availableEligibleUsers.some((u) => u.userId === id))
      );
    } else {
      const eligibleIds = availableEligibleUsers.map((u) => u.userId);
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...eligibleIds])));
    }
  };

  const handleAdd = () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user to add.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await adminAddUsersToPod(podId, selectedUserIds, role);
        if (res?.error) {
          toast.error(res.error);
        } else {
          const count = selectedUserIds.length;
          const roleLabel = role === "admin" ? "Pod Admin" : "Learner";
          toast.success(
            `Added ${count} ${count === 1 ? "user" : "users"} to ${podName} as ${roleLabel}!`
          );
          handleClose();
        }
      } catch {
        toast.error("Failed to add users to pod.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-2 shadow-xs">
            <UserPlus className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-black text-neutral-800">
            Add User to Pod
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Assign any registered learner or parent to <strong className="text-neutral-700">{podName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="pl-9 pr-8 text-xs font-medium"
              disabled={pending}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* User Selection List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Select Users ({filteredUsers.length} available)
              </label>
              <div className="flex items-center gap-2">
                {selectedUserIds.length > 0 && (
                  <span className="text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                    {selectedUserIds.length} selected
                  </span>
                )}
                {availableEligibleUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    disabled={pending}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                  >
                    {allEligibleSelected ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
              {filteredUsers.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No users found matching &ldquo;{search}&rdquo;.
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isAlreadyMember = existingMemberIds.includes(user.userId);
                  const isSelected = selectedUserIds.includes(user.userId);

                  return (
                    <button
                      key={user.userId}
                      type="button"
                      disabled={isAlreadyMember || pending}
                      onClick={() => toggleSelectUser(user.userId)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition border cursor-pointer ${
                        isSelected
                          ? "bg-green-50 border-green-500 shadow-xs"
                          : isAlreadyMember
                          ? "bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-x-2.5 min-w-0">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                          <Image
                            src={user.userImageSrc || "/avatars/pasko.png"}
                            alt={user.userName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-neutral-800 truncate">
                            {user.userName}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono truncate">
                            {user.userId}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isAlreadyMember ? (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            In Pod
                          </span>
                        ) : isSelected ? (
                          <div className="w-5 h-5 bg-green-500 text-white rounded-md flex items-center justify-center shadow-xs">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white hover:border-slate-400 transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Assigned Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("member")}
                disabled={pending}
                className={`p-2.5 rounded-xl border-2 text-left transition flex items-start gap-x-2 ${
                  role === "member"
                    ? "border-green-500 bg-green-50/70 text-green-950"
                    : "border-slate-200 bg-white hover:border-slate-300 text-neutral-700"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    role === "member" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold">Learner</div>
                  <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    Member (earns XP & competes)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                disabled={pending}
                className={`p-2.5 rounded-xl border-2 text-left transition flex items-start gap-x-2 ${
                  role === "admin"
                    ? "border-blue-500 bg-blue-50/70 text-blue-950"
                    : "border-slate-200 bg-white hover:border-slate-300 text-neutral-700"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    role === "admin" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold">Pod Admin</div>
                  <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    Parent / Organizer (manages pod)
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between items-center gap-2 mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={pending}
            className="text-xs font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAdd}
            disabled={selectedUserIds.length === 0 || pending}
            className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs px-4"
          >
            {pending ? (
              "Adding..."
            ) : selectedUserIds.length <= 1 ? (
              "Add to Pod"
            ) : (
              `Add ${selectedUserIds.length} Users to Pod`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
