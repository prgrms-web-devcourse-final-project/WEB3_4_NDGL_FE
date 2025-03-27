import { PostCard } from '@/components/post/post-card';
import { Carousel } from '@/components/ui/carousel';
import { DUMMY_POSTS } from '@/constants/post';

export default function HomePage() {
  const slides = DUMMY_POSTS.slice(0, 6).map((post) => ({
    title: post.title,
    button: '자세히 보기',
    src: post.thumbnail,
  }));

  return (
    <main className="container mx-auto px-4 py-10 md:px-8">
      <section className="mb-16">
        <h2 className="relative mb-8 inline-block text-3xl font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-2/3 after:rounded after:bg-gradient-to-r after:from-blue-400 after:to-indigo-600 dark:after:from-blue-500 dark:after:to-indigo-400">
          실시간 인기 글
        </h2>
        <Carousel slides={slides} />
      </section>
      <section>
        <h2 className="relative mb-8 inline-block text-3xl font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-2/3 after:rounded after:bg-gradient-to-r after:from-blue-400 after:to-indigo-600 dark:after:from-blue-500 dark:after:to-indigo-400">
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
