import { CreatePostPayload, PostType } from "@/types/post.type";
import { axiosInstance } from "./api";
import { APIResponse } from "@/types/common.type";

export const createPost = async (payload: CreatePostPayload) => {
  return await axiosInstance.post<APIResponse>("/posts", payload);
};

export const getAllPosts = async (lastId: string | undefined, size: number) => {
  return await axiosInstance.get<{
    data: { contents: PostType[]; hasNext: boolean };
  }>("/posts", {
    params: {
      lastId,
      size,
    },
  });
};
