import { AllPosts } from '@/components/home/all-posts';
import { PopularPosts } from '@/components/home/popular-posts';
import { DUMMY_POSTS } from '@/constants/post';

export default function HomePage() {
  const posts = DUMMY_POSTS.slice(0, 6);

  return (
    <main className="container mx-auto px-4 py-10 md:px-8">
      <section className="mb-16">
        <h2 className="relative mb-8 inline-block text-3xl font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-2/3 after:rounded after:bg-gradient-to-r after:from-blue-400 after:to-indigo-600 dark:after:from-blue-500 dark:after:to-indigo-400">
          실시간 인기 글
        </h2>
        <div className="h-full overflow-hidden">
          <PopularPosts posts={posts} />
        </div>
      </section>
      <section>
        <AllPosts posts={DUMMY_POSTS} />
      </section>
    </main>
  );
}
