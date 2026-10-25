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

      // Clean URL query param without triggering a concurrent Next.js route transition
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", "/learn");
      }

      // Wait for Clerk's modal portal (.cl-modalBackdrop) to finish unmounting
      // before mounting Radix's ParentalGateModal to prevent aria-hidden & removeChild collisions
      let attempts = 0;
      const openWhenClerkModalClosed = () => {
        const clerkBackdrop =
          typeof document !== "undefined"
            ? document.querySelector(".cl-modalBackdrop")
            : null;

        if (clerkBackdrop && attempts < 15) {
          attempts += 1;
          if (
            document.activeElement instanceof HTMLElement &&
            clerkBackdrop.contains(document.activeElement)
          ) {
            document.activeElement.blur();
          }
          setTimeout(openWhenClerkModalClosed, 100);
          return;
        }

        openParentalGate();
      };

      setTimeout(openWhenClerkModalClosed, 250);
    }
  }, [intent, openParentalGate]);

  return null;
};
