import { GoogleLoginResponse, SignUpPayload } from '@/types/auth.type';
import { axiosInstance } from './api';
import { APIResponse } from '@/types/common.type';

export async function googleLoginApi(code?: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_URI}/api/auth/google?code=${code}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );

  if (!res.ok) {
    throw new Error('로그인 처리 실패');
  }

  const json = await res.json();

  return { authData: json.data, code: json.code };
}

export const googleLogin = async (
  code: string | null,
): Promise<{
  authData: GoogleLoginResponse;
  setCookies?: string[];
  code: number;
}> => {
  if (!code) {
    throw new Error('유효한 인증 코드가 필요합니다.');
  }

  try {
    const response = await axiosInstance.get<APIResponse<GoogleLoginResponse>>(
      '/users/google/login/process',
      {
        params: {
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_CLIENT_URI}/callback/google`,
        },
      },
    );

    if (!response.data?.data) {
      throw new Error(response.data?.message || '로그인에 실패했습니다.');
    }

    const setCookieHeader = response.headers['set-cookie'];

    if (response.data.code === 200 && !setCookieHeader) {
      throw new Error('유효한 쿠키가 존재하지 않습니다.');
    }

    return {
      authData: response.data.data,
      setCookies: setCookieHeader,
      code: response.data.code,
    };
  } catch (error) {
    console.error('[GoogleLogin Error]', error);
    throw error;
  }
};

export const signup = async (payload: SignUpPayload) => {
  return await axiosInstance.post('/users/join', payload);
};
