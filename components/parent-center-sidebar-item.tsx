"use client";

import { useParentalGateModal } from "@/store/use-parental-gate-modal";
import { SidebarItem } from "./sidebar-item";

export const ParentCenterSidebarItem = () => {
  const { open } = useParentalGateModal();

  return (
    <SidebarItem
      label="Parent Center"
      href="/admin"
      iconSrc="/shield.svg"
      onClick={open}
    />
  );
};
