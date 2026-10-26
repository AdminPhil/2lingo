"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { QrCode, Printer, Copy, Check, RefreshCw, Sparkles, X } from "lucide-react";
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
import { adminGetOrResetStudentQrPass } from "@/actions/child-account";

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
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
    name: string;
    userImageSrc: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);
  const [origin, setOrigin] = useState("https://2lingo.onrender.com");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const loadBadge = (targetLearner: LearnerData) => {
    startTransition(async () => {
      try {
        const res = await adminGetOrResetStudentQrPass(targetLearner.userId);
        if (res.error || !res.child) {
          toast.error(res.error || "Failed to load badge credentials.");
        } else {
          setCredentials(res.child);
          const loginUrl = `${window.location.origin}/qr-login?u=${encodeURIComponent(
            res.child.username
          )}&p=${encodeURIComponent(res.child.password)}`;

          const dataUrl = await QRCode.toDataURL(loginUrl, {
            width: 240,
            margin: 1,
            color: { dark: "#1E3A8A", light: "#FFFFFF" },
          });
          setQrCodeDataUrl(dataUrl);
        }
      } catch {
        toast.error("Error generating QR badge.");
      }
    });
  };

  useEffect(() => {
    if (isOpen && learner) {
      loadBadge(learner);
    } else if (!isOpen) {
      setCredentials(null);
      setQrCodeDataUrl(null);
    }
  }, [isOpen, learner]);

  const handleCopyLink = () => {
    if (!credentials) return;
    const loginUrl = `${origin}/qr-login?u=${encodeURIComponent(
      credentials.username
    )}&p=${encodeURIComponent(credentials.password)}`;
    navigator.clipboard.writeText(loginUrl);
    setCopiedLink(true);
    toast.success("Fast pass login link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCredentials = () => {
    if (!credentials) return;
    navigator.clipboard.writeText(
      `CroLingo Login\nUsername: ${credentials.username}\nPassword: ${credentials.password}`
    );
    setCopiedCreds(true);
    toast.success("Credentials copied!");
    setTimeout(() => setCopiedCreds(false), 2000);
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
                1-tap camera login pass for shared iPads &amp; tablets
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {pending || !credentials || !qrCodeDataUrl ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 text-blue-900 animate-spin" />
            <p className="text-xs font-bold text-slate-600">
              Generating secure student QR badge...
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
                  <svg width="18" height="18" viewBox="0 0 20 20" className="rounded-xs overflow-hidden shrink-0" aria-label="Hrvatska Šahovnica">
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
                <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  Student Badge
                </span>
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center justify-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 bg-slate-100 shrink-0">
                  <Image
                    src={credentials.userImageSrc || "/avatars/pasko.png"}
                    alt={credentials.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-black text-slate-800 leading-tight">
                    {credentials.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 font-bold">
                    @{credentials.username}
                  </p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <img
                    src={qrCodeDataUrl}
                    alt={`Fast Pass QR Code for ${credentials.name}`}
                    className="w-36 h-36 mx-auto"
                  />
                </div>
                <p className="text-xs font-bold text-blue-900 mt-2 flex items-center gap-1">
                  <QrCode className="h-3.5 w-3.5 text-blue-900" />
                  Scan with iPad camera for instant login
                </p>
              </div>

              {/* Credentials Reference */}
              <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-left grid grid-cols-2 gap-2 border border-slate-200/80">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Username
                  </span>
                  <span className="font-mono font-black text-slate-800 text-xs truncate block">
                    {credentials.username}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Password
                  </span>
                  <span className="font-mono font-black text-slate-800 text-xs truncate block">
                    {credentials.password}
                  </span>
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
                onClick={() => learner && loadBadge(learner)}
                disabled={pending}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Reset &amp; Regenerate Pass
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
