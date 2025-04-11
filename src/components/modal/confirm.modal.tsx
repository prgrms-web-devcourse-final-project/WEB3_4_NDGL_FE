import { useModalStore } from "@/store/useModalStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export const ConfirmModal = () => {
  const { open, onClose, type } = useModalStore();

  if (type !== "confirm") return null;

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>삭제 후 복구가 불가능합니다.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onClose(false)}
          >
            닫기
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => onClose(true)}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
