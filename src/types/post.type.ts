export type PostType = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  thumbnail: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
};

export type CreatePostPayload = {
  title: string;
  content: string;
  hashtags: string[];
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
