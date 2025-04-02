import { AuthForm } from '@/components/auth/auth-form';

type SearchParamsType = Promise<{ [key: string]: string | undefined }>;

export default async function GoogleLogin(props: {
  searchParams: SearchParamsType;
}) {
  const searchParams = await props.searchParams;
  const code = searchParams.code;

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <AuthForm code={code} />
    </main>
  );
}
