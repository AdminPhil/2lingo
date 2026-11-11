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
import { SwitchProfileButton } from "./switch-profile-button";
import { SignOutButton } from "./sign-out-button";

type Props = {
  className?: string;
  isAdmin?: boolean;
  onAction?: () => void;
};

export const Sidebar = ({ className, isAdmin, onAction }: Props) => {
  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
      className,
    )}>
      <Link href={isAdmin ? "/admin" : "/learn"} onClick={onAction} className="group">
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
            <span className="inline-flex items-center gap-x-1 text-[10px] font-black uppercase tracking-wider text-rose-600 mt-1">
              <svg width="10" height="10" viewBox="0 0 20 20" className="rounded-[2px] overflow-hidden border border-rose-200 shrink-0" aria-hidden="true">
                <rect width="20" height="20" fill="#FFFFFF" />
                <rect x="0" y="0" width="5" height="5" fill="#DC2626" />
                <rect x="10" y="0" width="5" height="5" fill="#DC2626" />
                <rect x="5" y="5" width="5" height="5" fill="#DC2626" />
                <rect x="15" y="5" width="5" height="5" fill="#DC2626" />
                <rect x="0" y="10" width="5" height="5" fill="#DC2626" />
                <rect x="10" y="10" width="5" height="5" fill="#DC2626" />
                <rect x="5" y="15" width="5" height="5" fill="#DC2626" />
                <rect x="15" y="15" width="5" height="5" fill="#DC2626" />
              </svg>
              <span>Hrvatski</span>
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
            onClick={onAction}
          />
        )}
        <SidebarItem 
          label="Learn" 
          href="/learn"
          iconSrc="/learn.svg"
          onClick={onAction}
        />
        <SidebarItem 
          label="Leaderboard" 
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
          onClick={onAction}
        />
        <SidebarItem 
          label="Quests" 
          href="/quests"
          iconSrc="/quests.svg"
          onClick={onAction}
        />
      </div>
      <div className="p-4 flex items-center justify-between border-t border-slate-100 gap-x-2">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <div className="flex items-center gap-x-1 sm:gap-x-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopoverCard: "z-[150] shadow-xl",
                  userButtonPopoverRoot: "z-[150]",
                },
              }}
            />
            <SignOutButton onAction={onAction} />
          </div>
          <SwitchProfileButton onAction={onAction} />
        </ClerkLoaded>
      </div>
    </div>
  );
};
