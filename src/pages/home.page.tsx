import { Banner } from "@/components/home/banner";
import { AllPosts } from "@/components/home/all-posts";
import { PopularPosts } from "@/components/home/popular-posts";
import { getAllPosts } from "@/services/post.service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { QUERY_KEY } from "@/lib/query-key";

export const HomePage = () => {
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
    queryFn: ({ pageParam }) => getAllPosts(pageParam, 6),
    getNextPageParam: (lastPage) => {
      const lastPost = lastPage.data.data.contents[0];
      return lastPage.data.data.hasNext ? lastPost.id : undefined;
    },
    initialPageParam: "",
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

  if (isLoading || isPopularLoading)
    return (
      <div className="container space-y-4 py-8">
        {[...Array(5)].map((_, idx) => (
          <Skeleton key={idx} className="h-40 rounded-lg" />
        ))}
      </div>
    );

  if (isError || isPopularError)
    return (
      <div className="container py-8 text-center text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  return (
    <>
      <Banner />
      <div className="container py-8 mx-auto">
        {popularPosts && popularPosts.length > 0 && (
          <PopularPosts posts={popularPosts} />
        )}
        {data && (
          <AllPosts
            posts={data?.pages.flatMap((page) => page.data.data.contents)}
          />
        )}
        <div ref={ref} className="mt-6 flex justify-center">
          {isFetchingNextPage && <Skeleton className="h-10 w-48" />}
        </div>
      </div>
    </>
  );
};
