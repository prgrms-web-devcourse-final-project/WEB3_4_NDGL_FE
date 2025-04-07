import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/services/comment.service";
import { QUERY_KEY } from "@/lib/query-key";
import { useParams } from "react-router";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { commentSchema, CommentSchemaType } from "@/schemas/comment.schema";

interface CreateCommentProps {
  parentId?: number | null;
}

export const CreateComment = ({ parentId = null }: CreateCommentProps) => {
  const params = useParams<{ postId: string }>();
  const postId = params.postId || "";

  const queryClient = useQueryClient();

  const form = useForm<CommentSchemaType>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const { mutate: createCommentMutation, isPending } = useMutation({
    mutationFn: (values: CommentSchemaType) =>
      createComment(postId, { content: values.content, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.COMMENT.ALL(postId),
      });
      form.reset();
      toast.success("댓글이 성공적으로 추가되었습니다.");
    },
    onError: () => {
      toast.error("댓글을 작성하는 중 오류가 발생했습니다.");
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-2 p-4 border-t dark:border-gray-700"
    >
      <div className="flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              createCommentMutation(values)
            )}
            className="flex flex-col space-y-2 gap-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="댓글을 작성하세요..."
                      className="resize-none bg-transparent border-none focus:ring-0 shadow-none text-sm dark:text-gray-300"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-full px-4 gap-1 cursor-pointer"
              >
                <Send size={16} /> 전송
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};
