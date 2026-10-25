"use client";

import { useState } from "react";
import { UserPlus, Tablet, Copy, Check, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AddChildModal } from "./add-child-modal";

type Props = {
  podId: number;
  podName: string;
  inviteCode: string;
};

export const HowToAddChildrenCard = ({ podId, podName, inviteCode }: Props) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    toast.success(`Copied code "${inviteCode}"!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `https://2lingo.net/?join=${inviteCode}`;
    navigator.clipboard.writeText(`Join our CroLingo family pod with code: ${inviteCode}\n${link}`);
    setCopiedLink(true);
    toast.success("Family invite link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-200/90 rounded-2xl p-5 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-emerald-200/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-800">
                👨‍👩‍👧 How to Add Your Children to {podName}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Choose the setup method that works best for your family:
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Child Account</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method 1: Instant Direct Creation */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-sm text-slate-800">
                  Create Directly (Recommended for Kids)
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set up a simple username & password for your child right now without needing an email address. They can use it to log in on any device!
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-700">
                No email or second device needed
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs font-bold text-emerald-700 hover:bg-emerald-50 h-8 px-2"
              >
                Add child now →
              </Button>
            </div>
          </div>

          {/* Method 2: Self-Join on Child's Device */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-5 w-5 rounded-full bg-sky-100 text-sky-800 text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-sm text-slate-800">
                  Self-Join on Child&apos;s iPad / Device
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have your child open <strong>2lingo.net</strong> on their tablet or phone, sign up as a <strong>Young Learner</strong>, and enter your 6-letter family code:
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Code:</span>
                <span className="font-mono font-black text-emerald-700 text-sm tracking-wider">
                  {inviteCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-emerald-700 cursor-pointer ml-1"
                  title="Copy code"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 h-8 px-2"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy Invite
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddChildModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        podId={podId}
        podName={podName}
      />
    </>
  );
};
