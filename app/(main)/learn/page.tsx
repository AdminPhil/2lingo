import { redirect } from "next/navigation";

import { Quests } from "@/components/quests";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { lessons, units as unitsSchema } from "@/db/schema";
import { 
  getCourseProgress, 
  getLessonPercentage, 
  getUnits, 
  getUserProgress,
  getUserSubscription
} from "@/db/queries";
import { provisionDefaultLearnerProgress } from "@/actions/user-progress";

import { Unit } from "./unit";
import { Header } from "./header";
import { WorldNavigator } from "./world-navigator";
import { LevelMilestoneGateway } from "./level-milestone-gateway";
import { CheerBanner } from "@/components/cheer-banner";
import { ParentModeBanner } from "@/components/parent-mode-banner";
import { getLevelForUnitOrder, getUnitRangeForLevel } from "@/lib/v2/lesson-helpers";
import { getUnseenCheers } from "@/db/queries";

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

const LearnPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const userSubscriptionData = getUserSubscription();
  const unseenCheersData = getUnseenCheers();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
    unseenCheers,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData,
    unseenCheersData,
  ]);

  // Backward compatibility & direct routing for Parent / Teacher Onboarding
  if (resolvedSearchParams?.intent === "parent" || resolvedSearchParams?.role === "parent") {
    redirect("/welcome?role=parent");
  }
  if (resolvedSearchParams?.role === "teacher") {
    redirect("/welcome?role=teacher");
  }

  const buildLearnRedirectUrl = () => {
    const params = new URLSearchParams();
    if (typeof resolvedSearchParams?.intent === "string") {
      params.set("intent", resolvedSearchParams.intent);
    }
    if (typeof resolvedSearchParams?.join === "string") {
      params.set("join", resolvedSearchParams.join);
    }
    const qs = params.toString();
    return qs ? `/learn?${qs}` : "/learn";
  };

  if (!userProgress || !userProgress.activeCourse) {
    await provisionDefaultLearnerProgress(1);
    redirect(buildLearnRedirectUrl());
  }

  if (!courseProgress) {
    redirect(buildLearnRedirectUrl());
  }

  const isPro = !!userSubscription?.isActive;

  const activeUnitOrder =
    (courseProgress.activeLesson as { unit?: { order?: number } })?.unit?.order ?? 1;
  const maxAvailableLevel = Math.max(
    1,
    ...units.map((u) => getLevelForUnitOrder(u.order))
  );
  const requestedLevelRaw = Number(resolvedSearchParams?.level);
  const selectedLevel =
    Number.isInteger(requestedLevelRaw) &&
    requestedLevelRaw >= 1 &&
    requestedLevelRaw <= maxAvailableLevel
      ? requestedLevelRaw
      : getLevelForUnitOrder(activeUnitOrder);

  const [levelStartUnit, levelEndUnit] = getUnitRangeForLevel(selectedLevel);
  const visibleUnits = units.filter(
    (u) => u.order >= levelStartUnit && u.order <= levelEndUnit
  );

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          streak={userProgress.streak}
          hasActiveSubscription={isPro}
          userImageSrc={userProgress.userImageSrc}
          userName={userProgress.userName}
        />
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {userProgress.role === "parent" && <ParentModeBanner />}
        <CheerBanner cheers={unseenCheers} />
        <WorldNavigator
          activeUnitOrder={activeUnitOrder}
          selectedLevel={selectedLevel}
        />
        {selectedLevel > 1 && visibleUnits.length > 0 && (
          <div className="mb-8">
            <LevelMilestoneGateway level={selectedLevel === 2 ? 2 : 3} />
          </div>
        )}
        {visibleUnits.map((unit) => (
          <div key={unit.id} id={`unit-${unit.order}`} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={
                courseProgress.activeLesson as
                  | (typeof lessons.$inferSelect & {
                      unit: typeof unitsSchema.$inferSelect;
                    })
                  | undefined
              }
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};
 
export default LearnPage;
