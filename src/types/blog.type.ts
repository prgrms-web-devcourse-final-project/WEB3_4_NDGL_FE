import { PostType } from "./post.type";

export type BlogType = {
  id: number;
  blogName: string;
  nickname: string;
  isFollowed: boolean;
  posts: PostType[];
};
