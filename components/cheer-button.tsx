"use client";

import { useState, useTransition } from "react";
import { Check, Hand } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { sendPodCheer } from "@/actions/cheer";

type Props = {
  receiverId: string;
  receiverName: string;
  isCurrentUser: boolean;
  hasCheeredToday: boolean;
};

export const CheerButton = ({
  receiverId,
  receiverName,
  isCurrentUser,
  hasCheeredToday: initialCheered,
}: Props) => {
  const [hasCheered, setHasCheered] = useState(initialCheered);
  const [pending, startTransition] = useTransition();

  if (isCurrentUser) {
    return (
      <span className="text-xs font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-md">
        You
      </span>
    );
  }

  const onSendCheer = () => {
    if (hasCheered) return;

    startTransition(async () => {
      try {
        const res = await sendPodCheer(receiverId, "high_five");
        if (res?.error) {
          toast.error(res.error);
        } else {
          setHasCheered(true);
          toast.success(`High-Five sent to ${receiverName}! 👋`);
        }
      } catch {
        toast.error("Failed to send cheer.");
      }
    });
  };

  if (hasCheered) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 opacity-90 h-8 px-2.5"
      >
        <Check className="h-3 w-3 mr-1" />
        Sent! 👋
      </Button>
    );
  }

  return (
    <Button
      variant="primaryOutline"
      size="sm"
      disabled={pending}
      onClick={onSendCheer}
      className="text-xs font-bold text-amber-600 hover:text-amber-700 border-amber-300 hover:bg-amber-50 h-8 px-2.5 transition active:scale-95 cursor-pointer"
      title={`Send a high-five to ${receiverName}!`}
    >
      <Hand className="h-3.5 w-3.5 mr-1 text-amber-500" />
      {pending ? "..." : "High-Five 👋"}
    </Button>
  );
};
