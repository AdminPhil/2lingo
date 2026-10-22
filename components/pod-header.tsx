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
import { joinPodByCode } from "@/actions/pod";

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
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();

  const onCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    toast.success(`Invite code ${inviteCode} copied to clipboard!`);
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
          setIsJoinOpen(false);
          setCode("");
        }
      } catch {
        toast.error("Something went wrong joining the pod.");
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
            onClick={() => setIsJoinOpen(true)}
            className="text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Join Pod
          </Button>
        </div>
      </div>

      <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-2xl text-neutral-800">
              Join a Family Pod 🇭🇷
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-neutral-600">
              Enter the 6-character invite code from your parents or sisters to learn together!
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <input
              type="text"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ZGOMBA"
              maxLength={8}
              className="w-full text-center font-mono text-xl tracking-widest font-bold uppercase py-2 px-3 border-2 border-slate-300 rounded-xl focus:outline-hidden focus:border-green-600 transition"
              disabled={pending}
            />
          </div>

          <DialogFooter className="flex flex-col gap-y-2">
            <Button
              variant="primary"
              onClick={onJoin}
              disabled={pending || !code.trim()}
              className="w-full text-base font-bold bg-green-600 hover:bg-green-700"
            >
              {pending ? "Joining..." : "Join Family Pod"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsJoinOpen(false)}
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
