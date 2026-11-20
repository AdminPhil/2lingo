"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InfinityIcon, Pencil } from "lucide-react";
import { toast } from "sonner";

import { courses } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { AvatarPickerModal } from "@/components/modals/avatar-picker-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  streak?: number;
  hasActiveSubscription: boolean;
  userImageSrc?: string;
  userName?: string;
};

export const UserProgress = ({ 
  activeCourse, 
  points, 
  hearts, 
  streak = 0,
  hasActiveSubscription,
  userImageSrc,
  userName,
}: Props) => {
  const router = useRouter();
  const [isHeartModalOpen, setIsHeartModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(userImageSrc || "/avatars/pasko.png");

  const onHeartClick = () => {
    if (hasActiveSubscription) {
      toast.info("Unlimited hearts are active!");
      return;
    }

    if (hearts >= 5) {
      toast.success("❤️ Your hearts are already full (5/5)!");
      return;
    }

    setIsHeartModalOpen(true);
  };

  const onStartPractice = () => {
    setIsHeartModalOpen(false);
    router.push("/lesson/practice");
  };

  return (
    <>
      <div className="flex items-center justify-between gap-x-1.5 w-full">
        {userImageSrc !== undefined && (
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            className="group relative flex items-center justify-center rounded-full p-0.5 border-2 border-blue-200 hover:border-blue-500 transition-all cursor-pointer shrink-0 bg-white shadow-2xs"
            title="Change your Croatian mascot avatar"
            aria-label="Change your Croatian mascot avatar"
          >
            <div className="relative h-9 w-9 rounded-full overflow-hidden bg-slate-100">
              <Image
                src={avatarSrc}
                alt={userName ? `${userName}'s mascot` : "Your mascot"}
                fill
                unoptimized={avatarSrc.startsWith("http")}
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Pencil className="h-2.5 w-2.5" />
            </span>
          </button>
        )}
        <Button variant="ghost" className="pointer-events-none cursor-default px-2" title={activeCourse.title}>
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className="rounded-md border"
            width={32}
            height={32}
          />
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => setIsStreakModalOpen(true)}
          className="text-amber-500 font-bold hover:bg-amber-50 transition cursor-pointer" 
          title="Daily Streak"
        >
          <Image src="/streak.svg" height={24} width={24} alt="Streak" className="mr-1.5" />
          {streak}
        </Button>
        <Button variant="ghost" className="text-orange-500 pointer-events-none cursor-default font-bold" title="Points (XP)">
          <Image src="/points.svg" height={28} width={28} alt="Points" className="mr-2" />
          {points}
        </Button>
        <Button 
          variant="ghost" 
          onClick={onHeartClick}
          className="text-rose-500 font-bold hover:bg-rose-50 transition cursor-pointer" 
          title="Click to practice and recharge hearts!"
        >
          <Image src="/heart.svg" height={22} width={22} alt="Hearts" className="mr-2" />
          {hasActiveSubscription 
            ? <InfinityIcon className="h-4 w-4 stroke-[3]" /> 
            : hearts
          }
        </Button>
      </div>

      {/* Heart Recharge Modal */}
      <Dialog open={isHeartModalOpen} onOpenChange={setIsHeartModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center w-full justify-center mb-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200/90 shadow-sm bg-white">
                <Image
                  src="/mascot.png"
                  alt="Paško the Dalmatian"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <DialogTitle className="text-center font-bold text-2xl text-neutral-800">
              Need a Heart? ❤️
            </DialogTitle>
            <DialogDescription className="text-center text-base text-neutral-600">
              You currently have <span className="font-bold text-rose-500">{hearts}/5 hearts</span>. Complete 3 quick review questions from words you know to earn +1 Heart!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button 
                variant="primary" 
                className="w-full text-base font-bold bg-green-600 hover:bg-green-700" 
                size="lg" 
                onClick={onStartPractice}
              >
                💪 Start Practice (+1 ❤️)
              </Button>
              <Button
                variant="primaryOutline" 
                className="w-full text-base" 
                size="lg" 
                onClick={() => setIsHeartModalOpen(false)}
              >
                Maybe Later
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Daily Streak Modal */}
      <Dialog open={isStreakModalOpen} onOpenChange={setIsStreakModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center w-full justify-center mb-5">
              <Image
                src="/streak.svg"
                alt="Flame"
                height={80}
                width={80}
              />
            </div>
            <DialogTitle className="text-center font-bold text-2xl text-neutral-800">
              {streak || 1} Day Streak! 🔥
            </DialogTitle>
            <DialogDescription className="text-center text-base text-neutral-600">
              You&apos;re on fire! Practice a Croatian lesson every single day to keep your flame burning and build your vocabulary habit!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button 
                variant="primary" 
                className="w-full text-base font-bold bg-amber-500 hover:bg-amber-600 text-white" 
                size="lg" 
                onClick={() => setIsStreakModalOpen(false)}
              >
                Keep the Flame Burning! 🔥
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onOpenChange={setIsAvatarModalOpen}
        currentAvatarSrc={avatarSrc}
        userName={userName}
        onAvatarUpdated={(newSrc) => {
          setAvatarSrc(newSrc);
          router.refresh();
        }}
      />
    </>
  );
};
