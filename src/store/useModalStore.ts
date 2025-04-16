import { create } from "zustand";

type ModalType = "confirm" | "report" | "image";

type ModalStoreType = {
  type: ModalType | null;
  open: boolean;
  data: unknown | null;
  onOpen: (type: ModalType, data?: unknown | null) => Promise<boolean>;
  onClose: (confirmed?: boolean) => void;
  resolve?: (value: boolean) => void;
};

export const useModalStore = create<ModalStoreType>((set, get) => ({
  type: null,
  open: false,
  resolve: undefined,
  data: null,
  onOpen: (type, data) => {
    set({ data, type, open: true });
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
