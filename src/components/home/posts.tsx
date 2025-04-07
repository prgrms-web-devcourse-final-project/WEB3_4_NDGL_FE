import { AllPosts } from "@/components/home/all-posts";
import { PopularPosts } from "@/components/home/popular-posts";
import { getAllPosts } from "@/services/post.service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { QUERY_KEY } from "@/lib/query-key";
import { PostsLoading } from "../loading/posts.loading";

export const Posts = () => {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: QUERY_KEY.POST.DEFAULT,
    queryFn: ({ pageParam }: { pageParam?: number }) =>
      getAllPosts(pageParam, 5),
    getNextPageParam: (lastPage) => {
      const contents = lastPage.data.data.contents;
      const lastPost = contents[contents.length - 1];
      return lastPage.data.data.hasNext ? lastPost.id : undefined;
    },
    initialPageParam: undefined,
  });

  const {
    data: popularPosts,
    isLoading: isPopularLoading,
    isError: isPopularError,
  } = useQuery({
    queryKey: QUERY_KEY.POST.POPULAR,
    queryFn: () =>
      getAllPosts(undefined, 6).then((res) =>
        res.data.data.contents.slice(0, 6)
      ),
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || isPopularLoading) return <PostsLoading />;

  if (isError || isPopularError)
    return (
      <div className="container py-8 text-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  return (
    <div className="container py-8 px-4 mx-auto">
      {popularPosts && popularPosts.length > 0 && (
        <PopularPosts posts={popularPosts} />
      )}
      {data && (
        <AllPosts
          posts={data?.pages.flatMap((page) => page.data.data.contents)}
        />
      )}
      <div ref={ref} className="flex justify-center py-6">
        {isFetchingNextPage && <Skeleton className="h-10 w-32 rounded-full" />}
      </div>
    </div>
  );
};
