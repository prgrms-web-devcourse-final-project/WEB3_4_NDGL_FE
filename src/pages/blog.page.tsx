import { Blog } from "@/components/mypage/blog";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBlogs } from "@/services/blog.service";
import { QUERY_KEY } from "@/lib/query-key";
import { useEffect } from "react";
import { IMAGE } from "@/constants/img";
import { PostListLoading } from "@/components/loading/post-list.loading";
import { Skeleton } from "@/components/ui/skeleton";

export const BlogPage = () => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isError,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: QUERY_KEY.BLOG.DEFAULT,
    queryFn: ({ pageParam }: { pageParam?: number }) => getBlogs(pageParam, 5),
    getNextPageParam: (lastPage) => {
      const contents = lastPage.data.data.contents;
      const lastPost = contents[contents.length - 1];
      return lastPage.data.data.hasNext ? lastPost.id : undefined;
    },
    initialPageParam: undefined,
  });
  const blogs = data?.pages.flatMap((page) => page.data.data.contents);

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

  if (isSuccess && blogs?.length === 0) {
    return (
      <div className="container px-4 pt-40 pb-8 text-center flex flex-col items-center justify-center gap-4">
        <img src={IMAGE.NO_POST} alt="no-post" className="aspect-square w-40" />
      </div>
    );
  }
  return (
    <div className="py-8 px-4">
      <Blog blogs={blogs ?? []} />
      <div ref={ref} className="flex justify-center py-6">
        {isFetchingNextPage && <Skeleton className="h-10 w-32 rounded-full" />}
      </div>
    </div>
  );
};
