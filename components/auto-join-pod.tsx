"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { joinPodByCode } from "@/actions/pod";

export const AutoJoinPod = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const joinCode = searchParams.get("join");
  const processedJoinRef = useRef(false);

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

  return null;
};
