import { APIResponse } from "@/types/common.type";
import { axiosInstance } from "./api";
import { CommentPayload, CommentType } from "@/types/comment.type";

export const createComment = async (
  postId: string,
  payload: CommentPayload
) => {
  return await axiosInstance.post<APIResponse>(`/posts/${postId}/comments`, {
    ...payload,
  });
};

export const deleteComment = async (postId: string, commentId: string) => {
  return await axiosInstance.delete<APIResponse>(
    `/posts/${postId}/comments/${commentId}`
  );
};

export const updateComment = async (
  postId: string,
  commentId: string,
  payload: CommentPayload
) => {
  return await axiosInstance.put<APIResponse>(
    `/posts/${postId}/comments/${commentId}`,
    {
      ...payload,
    }
  );
};

export const getAllComments = async (
  postId: string,
  lastId?: number,
  size?: number
) => {
  return await axiosInstance.get<
    APIResponse<{ data: { contents: CommentType[]; hasNext: boolean } }>
  >(`/posts/${postId}/comments`, {
    params: {
      ...(lastId !== undefined && { lastId }),
      size,
    },
  });
};

export const getComment = async (postId: string, commentId: number) => {
  return await axiosInstance.get<APIResponse<{ data: CommentType }>>(
    `/posts/${postId}/comments/${commentId}`
  );
};

export const likeComment = async (commentId: string) => {
  return await axiosInstance.post<APIResponse<{ data: boolean }>>(
    `/like/comments/${commentId}`
  );
};
