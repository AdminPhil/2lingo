"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Sparkles, Ticket } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import { Button } from "@/components/ui/button";
import { POINTS_TO_REFILL, KID_REWARDS } from "@/constants";
import { refillHearts, redeemReward } from "@/actions/user-progress";
import { toggleKidsUnlimitedHearts } from "@/actions/user-subscription";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  hearts,
  points,
  hasActiveSubscription,
}: Props) => {
  const [pending, startTransition] = useTransition();
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
      return;
    }

    startTransition(() => {
      refillHearts()
        .then(() => toast.success("❤️ Hearts refilled!"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onToggleSuperStar = () => {
    startTransition(() => {
      toggleKidsUnlimitedHearts()
        .then(() => {
          if (!hasActiveSubscription) {
            toast.success("🌟 Super Star Mode enabled! Unlimited hearts active.");
          } else {
            toast.info("Standard hearts mode restored.");
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onRedeemReward = (cost: number, title: string) => {
    if (pending || points < cost) {
      return;
    }

    startTransition(() => {
      redeemReward(cost, title)
        .then(() => {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          toast.success(`🎉 You redeemed: "${title}"! Show this coupon to Mom or Dad!`, {
            duration: 6000,
          });
        })
        .catch(() => toast.error("Could not redeem reward. Try again!"));
    });
  };

  return (
    <div className="w-full space-y-6">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      {/* Heart Boosters */}
      <ul className="w-full">
        {/* Heart Refill */}
        <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
          <Image 
            src="/heart.svg"
            alt="Heart"
            height={60}
            width={60}
          />
          <div className="flex-1">
            <p className="text-neutral-700 text-base lg:text-xl font-bold">
              Refill hearts
            </p>
            <p className="text-neutral-500 text-xs lg:text-sm">
              Restore your hearts to full so you can keep practicing.
            </p>
          </div>
          <Button
            onClick={onRefillHearts}
            disabled={
              pending
              || hearts === 5 
              || points < POINTS_TO_REFILL
            }
          >
            {hearts === 5
              ? "Full"
              : (
                <div className="flex items-center">
                  <Image
                    src="/points.svg"
                    alt="Points"
                    height={20}
                    width={20}
                  />
                  <p className="ml-1">
                    {POINTS_TO_REFILL}
                  </p>
                </div>
              )
            }
          </Button>
        </div>

        {/* Super Star Kid Mode (Unlimited Hearts) */}
        <div className="flex items-center w-full p-4 pt-6 gap-x-4 border-t-2">
          <Image
            src="/unlimited.svg"
            alt="Unlimited"
            height={60}
            width={60}
          />
          <div className="flex-1">
            <div className="flex items-center gap-x-2">
              <p className="text-neutral-700 text-base lg:text-xl font-bold">
                Super Star Kid Mode
              </p>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-neutral-500 text-xs lg:text-sm">
              Unlimited hearts! Mistakes never stop you from learning.
            </p>
          </div>
          <Button
            onClick={onToggleSuperStar}
            disabled={pending}
            variant={hasActiveSubscription ? "secondary" : "super"}
          >
            {hasActiveSubscription ? "Active 🌟" : "Enable 🌟"}
          </Button>
        </div>
      </ul>

      {/* Parent Rewards & Fun Coupons */}
      <div className="pt-4">
        <div className="flex items-center gap-x-2 px-4 mb-2">
          <Ticket className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-extrabold text-neutral-800">
            Parent Reward Coupons
          </h2>
        </div>
        <p className="text-neutral-500 text-sm px-4 mb-4">
          Trade your earned XP for real-world fun rewards approved by Mom & Dad!
        </p>

        <ul className="w-full">
          {KID_REWARDS.map((reward) => {
            const canAfford = points >= reward.cost;

            return (
              <div
                key={reward.id}
                className="flex items-center w-full p-4 gap-x-4 border-t-2 hover:bg-neutral-50/50 transition rounded-xl"
              >
                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-2xl">
                  {reward.title.split(" ").slice(-1)[0]}
                </div>
                <div className="flex-1">
                  <p className="text-neutral-700 text-base lg:text-lg font-bold">
                    {reward.title}
                  </p>
                  <p className="text-neutral-500 text-xs lg:text-sm">
                    {reward.description}
                  </p>
                </div>
                <Button
                  onClick={() => onRedeemReward(reward.cost, reward.title)}
                  disabled={pending || !canAfford}
                  variant={canAfford ? "primary" : "secondary"}
                >
                  <div className="flex items-center">
                    <Image
                      src="/points.svg"
                      alt="Points"
                      height={20}
                      width={20}
                    />
                    <p className="ml-1">
                      {reward.cost} XP
                    </p>
                  </div>
                </Button>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
