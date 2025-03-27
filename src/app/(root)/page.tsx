import { HighlightPostCard } from '@/components/post/highlight-post-card';
import { PostCard } from '@/components/post/post-card';
import { DUMMY_POSTS } from '@/constants/post';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-10 md:px-8">
      <section className="mb-12">
        <h2 className="relative mb-6 inline-block text-3xl font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-2/3 after:rounded after:bg-gradient-to-r after:from-blue-400 after:to-indigo-600 dark:after:from-blue-500 dark:after:to-indigo-400">
          실시간 인기 글
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DUMMY_POSTS.slice(0, 3).map((post) => (
            <HighlightPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="relative mb-6 inline-block text-3xl font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-2/3 after:rounded after:bg-gradient-to-r after:from-blue-400 after:to-indigo-600 dark:after:from-blue-500 dark:after:to-indigo-400">
          전체 글
        </h2>
        <div className="space-y-4">
          {DUMMY_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
