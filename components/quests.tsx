import Link from "next/link";
import Image from "next/image";

import { quests } from "@/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Props = {
  points: number;
};

export const Quests = ({ points }: Props) => {
  const uncompletedQuests = quests.filter((q) => points < q.value);
  const displayedQuests = uncompletedQuests.length > 0 
    ? uncompletedQuests.slice(0, 3) 
    : quests.slice(-3);

  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between w-full space-y-2">
        <h3 className="font-bold text-lg">
          Quests
        </h3>
        <Link href="/quests">
          <Button
            size="sm"
            variant="primaryOutline"
          >
            View all
          </Button>
        </Link>
      </div>
      <ul className="w-full space-y-3">
        {displayedQuests.map((quest) => {
          const progress = Math.min((points / quest.value) * 100, 100);

          return (
            <div
              className="flex items-start w-full pb-3.5 gap-x-3 border-b border-slate-100 last:border-b-0 last:pb-0"
              key={quest.title}
            >
              <Image
                src="/points.svg"
                alt="Points"
                width={36}
                height={36}
                className="shrink-0 mt-0.5"
              />
              <div className="flex flex-col gap-y-1 w-full min-w-0">
                <div className="flex items-baseline justify-between gap-x-2">
                  <p className="text-neutral-800 text-sm font-bold">
                    Earn {quest.value.toLocaleString()} XP
                  </p>
                  <span className="text-[11px] font-semibold text-muted-foreground shrink-0">
                    {points}/{quest.value}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-medium leading-tight">
                  <span className="font-semibold text-neutral-800">{quest.stageCroatian}</span>
                  <span className="text-neutral-400 mx-1.5">•</span>
                  <span className="text-neutral-500 italic">&ldquo;{quest.stageEnglish}&rdquo;</span>
                </p>
                <Progress value={progress} className="h-2 mt-1" />
              </div>
            </div>
          )
        })}
      </ul>
    </div>
  );
};
