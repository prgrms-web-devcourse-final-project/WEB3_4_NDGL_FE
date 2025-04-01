import { AuthForm } from '@/components/auth/auth-form';
import { googleLoginApi } from '@/services/auth.service';

type SearchParamsType = Promise<{ [key: string]: string | undefined }>;

export default async function GoogleLogin(props: {
  searchParams: SearchParamsType;
}) {
  const searchParams = await props.searchParams;
  const code = searchParams.code;

  return <AuthForm code={code} />;
}
