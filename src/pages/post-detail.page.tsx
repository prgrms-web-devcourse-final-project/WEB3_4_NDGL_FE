import { Comments } from "@/components/comment/comments";
import { CreateComment } from "@/components/comment/create-comment";
import { Post } from "@/components/post/post";
import { QUERY_KEY } from "@/lib/query-key";
import { hasLogin } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect } from "react";

export const PostDetailPage = () => {
  const { data } = useQuery({
    queryKey: QUERY_KEY.AUTH.LOGIN,
    queryFn: hasLogin,
    select: (res) => res.data.data,
  });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 pb-4">
      <Post />
      {data?.isLoggedIn && <CreateComment />}
      <Comments />
    </div>
  );
};
