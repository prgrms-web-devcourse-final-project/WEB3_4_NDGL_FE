import { DUMMY_POSTS } from '@/constants/post';
import { PostCard } from './post-card';

export const AllPosts = () => {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-2xl font-extrabold">전체 글</h2>
      <div className="flex flex-col gap-4">
        {/* {DUMMY_POSTS.map((post) => (
          <PostCard post={post} key={post.id} variant="row" />
        ))} */}
      </div>
    </section>
  );
};
