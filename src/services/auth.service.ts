import { BASE_URL } from './api';

export const googleLogin = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users/google/login`, {
      method: 'GET',
      credentials: 'include',
      // headers: {
      //   AuthorizationCode: `Bearer ${accessToken}`,
      //   'Content-Type': 'application/json',
      // },
    });
    console.log(res);

    if (!res.ok) {
      throw new Error(`서버 응답 에러: ${res.status}`);
    }

    return {
      data: null,
      success: true,
    };
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    throw error;
  }
};

export const googleLoginProcess = async (code?: string) => {
  if (!code) {
    return {
      data: null,
      success: false,
    };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/users/google/login/process?code=${code}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    console.log('12312312', res);

    if (!res.ok) {
      console.error(`서버 응답 에러: ${res.status}`);
      return {
        data: null,
        success: false,
      };
    }

    return {
      data: null,
      success: true,
    };
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    throw error;
  }
};
