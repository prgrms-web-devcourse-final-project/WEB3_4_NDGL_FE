import { APIResponse } from "@/types/common.type";
import { axiosInstance } from "./api";
import {
  CreateImageUrlPayload,
  UploadComplateImagePayload,
} from "@/types/image.type";

export const createImageUrl = async (payload: CreateImageUrlPayload) => {
  return await axiosInstance.post<
    APIResponse<{ data: { presignedUrls: string } }>
  >("/images/presigned-url", payload);
};

export const uploadComplate = async (payload: UploadComplateImagePayload) => {
  return await axiosInstance.post<APIResponse>(
    "/images/upload-complete",
    payload
  );
};
