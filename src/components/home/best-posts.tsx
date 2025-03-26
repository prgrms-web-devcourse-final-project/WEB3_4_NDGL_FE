import { DUMMY_POSTS } from '@/constants/post';
import { PostCard } from './post-card';

export const BestPosts = () => {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-2xl font-extrabold">실시간 인기</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DUMMY_POSTS.map((post) => (
          <PostCard key={post.id} post={post} dir="col" />
        ))}
      </div>
    </section>
  );
};
