import { NextRequest, NextResponse } from 'next/server';
import { googleLogin } from '@/services/auth.service';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  try {
    const { authData, setCookies, code: resCode } = await googleLogin(code);

    const response = NextResponse.json({
      code: resCode,
      data: authData,
      message: '구글 로그인에 성공하였습니다.',
    });

    const cookieStore = await cookies();

    setCookies?.forEach((cookieString: string) => {
      const [cookiePair, ...cookieOptions] = cookieString.split(';');
      const [name, value] = cookiePair.split('=');

      cookieStore.set(name.trim(), value.trim(), {
        httpOnly: cookieOptions.some(
          (opt) => opt.trim().toLowerCase() === 'httponly',
        ),
        secure: cookieOptions.some(
          (opt) => opt.trim().toLowerCase() === 'secure',
        ),
        path: '/',
      });
    });

    return response;
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: '로그인 실패' },
      { status: 400 },
    );
  }
}
