export type SignUpPayload = {
  provider: string;
  identify: string;
  email: string;
  nickName: string;
  blogName: string;
};

export type GoogleLoginResponse = {
  code: number;
  email: string;
  identify: string;
  message: string;
  provider: string;
  userId: number;
};
