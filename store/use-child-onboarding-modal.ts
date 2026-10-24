import { create } from "zustand";

type ChildOnboardingModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useChildOnboardingModal = create<ChildOnboardingModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
