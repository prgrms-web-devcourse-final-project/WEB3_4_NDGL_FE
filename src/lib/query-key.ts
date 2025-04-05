const DOMAIN = {
  AUTH: "auth",
  GOOGLE: "google",
  post: "post",
  POPULAR: "popular",
  LOGIN: "login",
};

export const QUERY_KEY = {
  AUTH: {
    LOGIN: [DOMAIN.AUTH, DOMAIN.LOGIN],
    GOOGLE: (code?: string) => [DOMAIN.AUTH, DOMAIN.GOOGLE, code],
  },
  POST: {
    DEFAULT: [DOMAIN.post],
    POPULAR: [DOMAIN.post, DOMAIN.POPULAR],
  },
};
