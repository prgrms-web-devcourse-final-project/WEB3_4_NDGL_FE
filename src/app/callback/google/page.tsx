import { googleLoginProcess } from '@/services/auth.service';
import { redirect } from 'next/navigation';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function CallbackPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const code = searchParams.code;

  const { success } = await googleLoginProcess(code);
  // const { success } = await googleLogin();
  if (success) {
    redirect('/');
  }

  return <div>로그인 처리 중...</div>;
}
