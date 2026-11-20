import { redirect } from "next/navigation";

import { getLesson, getUserProgress } from "@/db/queries";
import { isSuperIzazovLesson } from "@/lib/v2/lesson-helpers";
import { LessonQuizClient } from "@/features/quiz/lesson-quiz-client";

type Props = {
  params: Promise<{
    lessonId: string;
  }>;
};

const LessonIdPage = async ({ params }: Props) => {
  const { lessonId } = await params;
  const [lesson, userProgress] = await Promise.all([
    getLesson(Number(lessonId)),
    getUserProgress(),
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage =
    lesson.challenges.length > 0
      ? (lesson.challenges.filter((challenge) => challenge.completed).length /
          lesson.challenges.length) *
        100
      : 0;

  const isSuperIzazov = isSuperIzazovLesson(lesson, lesson.order >= 5 ? 5 : 4);

  return (
    <LessonQuizClient
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      isSuperIzazov={isSuperIzazov}
      lessonOrder={lesson.order}
    />
  );
};

export default LessonIdPage;
