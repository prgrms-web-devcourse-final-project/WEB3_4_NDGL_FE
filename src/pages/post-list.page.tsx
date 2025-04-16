import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/lib/query-key";
import {
  getAllPosts,
  getPostsByFollow,
  getPostsByLike,
} from "@/services/post.service";
import { PostList } from "@/components/post/post-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearchParams } from "react-router";
import { searchPosts } from "@/services/search.service";
import { Button } from "@/components/ui/button";
import { IMAGE } from "@/constants/img";
import { PostListLoading } from "@/components/loading/post-list.loading";
import { motion } from "motion/react";
import { FloatingButton } from "@/components/layout/floating-button";
import { hasLogin } from "@/services/auth.service";
import { getUserPosts } from "@/services/user.service";

export const PostListPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const mode = searchParams.get("mode") || "";
  const userId = searchParams.get("userid") || "";

  const { ref, inView } = useInView();

  const fetchPosts = ({ pageParam }: { pageParam?: number }) => {
    switch (mode) {
      case "like":
        return getPostsByLike(pageParam, 10);
      case "follow":
        return getPostsByFollow(pageParam, 10);
      case "user":
        return getUserPosts(userId, pageParam, 10);
      case "search":
      default:
        return query
          ? searchPosts(query, pageParam, 10)
          : getAllPosts(pageParam, 10);
    }
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isError,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: QUERY_KEY.POST.LIST(mode, query ? query : userId),
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => {
      const contents = lastPage.data.data.contents;
      const lastPost = contents[contents.length - 1];
      return lastPage.data.data.hasNext ? lastPost.id : undefined;
    },
    initialPageParam: undefined,
    enabled:
      mode === "like" ||
      mode === "follow" ||
      mode === "user" ||
      query.trim().length > 0 ||
      query === "",
  });

  const { data: loginStatus } = useQuery({
    queryKey: QUERY_KEY.AUTH.LOGIN,
    queryFn: hasLogin,
    select: (res) => res.data.data,
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
          {mode === "search" && <span>{query}에 대한 결과가 없습니다.</span>}{" "}
          <Button variant="outline" className="cursor-pointer">
            <Link to="/post">전체글 불러오기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const modeTitles: Record<string, string> = {
    like: "좋아요한 게시물",
    follow: "팔로우한 사용자 게시물",
    user: `${posts?.[0].authorName}님 게시글`,
    search: query ? `'${query}' 검색 결과` : "전체 게시물",
  };

  return (
    <div className="px-4 py-10">
      <motion.h2
        key={mode + query}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl font-semibold mb-4 text-center"
      >
        {modeTitles[mode] || "전체 게시물"}
      </motion.h2>
      {posts && <PostList posts={posts} />}
      <div ref={ref} className="flex justify-center py-6">
        {isFetchingNextPage && <Skeleton className="h-10 w-32 rounded-full" />}
      </div>
      {loginStatus?.isLoggedIn && <FloatingButton />}
    </div>
  );
};
