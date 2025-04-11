import { PostType } from "@/types/post.type";
import { axiosInstance } from "./api";

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
