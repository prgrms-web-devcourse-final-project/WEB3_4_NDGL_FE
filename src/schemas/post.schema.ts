import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(10, "내용은 최소 10자 이상 입력해주세요."),
  hashtags: z
    .array(
      z.object({
        name: z.string().min(1, "태그는 최소 1자 이상 입력해주세요."),
      })
    )
    .min(1, "하나 이상의 해시태그를 입력해주세요.")
    .max(10, "태그는 최대 10개입니다."),
  thumbnail: z.string().url("유효한 URL을 입력해주세요."),
});

export type PostSchemaType = z.infer<typeof postSchema>;
