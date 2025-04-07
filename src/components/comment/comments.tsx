import { motion } from "motion/react";
import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllComments } from "@/services/comment.service";
import { QUERY_KEY } from "@/lib/query-key";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentType } from "@/types/comment.type";
import { CreateComment } from "@/components/comment/create-comment";
import { hasLogin } from "@/services/auth.service";
import { cn } from "@/lib/utils";

const CommentItem = ({
  comment,
  depth = 0,
}: {
  comment: CommentType;
  depth?: number;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { data } = useQuery({
    queryKey: QUERY_KEY.AUTH.LOGIN,
    queryFn: hasLogin,
    select: (res) => res.data.data,
  });

  const canReply = depth === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-3 ${
        depth > 0
          ? "ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-indigo-600 dark:text-indigo-400">
          {comment.authorName}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-sm dark:text-gray-300 whitespace-pre-wrap">
        {comment.content}
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div
          className={cn(
            "flex items-center gap-1 text-foreground",
            data?.isLoggedIn
              ? "hover:text-red-500 cursor-pointer"
              : "hover:text-foreground"
          )}
        >
          <Heart size={14} /> {comment.likeCount}
        </div>
        {canReply && (
          <div
            className={cn(
              "flex items-center gap-1 text-foreground",
              data?.isLoggedIn
                ? "hover:text-blue-500 cursor-pointer"
                : "hover:text-foreground"
            )}
            onClick={() => {
              if (data?.isLoggedIn) {
                setShowReplyForm(!showReplyForm);
              }
            }}
          >
            <MessageSquare size={14} /> {comment.replies.length}{" "}
            {data?.isLoggedIn ? "댓글 달기" : ""}
          </div>
        )}
      </div>

      {data?.isLoggedIn && showReplyForm && canReply && (
        <CreateComment parentId={comment.id} />
      )}

      {canReply &&
        comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
    </motion.div>
  );
};

export const Comments = () => {
  const params = useParams<{ postId: string }>();
  const postId = params.postId || "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: QUERY_KEY.COMMENT.ALL(postId),
    queryFn: ({ pageParam }: { pageParam?: number }) =>
      getAllComments(postId, pageParam, 10),
    getNextPageParam: (lastPage) =>
      lastPage.data.data.hasNext
        ? lastPage.data.data.contents[lastPage.data.data.contents.length - 1].id
        : undefined,
    initialPageParam: undefined,
  });

  if (isLoading)
    return (
      <div className="space-y-4 px-4 py-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center p-6 text-red-500 gap-2">
        <AlertCircle /> 댓글을 불러오는 중 오류가 발생했습니다.
      </div>
    );

  const comments = data?.pages.flatMap((page) => page.data.data.contents) || [];

  return (
    <div className="flex flex-col space-y-4 px-4 py-2">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      {hasNextPage && (
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto rounded-full px-6"
        >
          {isFetchingNextPage ? "불러오는 중..." : "더보기"}
        </Button>
      )}
    </div>
  );
};
