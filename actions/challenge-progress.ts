"use server";

import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { calculateStreak } from "@/lib/streak";
import { awardPodXp } from "@/actions/pod";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized"); 
  }

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
    with: {
      lesson: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const lesson = challenge.lesson;
  const lessonId = challenge.lessonId;

  // Determine if this lesson is a Super Izazov (Lesson 4 of unit or titled Super Izazov)
  const isSuperIzazov = lesson 
    ? (lesson.order === 4 || lesson.title.toLowerCase().includes("super izazov")) 
    : false;

  // Check if all other challenges in this lesson have already been completed
  const allOtherChallengesCompleted = lesson
    ? lesson.challenges
        .filter((c) => c.id !== challengeId)
        .every((c) => c.challengeProgress && c.challengeProgress.some((cp) => cp.completed))
    : false;

  const isLessonCompletingNow = allOtherChallengesCompleted;

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId),
    ),
  });

  const isPractice = !!existingChallengeProgress;
  const { streak, lastActiveDate } = calculateStreak(
    currentUserProgress.streak,
    currentUserProgress.lastActiveDate,
  );

  if (
    currentUserProgress.hearts === 0 && 
    !isPractice && 
    !userSubscription?.isActive
  ) {
    return { error: "hearts" };
  }

  // Handle Practice Mode (Review or Replay)
  if (isPractice) {
    await db.update(challengeProgress).set({
      completed: true,
    })
    .where(
      eq(challengeProgress.id, existingChallengeProgress.id)
    );

    // If completing the Super Izazov or practice, award heart up to 5
    const practiceNewHearts = Math.min(currentUserProgress.hearts + 1, 5);
    const heartsAwarded = practiceNewHearts > currentUserProgress.hearts;

    await db.update(userProgress).set({
      hearts: practiceNewHearts,
      points: currentUserProgress.points + 10,
      streak,
      lastActiveDate,
    }).where(eq(userProgress.userId, userId));

    await awardPodXp(userId, 10);

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
    return {
      isSuperIzazovCompleted: isLessonCompletingNow && isSuperIzazov,
      heartsAwarded,
      newHearts: practiceNewHearts,
    };
  }

  // Normal (First-Time) Completion Mode
  let heartsAwarded = false;
  let newHearts = currentUserProgress.hearts;

  // CR-029: Each Super Izazov earns the user a new heart (+1 ❤️ up to 5)
  if (isLessonCompletingNow && isSuperIzazov) {
    if (currentUserProgress.hearts < 5) {
      newHearts = currentUserProgress.hearts + 1;
      heartsAwarded = true;
    }
  }

  await db.insert(challengeProgress).values({
    challengeId,
    userId,
    completed: true,
  });

  await db.update(userProgress).set({
    points: currentUserProgress.points + 10,
    hearts: newHearts,
    streak,
    lastActiveDate,
  }).where(eq(userProgress.userId, userId));

  await awardPodXp(userId, 10);

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);

  return {
    isSuperIzazovCompleted: isLessonCompletingNow && isSuperIzazov,
    heartsAwarded,
    newHearts,
  };
};
