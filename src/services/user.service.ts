import { APIResponse } from "@/types/common.type";
import { axiosInstance } from "./api";
import { UpdateUserInfoType, UserInfoType } from "@/types/user.type";
import { PostType } from "@/types/post.type";

export const follow = async (userId: string) => {
  return await axiosInstance.post<APIResponse>(`/follow/${userId}`);
};

export const unFollow = async (userId: string) => {
  return await axiosInstance.delete<APIResponse>(`/follow/${userId}`);
};

export const hasFollow = async (userId: string) => {
  return await axiosInstance.get<
    APIResponse<{ data: { isFollowed: boolean } }>
  >(`/follow/${userId}`);
};

export const getUserInfo = async () => {
  return await axiosInstance.get<APIResponse<{ data: UserInfoType }>>(
    "/users/info"
  );
};

export const updateUserInfo = async (payload: UpdateUserInfoType) => {
  return await axiosInstance.put<APIResponse<{ data: UpdateUserInfoType }>>(
    "/users",
    payload
  );
};

export const resign = async () => {
  return await axiosInstance.delete<APIResponse>("/users/resign");
};

export const getUserPosts = async (
  userId: string,
  lastId?: number,
  size?: number
) => {
  return await axiosInstance.get<
    APIResponse<{ data: { contents: PostType[]; hasNext: boolean } }>
  >(`/posts/users/${userId}`, {
    params: {
      ...(lastId !== undefined && { lastId }),
      size,
    },
  });
};
