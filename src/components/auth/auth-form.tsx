"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type AuthSchemaType } from "@/schemas/auth.schema";
import { cn } from "@/lib/utils";
import { AnimInput } from "../ui/anim-input";
import { AnimLabel } from "../ui/anim-label";
import { Button } from "../ui/button";
import { BottomGradient } from "../ui/bottom-gradient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SignUpPayload } from "@/types/auth.type";
import { useLayoutEffect } from "react";
import { QUERY_KEY } from "@/lib/query-key";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { googleLogin, signup } from "@/services/auth.service";
import { setLocalStorage } from "@/lib/storage";

export const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const router = useNavigate();

  const code = searchParams.get("code") ?? "";

  const queryClient = useQueryClient();

  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      nickName: "",
      blogName: "",
    },
  });

  const {
    data: authData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: QUERY_KEY.AUTH.GOOGLE(code),
    queryFn: () => googleLogin(code),
    enabled: !!code,
    select: (res) => res.data.data,
  });

  const { mutate: signupMutate } = useMutation({
    mutationFn: (payload: SignUpPayload) => signup(payload),
    onSuccess: () => {
      toast.success("회원가입에 성공하였습니다.");
      router("/");
    },
  });

  const submitHandler = (values: AuthSchemaType) => {
    if (authData) {
      signupMutate({
        ...values,
        ...authData,
      });
    }
  };

  useLayoutEffect(() => {
    if (isSuccess && authData?.code === 200) {
      setLocalStorage(
        "authData",
        JSON.stringify({ userId: authData.userId, email: authData.email })
      );
      toast.success("로그인 되었습니다.");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.AUTH.LOGIN,
        type: "all",
      });
      router("/", { replace: true });
    }
  }, [authData, router, isSuccess]);

  return (
    <div className="shadow-input mx-auto mt-4 w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to 어디갔대?
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        미디어에 나온 유명 장소 정보 공유 플랫폼
      </p>
      {isLoading ? (
        <Card className="m-4 flex flex-col items-center justify-center p-4">
          <CardHeader className="w-full text-center">
            <CardTitle className="font-semibold">로그인중,,,</CardTitle>
          </CardHeader>
          <Loader2 className="size-4 animate-spin" />
        </Card>
      ) : (
        <Form {...form}>
          <form className="my-8" onSubmit={form.handleSubmit(submitHandler)}>
            <FormField
              control={form.control}
              name="blogName"
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
              name="nickName"
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
            <Button
              type="submit"
              className="w-full cursor-pointer font-semibold"
            >
              회원가입 &rarr;
              <BottomGradient />
            </Button>
          </form>
        </Form>
      )}
    </div>
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
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
