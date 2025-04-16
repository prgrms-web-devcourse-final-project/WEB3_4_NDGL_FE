import { useUser } from "@/hooks/useUser";
import { QUERY_KEY } from "@/lib/query-key";
import { getUserPosts } from "@/services/user.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostListLoading } from "../loading/post-list.loading";
import { IMAGE } from "@/constants/img";
import { motion } from "motion/react";
import { PostList } from "../post/post-list";
import { Skeleton } from "../ui/skeleton";

export const MyPosts = () => {
  const { ref, inView } = useInView();
  const { user } = useUser();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isError,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: QUERY_KEY.POST.MY,
    queryFn: ({ pageParam }: { pageParam?: number }) =>
      getUserPosts(user?.userId.toString() ?? "", pageParam, 5),
    getNextPageParam: (lastPage) => {
      const contents = lastPage.data.data.contents;
      const lastPost = contents[contents.length - 1];
      return lastPage.data.data.hasNext ? lastPost.id : undefined;
    },
    initialPageParam: undefined,
    enabled: !!user && user.userId.toString() !== "",
  });

  const posts = data?.pages.flatMap((page) => page.data.data.contents);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <PostListLoading />;

  if (isError)
    return (
      <div className="container px-4 py-8 text-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  if (isSuccess && posts?.length === 0) {
    return (
      <div className="container px-4 pt-40 pb-8 text-center flex flex-col items-center justify-center gap-4">
        <img src={IMAGE.NO_POST} alt="no-post" className="aspect-square w-40" />
      </div>
    );
  }

  return (
    <div className="px-4 py-10">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl font-semibold mb-4 text-center"
      >
        내 게시글
      </motion.h2>
      {posts && <PostList posts={posts} />}
      <div ref={ref} className="flex justify-center py-6">
        {isFetchingNextPage && <Skeleton className="h-10 w-32 rounded-full" />}
      </div>
    </div>
  );
};
