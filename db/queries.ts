import { cache } from "react";
import { and, eq, gte, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

import db from "@/db/drizzle";
import { shuffleArray } from "@/lib/utils";
import { 
  challengeProgress,
  challengeMistakes,
  challengeOptions,
  challenges,
  courses, 
  lessons, 
  units, 
  userProgress,
  userSubscription,
  podMembers,
  pods,
  podReactions
} from "@/db/schema";

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });

  return data;
});

export const getUnits = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(
                  challengeProgress.userId,
                  userId,
                ),
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (
        lesson.challenges.length === 0
      ) {
        return { ...lesson, completed: false };
      }

      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return challenge.challengeProgress
          && challenge.challengeProgress.length > 0
          && challenge.challengeProgress.every((progress) => progress.completed);
      });

      return { ...lesson, completed: allCompletedChallenges };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lessons, { asc }) => [asc(lessons.order)],
          },
        },
      },
    },
  });

  return data;
});

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return null;
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
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

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return !challenge.challengeProgress 
          || challenge.challengeProgress.length === 0 
          || challenge.challengeProgress.some((progress) => progress.completed === false)
      });
    });

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const courseProgress = await getCourseProgress();

  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) {
    return null;
  }

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) {
    return null;
  }

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed = challenge.challengeProgress 
      && challenge.challengeProgress.length > 0
      && challenge.challengeProgress.every((progress) => progress.completed)

    return { 
      ...challenge, 
      completed,
      challengeOptions: challenge.challengeOptions 
        ? shuffleArray(challenge.challengeOptions) 
        : [],
    };
  });

  return { ...data, challenges: normalizedChallenges }
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) {
    return 0;
  }

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) {
    return 0;
  }

  const completedChallenges = lesson.challenges
    .filter((challenge) => challenge.completed);
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100,
  );

  return percentage;
});

const DAY_IN_MS = 86_400_000;
export const getUserSubscription = cache(async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!data) return null;

  const isActive = 
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return {
    ...data,
    isActive: !!isActive,
  };
});

export const getTopTenUsers = cache(async (activePodId?: number) => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  let targetPodId = activePodId;

  if (!targetPodId) {
    // Relational scoping: Find user's active pod
    const userMembership = await db.query.podMembers.findFirst({
      where: eq(podMembers.userId, userId),
    });
    targetPodId = userMembership ? userMembership.podId : 1;
  }

  const members = await db.query.podMembers.findMany({
    where: eq(podMembers.podId, targetPodId),
  });

  // Exclude pod owners/parents from student leaderboard ranking (unless only owners exist)
  let memberUserIds = members.filter((m) => m.role !== "owner").map((m) => m.userId);
  if (memberUserIds.length === 0) {
    memberUserIds = members.map((m) => m.userId);
  }

  if (memberUserIds.length === 0) {
    return [];
  }

  const data = await db.query.userProgress.findMany({
    where: inArray(userProgress.userId, memberUserIds),
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
      heartsUsed: true,
      streak: true,
    },
  });

  return data;
});

export const getUserPods = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const memberships = await db.query.podMembers.findMany({
    where: eq(podMembers.userId, userId),
    with: {
      pod: {
        with: {
          members: true,
        },
      },
    },
    orderBy: (podMembers, { asc }) => [asc(podMembers.id)],
  });

  return memberships
    .filter((m) => !!m.pod)
    .map((m) => ({
      pod: m.pod,
      role: m.role,
      memberCount: m.pod.members.length,
    }));
});

export const getUserPod = cache(async (activePodId?: number) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  if (activePodId) {
    const specificPod = await db.query.pods.findFirst({
      where: eq(pods.id, activePodId),
      with: {
        members: true,
      },
    });

    if (specificPod) {
      const membership = specificPod.members.find((m) => m.userId === userId);
      return {
        pod: specificPod,
        role: membership?.role || "guest",
      };
    }
  }

  const membership = await db.query.podMembers.findFirst({
    where: eq(podMembers.userId, userId),
    with: {
      pod: true,
    },
  });

  if (membership?.pod) {
    return {
      pod: membership.pod,
      role: membership.role,
    };
  }

  const defaultPod = await db.query.pods.findFirst({
    where: eq(pods.id, 1),
  });

  return defaultPod ? { pod: defaultPod, role: "guest" } : null;
});

