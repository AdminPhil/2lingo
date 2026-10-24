"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InfinityIcon, X } from "lucide-react";
import { toast } from "sonner";

import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/use-exit-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
};

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
}: Props) => {
  const router = useRouter();
  const { open: openExitModal } = useExitModal();
  const [isHeartDialogOpen, setIsHeartDialogOpen] = useState(false);

  const onHeartClick = () => {
    if (hasActiveSubscription) {
      toast.info("Unlimited hearts are active!");
      return;
    }
    if (hearts >= 5) {
      toast.success("❤️ Your hearts are full (5/5)!");
      return;
    }
    setIsHeartDialogOpen(true);
  };

  return (
    <>
      <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
        <X
          onClick={openExitModal}
          className="text-slate-500 hover:opacity-75 transition cursor-pointer"
        />
        <Progress value={percentage} />
        <button
          onClick={onHeartClick}
          className="text-rose-500 flex items-center font-bold hover:opacity-80 transition cursor-pointer p-1.5 rounded-xl hover:bg-rose-50"
          title="Click to recharge hearts"
        >
          <Image
            src="/heart.svg"
            height={28}
            width={28}
            alt="Heart"
            className="mr-2"
          />
          {hasActiveSubscription
            ? <InfinityIcon className="h-6 w-6 stroke-[3] shrink-0" />
            : hearts
          }
        </button>
      </header>

      <Dialog open={isHeartDialogOpen} onOpenChange={setIsHeartDialogOpen}>
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
              You currently have <span className="font-bold text-rose-500">{hearts}/5 hearts</span>. Would you like to recharge a heart right now with 3 quick review questions?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button 
                variant="primary" 
                className="w-full text-base font-bold bg-green-600 hover:bg-green-700" 
                size="lg" 
                onClick={() => {
                  setIsHeartDialogOpen(false);
                  router.push("/lesson/practice");
                }}
              >
                💪 Go to Practice (+1 ❤️)
              </Button>
              <Button
                variant="primaryOutline" 
                className="w-full text-base" 
                size="lg" 
                onClick={() => setIsHeartDialogOpen(false)}
              >
                Keep Playing Lesson
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
