import { create } from "zustand";

type HeartsModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  onRefillCallback?: () => void;
  setOnRefillCallback: (callback?: () => void) => void;
};

export const useHeartsModal = create<HeartsModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  onRefillCallback: undefined,
  setOnRefillCallback: (callback) => set({ onRefillCallback: callback }),
}));
