const DOMAIN = {
  AUTH: 'auth',
  GOOGLE: 'google',
};

export const QUERY_KEY = {
  AUTH: { GOOGLE: (code?: string) => [DOMAIN.AUTH, DOMAIN.GOOGLE, code] },
};
