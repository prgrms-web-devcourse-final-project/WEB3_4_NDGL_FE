import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(10, '내용은 최소 10자 이상 입력해주세요.'),
  hashtags: z
    .string()
    .transform((val) => val.split(',').map((name) => name.trim())),
  locations: z.string().optional(),
  thumbnail: z.string().url('유효한 URL을 입력해주세요.'),
});
export type PostSchemaType = z.infer<typeof postSchema>;
