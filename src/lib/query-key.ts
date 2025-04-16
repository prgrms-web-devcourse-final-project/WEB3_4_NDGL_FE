const DOMAIN = {
  AUTH: "auth",
  GOOGLE: "google",
  POST: "post",
  POPULAR: "popular",
  LOGIN: "login",
  COMMENT: "comment",
  SEARCH: "search",
  USER: "user",
  FOLLOW: "follow",
  BLOG: "blog",
  TEMP: "temp",
};

export const QUERY_KEY = {
  AUTH: {
    LOGIN: [DOMAIN.AUTH, DOMAIN.LOGIN],
    GOOGLE: (code?: string) => [DOMAIN.AUTH, DOMAIN.GOOGLE, code],
  },
  POST: {
    DEFAULT: [DOMAIN.POST],
    POPULAR: [DOMAIN.POST, DOMAIN.POPULAR],
    DETAIL: (postId: string | null) => [DOMAIN.POST, postId],
    SEARCH: (query: string) => [DOMAIN.POST, DOMAIN.SEARCH, query],
    LIST: (mode: string, query?: string) => [DOMAIN.POST, mode, query],
    MY: [DOMAIN.POST, DOMAIN.USER],
    TEMP: [DOMAIN.POST, DOMAIN.TEMP],
  },
  COMMENT: {
    DEFAULT: (postId: string, commentId: string) => [
      DOMAIN.COMMENT,
      postId,
      commentId,
    ],
    ALL: (postId: string) => [DOMAIN.COMMENT, postId],
  },
  USER: {
    DEFAULT: [DOMAIN.USER],
    FOLLOW: (userId: string) => [DOMAIN.USER, DOMAIN.FOLLOW, userId],
  },
  BLOG: {
    DEFAULT: [DOMAIN.BLOG],
  },
};
