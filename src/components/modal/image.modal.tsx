import { useModalStore } from "@/store/useModalStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ImageUpload } from "../post/image-upload";
import { useState } from "react";
import { Button } from "../ui/button";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";

export const ImageModal = () => {
  const { open, onClose, type, data } = useModalStore();

  const [imageUrl, setImageUrl] = useState<string>("");

  const uploadHandler = () => {
    const editor = (data as { editor: Editor | null }).editor;
    if (editor && imageUrl !== "") {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      onClose();
    } else {
      toast.error("이미지를 업로드해주세요.");
      return;
    }
  };

  const isOpen = open && type === "image";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이미지 추가</DialogTitle>
        </DialogHeader>
        <ImageUpload
          setImageUrl={setImageUrl}
          tempId={(data as { tempId: number }).tempId}
        />
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onClose()}
          >
            닫기
          </Button>
          <Button className="cursor-pointer" onClick={uploadHandler}>
            업로드
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
