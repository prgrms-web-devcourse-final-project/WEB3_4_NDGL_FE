import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query-key";
import { getAllPosts } from "@/services/post.service";
import { PostList } from "@/components/post/post-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearchParams } from "react-router";
import { searchPosts } from "@/services/search.service";
import { Button } from "@/components/ui/button";
import { IMAGE } from "@/constants/img";
import { PostListLoading } from "@/components/loading/post-list.loading";

export const PostListPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

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
    queryKey: QUERY_KEY.POST.SEARCH(query),
    queryFn: ({ pageParam }: { pageParam?: number }) =>
      query ? searchPosts(query, pageParam, 10) : getAllPosts(pageParam, 10),
    getNextPageParam: (lastPage) => {
      const contents = lastPage.data.data.contents;
      const lastPost = contents[contents.length - 1];
      return lastPage.data.data.hasNext ? lastPost.id : undefined;
    },
    initialPageParam: undefined,
    enabled: query.trim().length > 0 || query === "",
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
        <div className="flex items-center gap-2.5">
          <span>{query}에 대한 결과가 없습니다.</span>{" "}
          <Button variant="outline" className="cursor-pointer">
            <Link to="/post">전체글 불러오기</Link>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 py-10">
      {posts && <PostList posts={posts} />}
      <div ref={ref} className="flex justify-center py-6">
        {isFetchingNextPage && <Skeleton className="h-10 w-32 rounded-full" />}
      </div>
    </div>
  );
};
