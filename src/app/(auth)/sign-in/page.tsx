import { BottomGradient } from '@/components/ui/bottom-gradient';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons';

export default function SignInPage() {
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to 어디갔대?
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        미디어에 나온 유명 장소 정보 공유 플랫폼
      </p>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <div className="flex flex-col space-y-4">
        <Button
          variant="outline"
          className="flex cursor-pointer items-center gap-4"
        >
          <GoogleIcon pathClassName="fill-foreground" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Google Login
          </span>
          <BottomGradient />
        </Button>
      </div>
    </div>
  );
}
