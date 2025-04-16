import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePost } from "@/services/post.service";
import { CreatePostPayload } from "@/types/post.type";
import { QUERY_KEY } from "@/lib/query-key";
import { PostSchemaType } from "@/schemas/post.schema";

interface UsePostMutationProps {
  mode: string | null;
  postId: string;
  locations: any[];
  onSuccess: () => void;
}

export const usePostMutation = ({
  mode,
  postId,
  locations,
  onSuccess,
}: UsePostMutationProps) => {
  const queryClient = useQueryClient();

  const { mutate: submitPost, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: CreatePostPayload) => updatePost(postId, payload),
    onSuccess: () => {
      toast.success(
        mode === "edit"
          ? "게시글이 수정되었습니다."
          : "게시글이 생성되었습니다."
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.DEFAULT,
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.POPULAR,
        type: "all",
      });
      onSuccess();
    },
    onError: () => toast.error("게시글 저장에 실패하였습니다."),
  });

  const handleSubmit = (data: PostSchemaType) => {
    if (!locations.length) {
      toast.error("장소를 선택해주세요.");
      return;
    }
    submitPost({ ...data, locations });
  };

  return { submitPost: handleSubmit, isSubmitting };
};
