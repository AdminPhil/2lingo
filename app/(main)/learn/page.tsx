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
import { CheerBanner } from "@/components/cheer-banner";
import { ParentModeBanner } from "@/components/parent-mode-banner";
import { getUnseenCheers } from "@/db/queries";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const LearnPage = async ({ searchParams }: Props) => {
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
  if (searchParams?.intent === "parent" || searchParams?.role === "parent") {
    redirect("/welcome?role=parent");
  }
  if (searchParams?.role === "teacher") {
    redirect("/welcome?role=teacher");
  }

  const buildLearnRedirectUrl = () => {
    const params = new URLSearchParams();
    if (typeof searchParams?.intent === "string") {
      params.set("intent", searchParams.intent);
    }
    if (typeof searchParams?.join === "string") {
      params.set("join", searchParams.join);
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

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          streak={userProgress.streak}
          hasActiveSubscription={isPro}
        />
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {userProgress.role === "parent" && <ParentModeBanner />}
        <CheerBanner cheers={unseenCheers} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson as typeof lessons.$inferSelect & {
                unit: typeof unitsSchema.$inferSelect;
              } | undefined}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};
 
export default LearnPage;
