import { ConfirmModal } from "@/components/modal/confirm.modal";
import { useModalStore } from "@/store/useModalStore";

export const ModalProvider = () => {
  const { open, type } = useModalStore();

  if (!type || !open) {
    return null;
  }

  return <>{type === "confirm" ? <ConfirmModal /> : null}</>;
};
