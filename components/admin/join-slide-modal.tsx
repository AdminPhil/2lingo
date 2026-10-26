"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  podName: string;
  inviteCode: string;
};

export const JoinSlideModal = ({ isOpen, onOpenChange, podName, inviteCode }: Props) => {
  const [qrUrl, setQrUrl] = useState("");
  const [host, setHost] = useState("twolingo.onrender.com");

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    setHost(window.location.host);
    const joinUrl = `${window.location.origin}/?join=${encodeURIComponent(inviteCode)}`;
    QRCode.toDataURL(joinUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQrUrl)
      .catch(() => {});
  }, [isOpen, inviteCode]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-blue-950 border-4 border-amber-400 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/15">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase">
              📺 Join Slide
            </span>
            <DialogTitle className="text-sm font-extrabold text-blue-200">{podName}</DialogTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-white/15 hover:bg-white/25 text-white text-xs font-black"
          >
            Close
          </Button>
        </div>

        <DialogDescription className="sr-only">
          Full-screen join instructions with team code and QR code for projector or tablet.
        </DialogDescription>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              Join our Croatian team on your iPad or Chromebook!
            </h3>
            <div className="space-y-2.5 text-sm text-blue-100 font-bold">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
                1️⃣ Scan the QR code or open <strong className="text-white">{host}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
                2️⃣ Sign up as a <strong className="text-white">Young Learner</strong> and enter the
                team code:
                <span className="block font-mono text-4xl sm:text-5xl font-black tracking-widest text-amber-300 mt-1">
                  {inviteCode}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl p-5 text-center shadow-xl mx-auto w-64">
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrUrl} alt={`QR code to join team ${inviteCode}`} className="w-full h-auto" />
            ) : (
              <div className="h-56 flex items-center justify-center text-xs font-bold text-slate-500">
                Generating QR...
              </div>
            )}
            <p className="text-xs font-black text-blue-900 mt-2 uppercase tracking-wide">
              Scan with camera
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
