import { APIResponse } from "@/types/common.type";
import { axiosInstance } from "./api";
import { BlogType } from "@/types/blog.type";

export const getBlogs = async () => {
  return await axiosInstance.get<
    APIResponse<{ data: { contents: BlogType[]; hasNext: boolean } }>
  >("/blogs");
};