export const getPracticeLesson = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Find challenges completed by this user
  const completedProgress = await db.query.challengeProgress.findMany({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.completed, true),
    ),
    columns: { challengeId: true },
  });

  const completedIds = Array.from(new Set(completedProgress.map((p) => p.challengeId)));
  let selectedIds: number[] = [];

  if (completedIds.length >= 3) {
    selectedIds = shuffleArray(completedIds).slice(0, 3);
  } else if (completedIds.length > 0) {
    selectedIds = [...completedIds];
  }

  // If fewer than 3, backfill from early Unit 1 beginner challenges
  if (selectedIds.length < 3) {
    const starterChallenges = await db.query.challenges.findMany({
      orderBy: (challenges, { asc }) => [asc(challenges.id)],
      limit: 6,
      columns: { id: true },
    });
    for (const sc of starterChallenges) {
      if (!selectedIds.includes(sc.id) && selectedIds.length < 3) {
        selectedIds.push(sc.id);
      }
    }
  }

  const challengesData = await db.query.challenges.findMany({
    where: inArray(challenges.id, selectedIds),
    with: {
      challengeOptions: true,
    },
  });

  const normalizedChallenges = challengesData.map((challenge) => ({
    ...challenge,
    completed: true,
  }));

  return normalizedChallenges;
});

export const getUnseenCheers = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const cheers = await db.query.podReactions.findMany({
    where: and(
      eq(podReactions.receiverId, userId),
      eq(podReactions.seen, false),
    ),
    orderBy: (podReactions, { desc }) => [desc(podReactions.createdAt)],
  });

  return cheers;
});

export const getTodayCheeredUserIds = cache(async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const cheers = await db.query.podReactions.findMany({
    where: and(
      eq(podReactions.senderId, userId),
      gte(podReactions.createdAt, startOfToday),
    ),
    columns: {
      receiverId: true,
    },
  });

  return cheers.map((c) => c.receiverId);
});

export type TrickyWordItem = {
  challengeId: number;
  question: string;
  word: string;
  unitOrder: number;
  unitTitle: string;
  missCount: number;
  correctAnswer: string;
  commonDistractor: string;
  accuracyRate: number;
};

export type UnitMasteryItem = {
  unitId: number;
  unitOrder: number;
  title: string;
  description: string;
  completedCount: number;
  mistakeCount: number;
  accuracyRate: number;
  status: "Mastered" | "Solid" | "Needs Practice" | "Upcoming";
};

export type ConversationPromptItem = {
  id: number;
  theme: string;
  timing: string;
  croatian: string;
  english: string;
  targetWords: string;
  parentTip: string;
};

export type TrickyWordsAnalytics = {
  topTrickyWords: TrickyWordItem[];
  unitMasteries: UnitMasteryItem[];
  conversationPrompts: ConversationPromptItem[];
  totalMistakes: number;
  totalCompleted: number;
  overallAccuracyRate: number;
};

