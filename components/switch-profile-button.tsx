"use client";

import { Users } from "lucide-react";
import { useProfileSwitcherModal } from "@/store/use-profile-switcher-modal";

type Props = {
  onAction?: () => void;
  className?: string;
};

export const SwitchProfileButton = ({ onAction, className }: Props) => {
  const { open } = useProfileSwitcherModal();

  const handleClick = () => {
    onAction?.();
    open();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-x-1.5 text-xs font-bold text-slate-500 hover:text-blue-900 transition py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer"
      title="Switch active learner on this device"
    >
      <Users className="h-4 w-4 text-blue-900" />
      <span>Switch Profile</span>
    </button>
  );
};
