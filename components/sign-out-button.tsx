"use client";

import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Props = {
  onAction?: () => void;
  className?: string;
};

export const SignOutButton = ({ onAction, className }: Props) => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    onAction?.();
    await signOut(() => router.push("/"));
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex items-center gap-x-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 transition py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer"
      title="Sign out of CroLingo"
    >
      <LogOut className="h-4 w-4 text-slate-500 hover:text-rose-600 transition" />
      <span>Sign Out</span>
    </button>
  );
};
