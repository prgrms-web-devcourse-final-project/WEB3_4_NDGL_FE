export type PostType = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  thumbnail: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  hashtags: { name: string }[];
  locations: LocationType[];
  likeStatus: boolean;
};

export type CreatePostPayload = {
  title: string;
  content: string;
  hashtags: { name: string }[];
  locations: LocationType[];
  thumbnail: string;
};

export type LocationType = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  sequence: number;
};
