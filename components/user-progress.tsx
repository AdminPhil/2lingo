"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InfinityIcon } from "lucide-react";
import { toast } from "sonner";

import { courses } from "@/db/schema";
import { Button } from "@/components/ui/button";
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
  hasActiveSubscription: boolean;
};

export const UserProgress = ({ 
  activeCourse, 
  points, 
  hearts, 
  hasActiveSubscription
}: Props) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onHeartClick = () => {
    if (hasActiveSubscription) {
      toast.info("Unlimited hearts are active!");
      return;
    }

    if (hearts >= 5) {
      toast.success("❤️ Your hearts are already full (5/5)!");
      return;
    }

    setIsModalOpen(true);
  };

  const onStartPractice = () => {
    setIsModalOpen(false);
    router.push("/lesson/practice");
  };

  return (
    <>
      <div className="flex items-center justify-between gap-x-2 w-full">
        <Button variant="ghost" className="pointer-events-none cursor-default" title={activeCourse.title}>
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className="rounded-md border"
            width={32}
            height={32}
          />
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center w-full justify-center mb-5">
              <Image
                src="/mascot.svg"
                alt="Mascot"
                height={80}
                width={80}
              />
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
                onClick={() => setIsModalOpen(false)}
              >
                Maybe Later
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
