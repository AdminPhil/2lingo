"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Crown, Star } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getStageThemeForUnit } from "@/lib/theme-registry";

import "react-circular-progressbar/dist/styles.css";

type Props = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
  unitOrder?: number;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
  unitOrder = 1,
}: Props) => {
  const theme = getStageThemeForUnit(unitOrder);

  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) {
    indentationLevel = cycleIndex;
  } else if (cycleIndex <= 4) {
    indentationLevel = 4 - cycleIndex;
  } else if (cycleIndex <= 6) {
    indentationLevel = 4 - cycleIndex;
  } else {
    indentationLevel = cycleIndex - 8;
  }

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;

  const Icon = isCompleted ? Check : isLast ? Crown : Star;

  const href = isCompleted ? `/lesson/${id}` : "/lesson";

  const buttonVariant = locked ? "locked" : isLast ? "golden" : "default";

  const currentButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (current && currentButtonRef.current) {
      const timer = setTimeout(() => {
        currentButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [current]);

  return (
    <Link 
      href={href} 
      aria-disabled={locked} 
      style={{ pointerEvents: locked ? "none" : "auto" }}
    >
      <div
        ref={current ? currentButtonRef : undefined}
        id={current ? "current-lesson" : undefined}
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          <div className="h-[102px] w-[102px] relative">
            <div className={cn(
              "absolute -top-7 px-3 py-1.5 border-2 font-extrabold uppercase rounded-xl animate-bounce tracking-wide z-10 text-xs whitespace-nowrap shadow-md",
              isLast 
                ? "bg-amber-50 text-amber-700 border-amber-400 left-[-8px]"
                : cn(theme.nodeBadgeClasses, "left-2.5")
            )}>
              {isLast ? "👑 Super Izazov" : "Start"}
              <div
                className={cn(
                  "absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2",
                  isLast ? "border-t-amber-400" : theme.nodeArrowBorder
                )}
              />
            </div>
            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: {
                  stroke: isLast ? "#f59e0b" : theme.nodeStrokeColor,
                },
                trail: {
                  stroke: "#e5e7eb",
                },
              }}
            >
              <Button
                size="rounded"
                variant={buttonVariant}
                className={cn(
                  "h-[70px] w-[70px] border-b-8",
                  !locked && !isLast && theme.nodeActiveBg,
                  isLast && !locked && "ring-4 ring-amber-300/60 ring-offset-2 animate-pulse"
                )}
              >
                <Icon
                  className={cn(
                    "h-10 w-10",
                    locked
                      ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                      : isLast
                      ? "fill-amber-950 text-amber-950"
                      : "fill-white text-white",
                    isCompleted && "fill-none stroke-[4]"
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <Button
            size="rounded"
            variant={buttonVariant}
            className={cn(
              "h-[70px] w-[70px] border-b-8",
              !locked && !isLast && theme.nodeActiveBg,
              isLast && !locked && "ring-2 ring-amber-300"
            )}
          >
            <Icon
              className={cn(
                "h-10 w-10",
                locked
                  ? "fill-neutral-400 text-neutral-400 stroke-neutral-400"
                  : isLast
                  ? "fill-amber-950 text-amber-950"
                  : "fill-white text-white",
                isCompleted && "fill-none stroke-[4]"
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  );
};
