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
