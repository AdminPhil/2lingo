"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHeartsModal } from "@/store/use-hearts-modal";

export const HeartsModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useHeartsModal();

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  const onStartPractice = () => {
    close();
    router.push("/lesson/practice");
  };

  const onBackToMap = () => {
    close();
    router.push("/learn");
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
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
            Out of Hearts? Let&apos;s Recharge! ⚡
          </DialogTitle>
          <DialogDescription className="text-center text-base text-neutral-600">
            Mistakes help our brains grow bigger and smarter! Complete 3 quick review questions to earn back a heart.
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
              💪 Practice to Earn a Heart (+1 ❤️)
            </Button>
            <Button
              variant="primaryOutline" 
              className="w-full text-base" 
              size="lg" 
              onClick={onBackToMap}
            >
              Back to Map
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
