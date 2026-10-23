"use client";

import React, { useState, useTransition } from "react";
import { Copy, Users, Check, Plus } from "lucide-react";
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
import { joinPodByCode, createPod } from "@/actions/pod";

type Props = {
  podName?: string;
  inviteCode?: string;
  memberCount?: number;
};

export const PodHeader = ({
  podName = "Zgomba Family",
  inviteCode = "ZGOMBA",
  memberCount = 3,
}: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"join" | "create">("join");
  const [code, setCode] = useState("");
  const [newPodName, setNewPodName] = useState("");
  const [pending, startTransition] = useTransition();

  const onCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    toast.success(`Invite code "${inviteCode}" copied to clipboard!`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const onJoin = () => {
    if (!code.trim()) {
      toast.error("Please enter an invite code.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await joinPodByCode(code);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success(`Joined ${res?.podName || "pod"} successfully!`);
          setIsDialogOpen(false);
          setCode("");
        }
      } catch {
        toast.error("Something went wrong joining the pod.");
      }
    });
  };

  const onCreate = () => {
    if (!newPodName.trim()) {
      toast.error("Please enter a name for your pod.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createPod(newPodName);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success(`Created "${newPodName}"! Invite code: ${res?.pod?.inviteCode}`);
          setIsDialogOpen(false);
          setNewPodName("");
        }
      } catch {
        toast.error("Something went wrong creating the pod.");
      }
    });
  };

  return (
    <>
      <div className="w-full bg-slate-50 border-2 border-slate-200/80 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-x-3">
          <div className="p-2.5 bg-green-100 rounded-xl text-green-700">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="font-extrabold text-neutral-800 text-lg sm:text-xl">
                {podName}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                {memberCount} {memberCount === 1 ? "Learner" : "Learners"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Family Learning Pod • Private & Kid-Safe
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-2 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="text-xs font-bold text-neutral-600 hover:text-neutral-900 border border-slate-200 bg-white"
            title="Click to copy invite code"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5 mr-1 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1 text-neutral-500" />
            )}
            Code: <span className="text-lime-700 font-mono font-extrabold ml-1">{inviteCode}</span>
          </Button>

          <Button
            variant="primaryOutline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Pods
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-2xl text-neutral-800">
              Family Learning Pods 🇭🇷
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-neutral-600">
              Learn together with sisters, cousins, and friends!
            </DialogDescription>
          </DialogHeader>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-2">
            <button
              type="button"
              onClick={() => setActiveTab("join")}
              className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition ${
                activeTab === "join"
                  ? "bg-white text-green-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Join with Code
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition ${
                activeTab === "create"
                  ? "bg-white text-green-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create New Pod
            </button>
          </div>

          {activeTab === "join" ? (
            <div className="my-3">
              <label className="text-xs font-bold text-slate-700 block mb-1.5 text-center">
                Enter 6-character Invite Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ZGOMBA"
                maxLength={8}
                className="w-full text-center font-mono text-xl tracking-widest font-bold uppercase py-2.5 px-3 border-2 border-slate-300 rounded-xl focus:outline-hidden focus:border-green-600 transition"
                disabled={pending}
              />
            </div>
          ) : (
            <div className="my-3">
              <label className="text-xs font-bold text-slate-700 block mb-1.5 text-center">
                New Pod Name
              </label>
              <input
                type="text"
                value={newPodName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPodName(e.target.value)}
                placeholder="e.g. Cousins Club"
                className="w-full text-center text-base font-bold py-2.5 px-3 border-2 border-slate-300 rounded-xl focus:outline-hidden focus:border-green-600 transition"
                disabled={pending}
              />
            </div>
          )}

          <DialogFooter className="flex flex-col gap-y-2 mt-2">
            {activeTab === "join" ? (
              <Button
                variant="primary"
                onClick={onJoin}
                disabled={pending || !code.trim()}
                className="w-full text-base font-bold bg-green-600 hover:bg-green-700"
              >
                {pending ? "Joining..." : "Join Family Pod"}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onCreate}
                disabled={pending || !newPodName.trim()}
                className="w-full text-base font-bold bg-green-600 hover:bg-green-700"
              >
                {pending ? "Creating..." : "Create & Get Code"}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              disabled={pending}
              className="w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
