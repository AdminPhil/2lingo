import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Promo = () => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Image
            src="/unlimited.svg"
            alt="Rewards"
            height={26}
            width={26}
          />
          <h3 className="font-bold text-lg text-neutral-800">
            Super Star Rewards 🌟
          </h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Earn XP to unlock unlimited hearts and fun parent coupons!
        </p>
      </div>
      <Button
        asChild
        variant="super"
        className="w-full"
        size="lg"
      >
        <Link href="/shop">
          Visit Reward Shop
        </Link>
      </Button>
    </div>
  );
};
