import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { postSchema, PostSchemaType } from "@/schemas/post.schema";
import { Editor } from "./editor";
import { useLocationStore } from "@/store/useLocationStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/services/post.service";
import { CreatePostPayload } from "@/types/post.type";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { QUERY_KEY } from "@/lib/query-key";

export const PostEditor = () => {
  const router = useNavigate();

  const { locations, setLocations } = useLocationStore();

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      hashtags: [],
      thumbnail: "",
    },
  });

  const [hashtagInput, setHashtagInput] = useState("");

  const queryClient = useQueryClient();

  const { mutate: create } = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: (data) => {
      if (data.data.code === 200) {
        toast.success("게시글이 생성되었습니다.");
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.POST.DEFAULT,
        });
        setLocations([]);
        form.reset();
        router("/");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || "게시글 생성에 실패하였습니다.");
    },
  });

  const onSubmit = async (data: PostSchemaType) => {
    if (locations.length === 0) {
      toast.error("장소를 선택해주세요.");
      return;
    }

    create({ ...data, locations });
  };

  const addHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = hashtagInput.trim();
      const currentTags = form.getValues("hashtags");
      if (value && !currentTags.some((tag) => tag.name === value)) {
        form.setValue("hashtags", [...currentTags, { name: value }]);
      }
      setHashtagInput("");
    }
  };

  const removeHashtag = (tagName: string) => {
    form.setValue(
      "hashtags",
      form.getValues("hashtags").filter((t) => t.name !== tagName)
    );
  };

  return (
    <Card className="mx-auto max-w-4xl shadow-xl">
      <CardHeader>
        <CardTitle>새 게시글 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>썸네일 URL</FormLabel>
                  <FormControl>
                    <Input placeholder="썸네일 이미지 URL 입력" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>해시태그</FormLabel>
              <FormControl>
                <div>
                  <Input
                    placeholder="태그 입력 후 엔터 또는 쉼표(,)"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={addHashtag}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("hashtags").map((tag) => (
                      <Badge
                        key={tag.name}
                        onClick={() => removeHashtag(tag.name)}
                        className="cursor-pointer"
                      >
                        {tag.name} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Editor onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full cursor-pointer"
            >
              {form.formState.isSubmitting ? "저장 중..." : "게시글 저장"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
