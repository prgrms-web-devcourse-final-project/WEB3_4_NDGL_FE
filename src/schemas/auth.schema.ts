import { noSpecialCharsRegex } from '@/lib/validation';
import { z } from 'zod';

export const authSchema = z.object({
  nickName: z
    .string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
    .max(15, '닉네임은 최대 15자까지 가능합니다.')
    .regex(noSpecialCharsRegex, '닉네임에는 특수문자를 사용할 수 없습니다.'),

  blogName: z
    .string()
    .min(2, '블로그 이름은 최소 2자 이상이어야 합니다.')
    .max(20, '블로그 이름은 최대 20자까지 가능합니다.')
    .regex(
      noSpecialCharsRegex,
      '블로그 이름에는 특수문자를 사용할 수 없습니다.',
    ),
});

export type AuthSchemaType = z.infer<typeof authSchema>;
