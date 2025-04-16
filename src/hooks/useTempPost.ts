import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTempPost, updateTempPost } from "@/services/post.service";
import { CreatePostPayload, LocationType } from "@/types/post.type";
import { QUERY_KEY } from "@/lib/query-key";
import { UseFormReturn } from "react-hook-form";
import { PostSchemaType } from "@/schemas/post.schema";

interface UseTempPostProps {
  form: UseFormReturn<PostSchemaType>;
  setLocations: (locations: any[]) => void;
  mode: string | null;
  locations: LocationType[];
  postId: string | null;
}

export const useTempPost = ({
  form,
  setLocations,
  locations,
  postId,
  mode,
}: UseTempPostProps) => {
  const queryClient = useQueryClient();

  const { data: tempPost } = useQuery({
    queryKey: QUERY_KEY.POST.TEMP,
    queryFn: () => createTempPost(),
    select: (res) => res.data.data,
  });

  const { mutate: createTemp } = useMutation({
    mutationFn: (payload: CreatePostPayload) =>
      updateTempPost(
        mode === "edit" ? postId ?? "" : tempPost?.id?.toString() ?? "",
        payload
      ),
    onSuccess: () => {
      toast.success("임시저장되었습니다.");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.POST.TEMP,
        type: "all",
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("임시저장 생성에 실패하였습니다.");
    },
  });

  const handleTempLoad = () => {
    if (!tempPost) {
      toast.error("불러올 임시저장 데이터가 없습니다.");
      return;
    }

    form.reset({
      title: tempPost.title,
      content: tempPost.content,
      hashtags: tempPost.hashtags,
      thumbnail: tempPost.thumbnail,
    });
    setLocations(tempPost.locations);
    toast.success("임시저장 불러오기 완료");
  };

  const handleTempSave = () => {
    createTemp({ ...form.getValues(), locations });
  };

  return { tempPost, handleTempLoad, handleTempSave, tempId: tempPost?.id };
};
