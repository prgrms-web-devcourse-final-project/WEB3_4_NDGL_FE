import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useNavigate, useSearchParams } from "react-router";
import { ImageUpload } from "./image-upload";
import { useHashtag } from "@/hooks/useHashTag";
import { useTempPost } from "@/hooks/useTempPost";
import { usePostMutation } from "@/hooks/usePostMutation";
import { HashtagInput } from "./hashtag-input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query-key";
import { getPost } from "@/services/post.service";
import { useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export const PostEditor = () => {
  const router = useNavigate();
  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const postId = searchParams.get("postid");
  const mode = searchParams.get("mode");

  const { locations, setLocations } = useLocationStore();

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "", hashtags: [], thumbnail: "" },
  });

  const {
    hashtagInput,
    setHashtagInput,
    addHashtag,
    removeHashtag,
    handleHashtagKeyDown,
    handleHashtagBlur,
  } = useHashtag(form);

  const { handleTempLoad, handleTempSave, tempId } = useTempPost({
    form,
    setLocations,
    mode,
    locations,
    postId,
  });

  const { data: post } = useQuery({
    queryKey: QUERY_KEY.POST.DETAIL(postId),
    queryFn: () => getPost(postId),
    select: (res) => res.data.data,
    enabled: !!postId,
  });

  const { submitPost, isSubmitting } = usePostMutation({
    mode,
    postId: postId || (tempId?.toString() ?? ""),
    locations,
    onSuccess: () => {
      setLocations([]);
      form.reset();
      router("/");
    },
  });

  const setImageUrl = (imageUrl: string) => {
    form.setValue("thumbnail", imageUrl);
  };

  useEffect(() => {
    if (post && mode === "edit") {
      form.reset({
        title: post.title,
        content: post.content,
        hashtags: post.hashtags,
        thumbnail: post.thumbnail,
      });

      setLocations(post.locations);
    }
  }, [post, mode]);

  useMemo(() => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.POST.TEMP,
      type: "all",
    });
  }, []);

  return (
    <Card className="mx-auto max-w-4xl shadow-xl">
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "게시글 수정" : "새 게시글 작성"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1 md:px-3 lg:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitPost)} className="space-y-6">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="제목 입력" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="thumbnail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>썸네일 이미지</FormLabel>
                  {field.value ? (
                    <div className="relative">
                      <Trash2
                        onClick={() => form.setValue("thumbnail", "")}
                        className="absolute top-0 left-0 cursor-pointer bg-background size-4 text-destructive"
                      />
                      <img
                        src={field.value}
                        alt="thumbnail"
                        className="h-32 aspect-video"
                      />
                    </div>
                  ) : (
                    <ImageUpload
                      tempId={postId ? +postId : tempId}
                      setImageUrl={setImageUrl}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <HashtagInput
              hashtagInput={hashtagInput}
              setHashtagInput={setHashtagInput}
              hashtags={form.watch("hashtags")}
              addHashtag={addHashtag}
              removeHashtag={removeHashtag}
              onKeyDown={handleHashtagKeyDown}
              onBlur={handleHashtagBlur}
            />

            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Editor
                      tempId={postId ? +postId : tempId}
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              {mode !== "edit" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      className="w-1/3 cursor-pointer"
                      type="button"
                    >
                      임시저장 옵션
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={handleTempSave}
                      className="cursor-pointer"
                    >
                      임시저장
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleTempLoad}
                      className="cursor-pointer"
                    >
                      불러오기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "cursor-pointer",
                  mode === "edit" ? "w-full" : "w-2/3"
                )}
              >
                {isSubmitting ? "저장 중..." : "게시글 저장"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
