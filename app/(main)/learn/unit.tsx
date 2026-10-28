import Image from "next/image";
import { lessons, units } from "@/db/schema";

import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";
import { getUnitScenery } from "@/lib/theme-registry";

type Props = {
  id: number;
  order: number;
  title: string;
  description: string;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
  })[];
  activeLesson: typeof lessons.$inferSelect & {
    unit: typeof units.$inferSelect;
  } | undefined;
  activeLessonPercentage: number;
};

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: Props) => {
  const scenery = getUnitScenery(order);

  return (
    <>
      <UnitBanner order={order} title={title} description={description} />
      <div className="flex items-center flex-col relative py-2">
        {/* Thematic Path Scenery & Landmark Accents */}
        {scenery?.left && (
          <div
            className={`hidden md:flex flex-col items-center gap-1.5 absolute left-2 lg:left-6 ${scenery.left.topOffsetClass} z-0 pointer-events-none select-none`}
            aria-hidden="true"
          >
            <div className="relative group">
              {scenery.left.subImageSrc && (
                <div className="absolute -top-3 -left-3 w-12 h-12 opacity-40">
                  <Image
                    src={scenery.left.subImageSrc}
                    alt=""
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-2xl p-2.5 shadow-md border-2 border-slate-200/80 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition">
                <Image
                  src={scenery.left.imageSrc}
                  alt={scenery.left.alt}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100/90 text-slate-700 border border-slate-300 shadow-2xs">
              {scenery.left.badgeEmoji} {scenery.left.title}
            </span>
          </div>
        )}

        {scenery?.right && (
          <div
            className={`hidden md:flex flex-col items-center gap-1.5 absolute right-2 lg:right-6 ${scenery.right.topOffsetClass} z-0 pointer-events-none select-none`}
            aria-hidden="true"
          >
            <div className="relative group">
              {scenery.right.subImageSrc && (
                <div className="absolute -top-3 -right-3 w-12 h-12 opacity-40">
                  <Image
                    src={scenery.right.subImageSrc}
                    alt=""
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs rounded-2xl p-2.5 shadow-md border-2 border-slate-200/80 flex items-center justify-center transform rotate-3 hover:rotate-0 transition">
                <Image
                  src={scenery.right.imageSrc}
                  alt={scenery.right.alt}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100/90 text-slate-700 border border-slate-300 shadow-2xs">
              {scenery.right.badgeEmoji} {scenery.right.title}
            </span>
          </div>
        )}

        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
              unitOrder={order}
            />
          );
        })}
      </div>
    </>
  );
};
