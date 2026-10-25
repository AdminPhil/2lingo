"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Users, Check, QrCode, Plus, LogOut } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProfileSwitcherModal } from "@/store/use-profile-switcher-modal";

export const ProfileSwitcherModal = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useProfileSwitcherModal();
  const { client, setActive, signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const sessions = client?.sessions || [];
  const currentSessionId = client?.lastActiveSessionId;

  const handleSwitchSession = async (sessionId: string, userName: string) => {
    if (sessionId === currentSessionId) {
      close();
      return;
    }

    try {
      await setActive({ session: sessionId });
      toast.success(`Switched profile to ${userName}! 🇭🇷`);
      close();
      router.refresh();
    } catch {
      toast.error("Failed to switch profile. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-md p-6 sm:rounded-2xl border-2 border-slate-200">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-900 text-white flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-black text-slate-800">
                Tko danas uči?
              </DialogTitle>
              <p className="text-xs text-slate-500 font-medium">
                Who is learning today? (Shared Tablet Switcher)
              </p>
            </div>
          </div>
          <DialogDescription className="text-xs text-slate-600 font-medium pt-1">
            Tap a profile to switch learners instantly on this device:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 pt-2">
          {sessions.map((s) => {
            const isCurrent = s.id === currentSessionId;
            const displayName = s.user?.firstName || s.user?.username || "Learner";
            const avatarSrc = s.user?.imageUrl || "/mascot.png";

            return (
              <div
                key={s.id}
                onClick={() => handleSwitchSession(s.id, displayName)}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent
                    ? "border-green-500 bg-green-50/70 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-x-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-2xs bg-white shrink-0">
                    <Image
                      src={avatarSrc}
                      fill
                      alt={displayName}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">
                      {displayName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {isCurrent ? "Active on this tablet" : "Tap to switch"}
                    </p>
                  </div>
                </div>

                {isCurrent && (
                  <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primaryOutline"
              onClick={() => {
                close();
                router.push("/qr-login");
              }}
              className="w-full h-11 rounded-xl text-xs font-bold border-2 border-dashed border-slate-300 hover:border-blue-900 text-slate-700"
            >
              <QrCode className="h-4 w-4 mr-2 text-blue-900" />
              Scan Student Badge / QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
