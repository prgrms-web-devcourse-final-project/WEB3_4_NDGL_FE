import { PostType } from "@/types/post.type";
import { axiosInstance } from "./api";
import { APIResponse } from "@/types/common.type";

export const searchPosts = async (
  keyword: string,
  lastId?: number,
  size?: number
) => {
  return await axiosInstance.get<{
    data: { contents: PostType[]; hasNext: boolean };
  }>("/posts/search", {
    params: {
      ...(lastId !== undefined && { lastId }),
      size,
      keyword,
    },
  });
};

export const suggestKeyword = async (keyword: string) => {
  return await axiosInstance.get<APIResponse<{ data: string[] }>>(
    `/posts/search/suggest`,
    {
      params: {
        keyword,
      },
    }
  );
};

export const popularKeyword = async () => {
  return await axiosInstance.get<APIResponse<{ data: string[] }>>(
    "/posts/search/popular-keywords"
  );
};