export const getTrickyWordsAnalytics = cache(async (): Promise<TrickyWordsAnalytics> => {
  // 1. Fetch all challenge mistakes with challenge, options, and lesson/unit relations
  const mistakes = await db.query.challengeMistakes.findMany({
    with: {
      challenge: {
        with: {
          lesson: {
            with: {
              unit: true,
            },
          },
          challengeOptions: true,
        },
      },
      selectedOption: true,
    },
    orderBy: (challengeMistakes, { desc }) => [desc(challengeMistakes.createdAt)],
  });

  // 2. Fetch all completed challenge progress records
  const completedProgress = await db.query.challengeProgress.findMany({
    where: eq(challengeProgress.completed, true),
  });

  const completionsPerChallenge = new Map<number, number>();
  for (const cp of completedProgress) {
    completionsPerChallenge.set(cp.challengeId, (completionsPerChallenge.get(cp.challengeId) || 0) + 1);
  }

  // 3. Aggregate mistakes by challengeId
  type ChallengeAggregation = {
    challengeId: number;
    challenge: (typeof mistakes)[0]["challenge"];
    missCount: number;
    distractorCounts: Map<string, number>;
  };

  const aggregationMap = new Map<number, ChallengeAggregation>();

  for (const m of mistakes) {
    if (!m.challenge) continue;
    let entry = aggregationMap.get(m.challengeId);
    if (!entry) {
      entry = {
        challengeId: m.challengeId,
        challenge: m.challenge,
        missCount: 0,
        distractorCounts: new Map<string, number>(),
      };
      aggregationMap.set(m.challengeId, entry);
    }
    entry.missCount += 1;
    if (m.selectedOption?.text) {
      const dist = m.selectedOption.text;
      entry.distractorCounts.set(dist, (entry.distractorCounts.get(dist) || 0) + 1);
    }
  }

  const topTrickyWords: TrickyWordItem[] = Array.from(aggregationMap.values())
    .map((agg) => {
      const correctOpt = agg.challenge.challengeOptions.find((o) => o.correct);
      const correctAnswer = correctOpt?.text || "Correct Answer";
      
      // Find most common distractor
      let mostCommonDistractor = "";
      let highestDistCount = 0;
      agg.distractorCounts.forEach((count, dist) => {
        if (count > highestDistCount) {
          highestDistCount = count;
          mostCommonDistractor = dist;
        }
      });
      if (!mostCommonDistractor) {
        const fallbackDist = agg.challenge.challengeOptions.find((o) => !o.correct);
        mostCommonDistractor = fallbackDist?.text || "Distractor";
      }

      const completedCount = completionsPerChallenge.get(agg.challengeId) || 0;
      const totalAttempts = completedCount + agg.missCount;
      const accuracyRate = totalAttempts > 0 
        ? Math.round((completedCount / totalAttempts) * 100) 
        : 50;

      const unitOrder = agg.challenge.lesson?.unit?.order ?? 1;
      const unitTitle = agg.challenge.lesson?.unit?.title ?? "Unit 1";

      return {
        challengeId: agg.challengeId,
        question: agg.challenge.question,
        word: correctAnswer,
        unitOrder,
        unitTitle,
        missCount: agg.missCount,
        correctAnswer,
        commonDistractor: mostCommonDistractor,
        accuracyRate,
      };
    })
    .sort((a, b) => b.missCount - a.missCount)
    .slice(0, 10);

  // 4. Calculate Unit Masteries across all units
  const allUnits = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    with: {
      lessons: {
        with: {
          challenges: true,
        },
      },
    },
  });

  const mistakesPerUnit = new Map<number, number>();
  for (const m of mistakes) {
    const unitId = m.challenge?.lesson?.unit?.id;
    if (unitId) {
      mistakesPerUnit.set(unitId, (mistakesPerUnit.get(unitId) || 0) + 1);
    }
  }

  // Pre-index completions by unit
  const completionsPerUnit = new Map<number, number>();
  const challengeToUnitMap = new Map<number, number>();
  for (const u of allUnits) {
    for (const l of u.lessons) {
      for (const c of l.challenges) {
        challengeToUnitMap.set(c.id, u.id);
      }
    }
  }

  for (const cp of completedProgress) {
    const unitId = challengeToUnitMap.get(cp.challengeId);
    if (unitId) {
      completionsPerUnit.set(unitId, (completionsPerUnit.get(unitId) || 0) + 1);
    }
  }

  const unitMasteries: UnitMasteryItem[] = allUnits.map((u) => {
    const completedCount = completionsPerUnit.get(u.id) || 0;
    const mistakeCount = mistakesPerUnit.get(u.id) || 0;
    const total = completedCount + mistakeCount;

    let accuracyRate = 100;
    let status: UnitMasteryItem["status"] = "Upcoming";

    if (total > 0) {
      accuracyRate = Math.round((completedCount / total) * 100);
      if (accuracyRate >= 90) {
        status = "Mastered";
      } else if (accuracyRate >= 75) {
        status = "Solid";
      } else {
        status = "Needs Practice";
      }
    }

    return {
      unitId: u.id,
      unitOrder: u.order,
      title: u.title,
      description: u.description,
      completedCount,
      mistakeCount,
      accuracyRate,
      status,
    };
  });

  // 5. Actionable Family Conversation Prompts
  const conversationPrompts: ConversationPromptItem[] = [
    {
      id: 1,
      theme: "Morning Greetings & Courtesy",
      timing: "Breakfast or School Drop-Off",
      croatian: "Dobar dan! Kako si danas?",
      english: "Good day! How are you today?",
      targetWords: "Dobar dan vs Laku noć • Dobro sam",
      parentTip: "Greet the girls in Croatian first thing in the morning. When they answer 'Dobro sam!' (I am good!), give them a high-five!",
    },
    {
      id: 2,
      theme: "Dinner Table Etiquette",
      timing: "Family Dinner",
      croatian: "Molim te, dodaj mi kruh. Hvala lijepa!",
      english: "Please pass the bread. Thank you very much!",
      targetWords: "Molim (Please) vs Hvala (Thank you) • Kruh (Bread)",
      parentTip: "Challenge the sisters to use 'Molim te' whenever asking for food at dinner, and reply with 'Izvoli' (Here you go) and 'Hvala'!",
    },
    {
      id: 3,
      theme: "Playful Animal Riddle",
      timing: "Car Rides or Walk in the Park",
      croatian: "Tko kaže vau-vau, a tko spava na suncu i kaže mijau?",
      english: "Who says woof-woof, and who sleeps in the sun and says meow?",
      targetWords: "Pas (Dog) vs Mačka (Cat)",
      parentTip: "Spot animals out the car window and ask in Croatian: 'Je li to pas ili mačka?' (Is that a dog or a cat?)",
    },
  ];

  const totalMistakes = mistakes.length;
  const totalCompleted = completedProgress.length;
  const overallAccuracyRate = (totalCompleted + totalMistakes) > 0
    ? Math.round((totalCompleted / (totalCompleted + totalMistakes)) * 100)
    : 100;

  return {
    topTrickyWords,
    unitMasteries,
    conversationPrompts,
    totalMistakes,
    totalCompleted,
    overallAccuracyRate,
  };
});
