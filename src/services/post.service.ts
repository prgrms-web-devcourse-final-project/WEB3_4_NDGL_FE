import { CreatePostPayload } from '@/types/post.type';
import { axiosInstance } from './api';

export const createPost = async (payload: CreatePostPayload) => {
  return await axiosInstance.post('/posts', payload);
};
