import { createImageUrl, uploadComplate } from "@/services/image.service";
import { toast } from "sonner";
import { FileUpload } from "../ui/file-upload";

export const ImageUpload = ({
  tempId,
  setImageUrl,
}: {
  tempId: number | null | undefined;
  setImageUrl: (imageUrl: string) => void;
}) => {
  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const imageExtensions = [
      file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1],
    ];

    try {
      if (!tempId) {
        toast.error("임시저장을 먼저 진행해주세요.");
        return;
      }
      const { data } = await createImageUrl({
        referenceId: tempId,
        imageUsage: "POST",
        imageExtensions,
      });

      const presignedUrl = data.data.presignedUrls;

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      const imageUrl = presignedUrl[0]?.split("?")[0];

      await uploadComplate({
        referenceId: tempId,
        imageUsage: "POST",
        imageUrls: [imageUrl],
      });

      setImageUrl(imageUrl);
      toast.success("이미지가 성공적으로 업로드되었습니다.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "이미지 업로드에 실패했습니다.");
    }
  };

  return <FileUpload onChange={handleFileUpload} />;
};
