import { ConfirmModal } from "@/components/modal/confirm.modal";
import { ImageModal } from "@/components/modal/image.modal";
import { ReportModal } from "@/components/modal/report.modal";
import { useModalStore } from "@/store/useModalStore";

export const ModalProvider = () => {
  const { open, type } = useModalStore();

  if (!type || !open) {
    return null;
  }

  return (
    <>
      {type === "confirm" ? <ConfirmModal /> : null}
      {type === "report" ? <ReportModal /> : null}
      {type === "image" ? <ImageModal /> : null}
    </>
  );
};
