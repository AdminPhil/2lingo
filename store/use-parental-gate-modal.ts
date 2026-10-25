import { create } from "zustand";

type ParentalGateModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useParentalGateModal = create<ParentalGateModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
