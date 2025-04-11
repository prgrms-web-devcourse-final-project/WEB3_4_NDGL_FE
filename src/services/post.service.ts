import { CreatePostPayload, PostType } from "@/types/post.type";
import { axiosInstance } from "./api";
import { APIResponse } from "@/types/common.type";

export const createPost = async (payload: CreatePostPayload) => {
  return await axiosInstance.post<APIResponse>("/posts", payload);
};

export const getAllPosts = async (lastId?: number, size?: number) => {
  return await axiosInstance.get<{
    data: { contents: PostType[]; hasNext: boolean };
  }>("/posts", {
    params: {
      ...(lastId !== undefined && { lastId }),
      size,
    },
  });
};

export const getPost = async (postId: string) => {
  return await axiosInstance.get<APIResponse<{ data: PostType }>>(
    `/posts/${postId}`
  );
};

export const likePost = async (postId: string) => {
  return await axiosInstance.post<APIResponse<{ data: boolean }>>(
    `/like/posts/${postId}`
  );
};

export const updatePost = async (
  postId: string,
  payload: CreatePostPayload
) => {
  return await axiosInstance.put<APIResponse<{ data: PostType }>>(
    `/posts/${postId}`,
    payload
  );
};

export const deletePost = async (postId: string) => {
  return await axiosInstance.delete<APIResponse>(`/posts/${postId}`);
};

export const getPostsByUserId = async (userId: string) => {
  return await axiosInstance.get<
    APIResponse<{ data: { contents: PostType[]; hasNext: boolean } }>
  >(`/posts/users/${userId}`);
};
