'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, type AuthSchemaType } from '@/schemas/auth.schema';
import { cn } from '@/lib/utils';
import { AnimInput } from '../ui/anim-input';
import { AnimLabel } from '../ui/anim-label';
import { Button } from '../ui/button';
import { GoogleIcon } from '../ui/icons';

export const AuthForm = () => {
  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      nickname: '',
      blogname: '',
    },
  });

  const submitHandler = (values: AuthSchemaType) => {
    console.log(values);
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to 어디갔대?
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        미디어에 나온 유명 장소 정보 공유 플랫폼
      </p>
      <Form {...form}>
        <form className="my-8" onSubmit={form.handleSubmit(submitHandler)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer className="mb-4">
                  <AnimLabel>이름</AnimLabel>
                  <FormControl>
                    <AnimInput {...field} placeholder="이름을 입력해주세요." />
                  </FormControl>
                  <FormMessage />
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="blogname"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer className="mb-4">
                  <AnimLabel>블로그명</AnimLabel>
                  <FormControl>
                    <AnimInput
                      {...field}
                      placeholder="블로그 이름을 입력해주세요."
                    />
                  </FormControl>
                  <FormMessage />
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer className="mb-4">
                  <AnimLabel>닉네임</AnimLabel>
                  <FormControl>
                    <AnimInput
                      {...field}
                      placeholder="닉네임을 입력해주세요."
                    />
                  </FormControl>
                  <FormMessage />
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer font-semibold">
            회원가입 &rarr;
            <BottomGradient />
          </Button>
          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
          <div className="flex flex-col space-y-4">
            <Button
              variant="outline"
              className="flex cursor-pointer items-center gap-4"
            >
              <GoogleIcon className="fill-foreground" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Google
              </span>
              <BottomGradient />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  );
};
