"use client";

import { useEffect, useState, useTransition } from "react";
import { Printer, Download, RefreshCw, ShieldCheck, QrCode } from "lucide-react";
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
import { issueTeamQrTokenBadges } from "@/actions/v2/qr-auth";
import { buildQrBadgeLoginUrl } from "@/lib/v2/qr-tokens";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  podId: number;
  podName: string;
};

type Pass = {
  userId: string;
  name: string;
  username: string;
  userImageSrc: string;
  loginUrl: string;
  qrCodeUrl: string;
};

export const TeamQrSheetModal = ({ isOpen, onOpenChange, podId, podName }: Props) => {
  const [passes, setPasses] = useState<Pass[] | null>(null);
  const [failures, setFailures] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen) {
      setPasses(null);
      setFailures(0);
    }
  }, [isOpen]);

  const handleGenerate = (revokePrevious = false) => {
    startTransition(async () => {
      try {
        const res = await issueTeamQrTokenBadges(podId, { revokePrevious });
        if (res.error || !res.passes) {
          toast.error(res.error || "Failed to generate passwordless team badges.");
          return;
        }
        const withQr = await Promise.all(
          res.passes.map(async (p) => {
            const loginUrl = buildQrBadgeLoginUrl(window.location.origin, p.token);
            const qrCodeUrl = await QRCode.toDataURL(loginUrl, {
              width: 240,
              margin: 1,
              color: { dark: "#1E3A8A", light: "#FFFFFF" },
            });
            return {
              userId: p.userId,
              name: p.name,
              username: p.username,
              userImageSrc: p.userImageSrc,
              loginUrl,
              qrCodeUrl,
            };
          })
        );
        setPasses(withQr);
        setFailures(res.failures?.length ?? 0);
      } catch {
        toast.error("Error generating team QR sheet.");
      }
    });
  };

  const handleCsv = () => {
    if (!passes) return;
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ["Name", "Username", "Passwordless Fast Pass Link"],
      ...passes.map((p) => [p.name, p.username, p.loginUrl]),
    ];
    const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${podName.replace(/[^a-zA-Z0-9]+/g, "-")}-fast-pass-roster.csv`;
    a.click();
    URL.revokeObjectURL(href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #team-qr-sheet, #team-qr-sheet * { visibility: visible !important; }
          #team-qr-sheet { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 border-2 border-slate-200">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-900 flex items-center justify-center shrink-0">
              <QrCode className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-800">
                Team QR Fast-Pass Sheet
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium">
                Print passwordless login badges for every learner in {podName} at once.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!passes ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                <strong>Passwordless &amp; Safe:</strong> Printing this sheet mints secure camera
                QR tokens for every learner. Existing typed passwords and progress are{" "}
                <strong>never reset or modified</strong>.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Button
                variant="primary"
                onClick={() => handleGenerate(false)}
                disabled={pending}
                className="w-full bg-blue-600 hover:bg-blue-700 border-b-2 border-blue-800 text-white font-extrabold"
              >
                {pending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Minting badges...
                  </>
                ) : (
                  "Generate Fast-Pass Sheet"
                )}
              </Button>
              <Button
                variant="primaryOutline"
                onClick={() => handleGenerate(true)}
                disabled={pending}
                className="w-full font-bold text-xs border-2 border-slate-300 text-slate-700"
              >
                Revoke Prior Badges &amp; Mint Fresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-600">
                {passes.length} passwordless badge{passes.length === 1 ? "" : "s"} ready
                {failures > 0 ? ` • ${failures} could not be generated` : ""}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="primaryOutline"
                  size="sm"
                  onClick={handleCsv}
                  className="text-xs font-bold h-9"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs font-bold h-9 bg-blue-900 hover:bg-blue-950 text-white"
                >
                  <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Sheet
                </Button>
              </div>
            </div>

            <div id="team-qr-sheet" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {passes.map((p) => (
                <div
                  key={p.userId}
                  className="border-2 border-slate-300 rounded-2xl p-3 text-center bg-white space-y-2 break-inside-avoid"
                >
                  <p className="text-xs font-black text-blue-900 uppercase tracking-wide">
                    CroLingo Fast Pass
                  </p>
                  <p className="font-black text-sm text-slate-900 truncate">{p.name}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.qrCodeUrl}
                    alt={`Fast Pass QR Code for ${p.name}`}
                    className="w-28 h-28 mx-auto"
                  />
                  <div className="text-xs font-mono font-bold text-slate-600 leading-snug truncate">
                    @{p.username}
                  </div>
                  <p className="text-[10px] font-bold text-emerald-700">
                    Scan camera to sign in
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
