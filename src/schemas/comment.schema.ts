import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(2, "댓글은 최소 2자 이상이어야 합니다.")
    .max(100, "댓글은 최대 100자까지 가능합니다."),
});

export type CommentSchemaType = z.infer<typeof commentSchema>;
