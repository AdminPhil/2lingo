import { create } from "zustand";

type RoleModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useRoleModal = create<RoleModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
