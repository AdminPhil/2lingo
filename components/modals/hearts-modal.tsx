"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

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
import { freeRefillHearts } from "@/actions/user-progress";

export const HeartsModal = () => {
  const [isClient, setIsClient] = useState(false);
  const [pending, startTransition] = useTransition();
  const { isOpen, close, onRefillCallback } = useHeartsModal();

  useEffect(() => setIsClient(true), []);

  const onRefill = () => {
    startTransition(() => {
      freeRefillHearts()
        .then(() => {
          toast.success("❤️ Hearts refilled! Keep having fun!");
          onRefillCallback?.();
          close();
        })
        .catch(() => {
          toast.error("Could not refill hearts. Try again!");
        });
    });
  };

  if (!isClient) {
    return null;
  }

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
            Don&apos;t Give Up! 🌟
          </DialogTitle>
          <DialogDescription className="text-center text-base text-neutral-600">
            Mistakes help our brains grow bigger and smarter! Refill your hearts for free and keep going.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button 
              variant="primary" 
              className="w-full text-base font-bold" 
              size="lg" 
              disabled={pending}
              onClick={onRefill}
            >
              ❤️ Free Heart Refill
            </Button>
            <Button
              variant="primaryOutline" 
              className="w-full text-base" 
              size="lg" 
              onClick={close}
            >
              Keep Practicing
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
