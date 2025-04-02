import { PostEditor } from '@/components/post/post-editor';

export default function PostCreatePage() {
  return (
    <section className="container mx-auto max-w-4xl py-8 max-sm:px-2">
      <h1 className="mb-4 text-3xl font-semibold">새로운 게시글 작성</h1>
      <PostEditor />
    </section>
  );
}
