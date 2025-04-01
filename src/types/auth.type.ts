export type SignUpPayload = {
  provider: string;
  identify: string;
  email: string;
  nickName: string;
  blogName: string;
};

export type GoogleLoginResponse = {
  email: string;
  identify: string;
  message: string;
  provider: string;
};
