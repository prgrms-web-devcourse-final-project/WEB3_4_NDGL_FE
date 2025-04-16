import { APIResponse } from "@/types/common.type";
import { axiosInstance } from "./api";
import { BlogType } from "@/types/blog.type";

export const getBlogs = async (lastId?: number, size?: number) => {
  return await axiosInstance.get<
    APIResponse<{ data: { contents: BlogType[]; hasNext: boolean } }>
  >("/blogs", {
    params: {
      ...(lastId !== undefined && { lastId }),
      size,
    },
  });
};
