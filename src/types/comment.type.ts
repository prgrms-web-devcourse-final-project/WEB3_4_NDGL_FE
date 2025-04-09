export type CommentType = {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  postId: number;
  parentId: number | null;
  likeCount: number;
  createdAt: string;
  modifiedAt: string;
  replies: CommentType[];
};

export type CommentPayload = {
  content: string;
  parentId: number | null;
};
