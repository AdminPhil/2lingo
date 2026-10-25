import { create } from "zustand";

type ProfileSwitcherModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useProfileSwitcherModal = create<ProfileSwitcherModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
