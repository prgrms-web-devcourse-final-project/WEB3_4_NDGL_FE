import { GoogleLogin } from '@/components/auth/google-login';

export default function SignInPage() {
  return (
    <div className="shadow-input w-full max-w-md rounded-none bg-white p-4 md:mx-auto md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to 어디갔대?
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        미디어에 나온 유명 장소 정보 공유 플랫폼
      </p>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <GoogleLogin />
    </div>
  );
}
