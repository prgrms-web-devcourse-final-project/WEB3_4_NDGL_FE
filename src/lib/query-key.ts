const DOMAIN = {
  AUTH: "auth",
  GOOGLE: "google",
  POST: "post",
  POPULAR: "popular",
  LOGIN: "login",
  COMMENT: "comment",
};

export const QUERY_KEY = {
  AUTH: {
    LOGIN: [DOMAIN.AUTH, DOMAIN.LOGIN],
    GOOGLE: (code?: string) => [DOMAIN.AUTH, DOMAIN.GOOGLE, code],
  },
  POST: {
    DEFAULT: [DOMAIN.POST],
    POPULAR: [DOMAIN.POST, DOMAIN.POPULAR],
    DETAIL: (postId: string) => [DOMAIN.POST, postId],
  },
  COMMENT: {
    DEFAULT: (postId: string, commentId: string) => [
      DOMAIN.COMMENT,
      postId,
      commentId,
    ],
    ALL: (postId: string) => [DOMAIN.COMMENT, postId],
  },
};
