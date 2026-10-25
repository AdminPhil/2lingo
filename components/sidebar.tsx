import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

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
      <Link href={isAdmin ? "/admin" : "/learn"} className="group">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200/90 shadow-2xs transition-transform group-hover:scale-105 bg-white shrink-0">
            <Image
              src="/mascot.png"
              fill
              alt="Paško the Dalmatian"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-blue-900 tracking-tight leading-none">
              CroLingo
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 mt-1">
              Hrvatski 🇭🇷
            </span>
          </div>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        {isAdmin && (
          <SidebarItem 
            label="Parent Center" 
            href="/admin"
            iconSrc="/shield.svg"
          />
        )}
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
      </div>

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
