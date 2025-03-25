import { z } from 'zod';

export const authSchema = z.object({
  username: z.string().min(1, { message: '이름을 입력해주세요.' }),
  blogname: z.string().min(1, { message: '블로그 이름을 입력해주세요.' }),
  nickname: z.string().min(1, { message: '닉네임을 입력해주세요.' }),
});

export type AuthSchemaType = z.infer<typeof authSchema>;
