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
      <ul className="w-full space-y-4">
        {displayedQuests.map((quest) => {
          const progress = Math.min((points / quest.value) * 100, 100);

          return (
            <div
              className="flex items-center w-full pb-4 gap-x-3"
              key={quest.title}
            >
              <Image
                src="/points.svg"
                alt="Points"
                width={40}
                height={40}
              />
              <div className="flex flex-col gap-y-2 w-full">
                <p className="text-neutral-700 text-sm font-bold">
                  {quest.title}
                </p>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )
        })}
      </ul>
    </div>
  );
};
