"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { QrCode, Printer, Copy, Check, RefreshCw, ShieldCheck } from "lucide-react";
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
import { issueStudentQrTokenBadge, type QrTokenBadgeChild } from "@/actions/v2/qr-auth";
import { buildQrBadgeLoginUrl } from "@/lib/v2/qr-tokens";

type LearnerData = {
  userId: string;
  userName: string;
  userImageSrc: string;
};

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  learner: LearnerData | null;
};

export const StudentBadgeModal = ({ isOpen, onOpenChange, learner }: Props) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [badge, setBadge] = useState<QrTokenBadgeChild | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("https://2lingo.onrender.com");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const loadBadge = (targetLearner: LearnerData, revokePrevious = false) => {
    startTransition(async () => {
      try {
        const res = await issueStudentQrTokenBadge(targetLearner.userId, {
          revokePrevious,
        });
        if (res.error || !res.child) {
          toast.error(res.error || "Failed to generate passwordless QR badge.");
        } else {
          setBadge(res.child);
          const loginUrl = buildQrBadgeLoginUrl(window.location.origin, res.child.token);

          const dataUrl = await QRCode.toDataURL(loginUrl, {
            width: 240,
            margin: 1,
            color: { dark: "#1E3A8A", light: "#FFFFFF" },
          });
          setQrCodeDataUrl(dataUrl);
          if (revokePrevious) {
            toast.success("Previous badges revoked & fresh Fast Pass issued!");
          }
        }
      } catch {
        toast.error("Error generating QR badge.");
      }
    });
  };

  useEffect(() => {
    if (isOpen && learner) {
      loadBadge(learner, false);
    } else if (!isOpen) {
      setBadge(null);
      setQrCodeDataUrl(null);
    }
  }, [isOpen, learner]);

  const handleCopyLink = () => {
    if (!badge) return;
    const loginUrl = buildQrBadgeLoginUrl(origin, badge.token);
    navigator.clipboard.writeText(loginUrl);
    setCopiedLink(true);
    toast.success("Passwordless Fast Pass link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 sm:rounded-2xl border-2 border-slate-200">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
              <QrCode className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-black text-slate-800">
                Student Fast Pass Badge
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium">
                Passwordless 1-tap camera login for shared iPads &amp; tablets
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {pending || !badge || !qrCodeDataUrl ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 text-blue-900 animate-spin" />
            <p className="text-xs font-bold text-slate-600">
              Minting passwordless QR Fast Pass...
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {/* Printable Badge Card */}
            <div
              id="printable-student-badge"
              className="bg-white border-2 border-slate-300 rounded-2xl p-4 text-center shadow-xs space-y-3 relative overflow-hidden"
            >
              {/* Croatian Checkerboard Accent Top Stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #DC2626 0, #DC2626 10px, #FFFFFF 10px, #FFFFFF 20px, #1E3A8A 20px, #1E3A8A 30px)",
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 pt-1">
                <div className="flex items-center gap-1.5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    className="rounded-xs overflow-hidden shrink-0"
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
                  <span className="text-xs font-black tracking-wide text-blue-900 uppercase">
                    CroLingo Fast Pass
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Passwordless
                </span>
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center justify-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 bg-slate-100 shrink-0">
                  <Image
                    src={badge.userImageSrc || "/avatars/pasko.png"}
                    alt={badge.name}
                    fill
                    unoptimized={(badge.userImageSrc || "").startsWith("http")}
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-black text-slate-800 leading-tight">
                    {badge.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 font-bold">
                    @{badge.username}
                  </p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeDataUrl}
                    alt={`Fast Pass QR Code for ${badge.name}`}
                    className="w-36 h-36 mx-auto"
                  />
                </div>
                <p className="text-xs font-bold text-blue-900 mt-2 flex items-center gap-1">
                  <QrCode className="h-3.5 w-3.5 text-blue-900" />
                  Scan with iPad camera for instant login
                </p>
              </div>

              {/* Security Assurance */}
              <div className="bg-emerald-50/70 rounded-xl p-2.5 text-xs text-left flex items-center gap-2 border border-emerald-200/80">
                <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <div className="text-emerald-900 font-semibold leading-snug">
                  Uses a secure token —{" "}
                  <span className="font-black">never changes or resets</span>{" "}
                  {badge.name}&apos;s typed password.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant="primary"
                onClick={handlePrint}
                className="h-10 text-xs font-bold bg-blue-900 hover:bg-blue-950 text-white cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                Print Badge
              </Button>

              <Button
                type="button"
                variant="primaryOutline"
                onClick={handleCopyLink}
                className="h-10 text-xs font-bold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy Login Link
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => learner && loadBadge(learner, true)}
                disabled={pending}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Revoke Old &amp; Mint New Badge
              </button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs font-bold text-slate-600"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
