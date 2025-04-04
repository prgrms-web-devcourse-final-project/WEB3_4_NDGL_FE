// import { NextResponse, NextRequest } from 'next/server';
// import { APIResponse } from './types/common.type';
// import axios from 'axios';

// const publicPaths = ['/', '/sign-in', '/callback/google'];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const isPublicPath = publicPaths.includes(pathname);

//   let isLoggedIn = false;

//   try {
//     const { data } = await axios.get<APIResponse<{ isLoggedIn: boolean }>>(
//       `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/v1/auth/status`,
//     );
//     if (!data?.isLoggedIn) {
//       throw new Error(data?.message || '자격증명을 인증하는데 실패하였습니다.');
//     }

//     isLoggedIn = data?.isLoggedIn ?? false;
//   } catch (error) {
//     console.error('[Middleware Error]', error);
//     isLoggedIn = false;
//   }

//   if (isLoggedIn && ['/sign-in', '/callback/google'].includes(pathname)) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   if (!isLoggedIn && !isPublicPath) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };

export default function middleware() {}
