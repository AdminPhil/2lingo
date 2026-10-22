import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getTodayCheeredUserIds, getTopTenUsers, getUnseenCheers, getUserPod, getUserProgress, getUserSubscription } from "@/db/queries";
import { CheerButton } from "@/components/cheer-button";
import { CheerBanner } from "@/components/cheer-banner";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Quests } from "@/components/quests";
import { PodHeader } from "@/components/pod-header";
import { PodCelebrationMeter } from "@/components/pod-celebration-meter";

const LeaderboardPage = async () => {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();
  const userPodData = getUserPod();
  const todayCheeredData = getTodayCheeredUserIds();
  const unseenCheersData = getUnseenCheers();

  const [
    userProgress,
    userSubscription,
    leaderboard,
    userPod,
    todayCheeredUserIds,
    unseenCheers,
  ] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
    userPodData,
    todayCheeredData,
    unseenCheersData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/learn");
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
        <div className="w-full flex flex-col items-center">
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among other young learners!
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          <CheerBanner cheers={unseenCheers} />
          <PodHeader 
            podName={userPod?.pod?.name} 
            inviteCode={userPod?.pod?.inviteCode} 
            memberCount={leaderboard.length} 
          />
          <PodCelebrationMeter
            podName={userPod?.pod?.name}
            currentXp={userPod?.pod?.currentXp ?? 740}
            targetXp={userPod?.pod?.targetXp ?? 1000}
            celebrationUnlocked={userPod?.pod?.celebrationUnlocked ?? false}
          />
          {leaderboard.map((user, index) => (
            <div 
              key={user.userId}
              className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
            >
              <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
              <Avatar
                className="border bg-green-500 h-12 w-12 ml-3 mr-6"
              >
                <AvatarImage
                  className="object-cover"
                  src={user.userImageSrc}
                />
              </Avatar>
              <div className="flex-1 flex flex-col justify-center">
                <p className="font-bold text-neutral-800">
                  {user.userName}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-x-1.5 mt-0.5">
                  <span className="flex items-center gap-x-1 text-amber-600 font-medium">
                    <span>🔥</span>
                    <span>{user.streak ?? 1} {(userProgress.streak ?? 1) === 1 ? "day" : "days"}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-x-1">
                    <span>💔</span>
                    <span>{user.heartsUsed ?? 0} hearts used</span>
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <CheerButton
                  receiverId={user.userId}
                  receiverName={user.userName}
                  isCurrentUser={user.userId === userProgress.userId}
                  hasCheeredToday={todayCheeredUserIds.includes(user.userId)}
                />
                <p className="text-muted-foreground font-semibold min-w-[65px] text-right">
                  {user.points} XP
                </p>
              </div>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};
 
export default LeaderboardPage;
