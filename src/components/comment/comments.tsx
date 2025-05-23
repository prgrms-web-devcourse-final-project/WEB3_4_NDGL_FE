import { motion } from "motion/react";
import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteComment,
  getAllComments,
  likeComment,
  updateComment,
} from "@/services/comment.service";
import { QUERY_KEY } from "@/lib/query-key";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentPayload, CommentType } from "@/types/comment.type";
import { CreateComment } from "@/components/comment/create-comment";
import { hasLogin } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { useModalStore } from "@/store/useModalStore";

const CommentItem = ({
  comment,
  depth = 0,
}: {
  comment: CommentType;
  depth?: number;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const { user } = useUser();
  const { onOpen } = useModalStore();

  const { data } = useQuery({
    queryKey: QUERY_KEY.AUTH.LOGIN,
    queryFn: hasLogin,
    select: (res) => res.data.data,
  });

  const { mutate: likeCommentMutation } = useMutation({
    mutationFn: () => likeComment(comment.id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.COMMENT.ALL(comment.postId.toString()),
      });
    },
  });

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: () =>
      deleteComment(comment.postId.toString(), comment.id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.COMMENT.ALL(comment.postId.toString()),
      });
    },
  });

  const { mutate: updateCommentMutation } = useMutation({
    mutationFn: (payload: CommentPayload) =>
      updateComment(comment.postId.toString(), comment.id.toString(), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.COMMENT.ALL(comment.postId.toString()),
      });
      setIsEditing(false);
    },
  });

  const handleDeleteClick = async () => {
    const confirmed = await useModalStore.getState().onOpen("confirm");

    if (confirmed) {
      deleteCommentMutation();
    } else {
      console.log("사용자가 취소하였습니다.");
    }
  };

  const canReply = depth === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className={`bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-4 space-y-3 ${
        depth > 0
          ? "ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <Link
          to={`/post?mode=user&userid=${comment.authorId}`}
          className="font-semibold text-sm text-indigo-600 dark:text-indigo-400"
        >
          {comment.authorName ?? "삭제된 댓글입니다"}
        </Link>
        <span className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      {isEditing ? (
        <CreateComment
          parentId={comment.parentId}
          initialContent={comment.content}
          onUpdate={(content) =>
            updateCommentMutation({ content, parentId: comment.parentId })
          }
        />
      ) : (
        <p className="text-sm dark:text-gray-300 whitespace-pre-wrap">
          {comment.content}
        </p>
      )}
      <div className="flex items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          {comment.authorId && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => likeCommentMutation()}
              className={cn(
                "flex items-center gap-1 text-foreground",
                data?.isLoggedIn
                  ? "hover:text-red-500 cursor-pointer"
                  : "hover:text-foreground"
              )}
            >
              <Heart
                size={14}
                className={
                  comment.likeStatus
                    ? "fill-red-500 stroke-red-500"
                    : "fill-transparent"
                }
              />{" "}
              {comment.likeCount}
            </motion.button>
          )}
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
              {comment.authorId && data?.isLoggedIn ? "댓글 달기" : ""}
            </div>
          )}
        </div>
        {comment.authorId &&
          (user && user.userId === comment.authorId ? (
            <div className="flex items-center gap-4">
              <button
                className="hover:text-green-500 cursor-pointer"
                onClick={() => {
                  if (isEditing) {
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? "취소" : "수정"}
              </button>
              <button
                className="hover:text-red-500 cursor-pointer"
                onClick={() => handleDeleteClick()}
              >
                삭제
              </button>
            </div>
          ) : (
            <button
              className="hover:text-red-500 cursor-pointer"
              onClick={() =>
                onOpen("report", {
                  type: "comment",
                  commentId: comment.id.toString(),
                })
              }
            >
              신고
            </button>
          ))}
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
