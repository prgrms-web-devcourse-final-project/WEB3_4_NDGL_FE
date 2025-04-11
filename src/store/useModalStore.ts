import { create } from "zustand";

type ModalType = "confirm";

type ModalStoreType = {
  type: ModalType | null;
  open: boolean;
  onOpen: (type: ModalType) => Promise<boolean>;
  onClose: (confirmed?: boolean) => void;
  resolve?: (value: boolean) => void;
};

export const useModalStore = create<ModalStoreType>((set, get) => ({
  type: null,
  open: false,
  resolve: undefined,

  onOpen: (type) => {
    set({ type, open: true });
    return new Promise<boolean>((resolve) => {
      set({ resolve });
    });
  },

  onClose: (confirmed = false) => {
    const { resolve } = get();
    if (resolve) {
      resolve(confirmed);
    }
    set({ open: false, type: null, resolve: undefined });
  },
}));
