'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { postSchema, PostSchemaType } from '@/schemas/post.schema';
import { Editor } from './editor';
import { useLocationStore } from '@/store/useLocationStore';
import { useMutation } from '@tanstack/react-query';
import { createPost } from '@/services/post.service';
import { CreatePostPayload } from '@/types/post.type';
import { toast } from 'sonner';

export const PostEditor = () => {
  const { locations } = useLocationStore();

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      hashtags: [''],
      thumbnail: '',
    },
  });

  const { mutate: create } = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
  });

  const onSubmit = async (data: PostSchemaType) => {
    if (locations.length === 0) {
      toast.error('장소를 선택해주세요.');
      return;
    }

    create({ ...data, locations });
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

            <FormField
              control={form.control}
              name="hashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>해시태그 (쉼표로 구분)</FormLabel>
                  <FormControl>
                    <Input placeholder="태그1, 태그2, 태그3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Editor onChange={field.onChange} />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.content?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full cursor-pointer"
            >
              {form.formState.isSubmitting ? '저장 중...' : '게시글 저장'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
