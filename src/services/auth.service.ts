import { APIResponse } from "@/types/common.type";
import { axiosInstance } from "./api";
import { GoogleLoginResponse, SignUpPayload } from "@/types/auth.type";

export const googleLogin = async (code: string) => {
  return await axiosInstance.get<APIResponse<{ data: GoogleLoginResponse }>>(
    "/users/google/login/process",
    {
      params: { code, redirect_uri: import.meta.env.VITE_REDIRECT_URI },
    }
  );
};

export const signup = async (payload: SignUpPayload) => {
  return await axiosInstance.post("/users/join", payload);
};

export const hasLogin = async () => {
  return await axiosInstance.get<
    APIResponse<{ data: { isLoggedIn: boolean } }>
  >("/auth/status");
};
