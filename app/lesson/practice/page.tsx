import { redirect } from "next/navigation";

import { getPracticeLesson, getUserProgress, getUserSubscription } from "@/db/queries";
import { PracticeQuiz } from "./practice-quiz";

const PracticePage = async () => {
  const practiceChallengesData = getPracticeLesson();
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [
    challenges,
    userProgress,
    userSubscription,
  ] = await Promise.all([
    practiceChallengesData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!challenges || !userProgress) {
    redirect("/learn");
  }

  return (
    <PracticeQuiz
      initialChallenges={challenges as any}
      initialHearts={userProgress.hearts}
      userSubscription={userSubscription}
    />
  );
};

export default PracticePage;
