import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, updateUserInfo, resign } from "@/services/user.service";
import { toast } from "sonner";
import { QUERY_KEY } from "@/lib/query-key";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const noSpecialCharsRegex = /^[a-zA-Z0-9가-힣]*$/;

const schema = z.object({
  nickName: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
    .max(15, "닉네임은 최대 15자까지 가능합니다.")
    .regex(noSpecialCharsRegex, "닉네임에는 특수문자를 사용할 수 없습니다."),
  blogName: z
    .string()
    .min(2, "블로그 이름은 최소 2자 이상이어야 합니다.")
    .max(20, "블로그 이름은 최대 20자까지 가능합니다.")
    .regex(
      noSpecialCharsRegex,
      "블로그 이름에는 특수문자를 사용할 수 없습니다."
    ),
});

type FormData = z.infer<typeof schema>;

export const UserInfo = () => {
  const queryClient = useQueryClient();

  const { data: userInfo, isLoading } = useQuery({
    queryKey: QUERY_KEY.USER.DEFAULT,
    queryFn: getUserInfo,
    select: (res) => res.data.data,
  });

  const updateMutation = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      toast.success("정보 업데이트 성공");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.USER.DEFAULT });
    },
    onError: () => toast.error("정보 업데이트 실패"),
  });

  const resignMutation = useMutation({
    mutationFn: resign,
    onSuccess: () => {
      toast.success("회원 탈퇴 성공");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.USER.DEFAULT });
    },
    onError: () => toast.error("회원 탈퇴 실패"),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nickName: "", blogName: "" },
  });

  useEffect(() => {
    if (userInfo)
      form.reset({ nickName: userInfo.nickname, blogName: userInfo.blogName });
  }, [userInfo, form]);

  const onSubmit = (data: FormData) => updateMutation.mutate(data);

  const handleResign = () => {
    if (confirm("정말 탈퇴하시겠습니까?")) resignMutation.mutate();
  };

  return (
    <AnimatePresence mode="wait">
      {!isLoading && userInfo && (
        <motion.div
          layoutId="profile-card"
          className="mx-auto px-4 w-full py-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl rounded-2xl bg-transparent border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                내 프로필
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-2">
                    <Label>이메일</Label>
                    <Input
                      disabled
                      value={userInfo.email}
                      placeholder="이메일"
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="nickName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>닉네임</FormLabel>
                        <FormControl>
                          <Input placeholder="닉네임을 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="blogName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>블로그 이름</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="블로그 이름을 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full cursor-pointer">
                    정보 수정하기
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="w-[calc(100%-3rem)] mx-auto h-[1px] bg-foreground/40" />
          <Card className="shadow-xl rounded-2xl bg-transparent border-none">
            <CardContent className="flex justify-between items-center py-4">
              <div>
                <h2 className="text-lg font-bold">회원 탈퇴</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  탈퇴하면 모든 정보가 삭제됩니다.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleResign}
                className="cursor-pointer"
              >
                탈퇴하기
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
