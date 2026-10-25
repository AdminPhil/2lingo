"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { joinPodByCode } from "@/actions/pod";
import { useParentalGateModal } from "@/store/use-parental-gate-modal";

export const AutoJoinPod = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { open: openParentalGate } = useParentalGateModal();
  const joinCode = searchParams.get("join");
  const intent = searchParams.get("intent");
  const processedJoinRef = useRef(false);
  const processedIntentRef = useRef(false);

  useEffect(() => {
    if (joinCode && !processedJoinRef.current) {
      processedJoinRef.current = true;
      joinPodByCode(joinCode)
        .then((res) => {
          if (res?.success) {
            toast.success(`🎉 You joined the ${res.podName} circle! Welcome! 🇭🇷`);
            router.replace("/learn");
            router.refresh();
          } else if (res?.error) {
            toast.error(res.error);
          }
        })
        .catch(() => {});
    }
  }, [joinCode, router]);

  useEffect(() => {
    if (intent === "parent" && !processedIntentRef.current) {
      processedIntentRef.current = true;
      openParentalGate();
      router.replace("/learn");
    }
  }, [intent, openParentalGate, router]);

  return null;
};
