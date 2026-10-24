import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
  isAdmin?: boolean;
};

export const Sidebar = ({ className, isAdmin }: Props) => {
  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
      className,
    )}>
      <Link href={isAdmin ? "/admin" : "/learn"}>
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            2lingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem 
          label="Learn" 
          href="/learn"
          iconSrc="/learn.svg"
        />
        <SidebarItem 
          label="Leaderboard" 
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem 
          label="Quests" 
          href="/quests"
          iconSrc="/quests.svg"
        />
        {isAdmin && (
          <SidebarItem 
            label="Parent Center" 
            href="/admin"
            iconSrc="/shield.svg"
          />
        )}
      </div>

      {isAdmin && (
        <div className="px-1 pb-2">
          <Button
            variant="secondary"
            className="w-full justify-start h-10 px-3 text-xs font-black tracking-wide border-2 border-green-400/80 bg-green-100 hover:bg-green-200 text-green-800 shadow-xs"
            asChild
          >
            <Link href="/admin">
              <ShieldCheck className="h-4 w-4 mr-2 text-green-700 shrink-0" />
              Parent Center
            </Link>
          </Button>
        </div>
      )}

      <div className="p-4 border-t border-slate-100">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};
