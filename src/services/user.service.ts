import { APIResponse } from "@/types/common.type";
import { axiosInstance } from "./api";

export const follow = async (userId: string) => {
  return await axiosInstance.post<APIResponse>(`/follow/${userId}`);
};

export const unFollow = async (userId: string) => {
  return await axiosInstance.delete<APIResponse>(`/follow/${userId}`);
};
