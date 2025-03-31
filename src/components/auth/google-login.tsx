'use client';

import { BottomGradient } from '../ui/bottom-gradient';
import { Button } from '../ui/button';
import { GoogleIcon } from '../ui/icons';

export const GoogleLogin = () => {
  const loginWithGoogle = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button
        onClick={loginWithGoogle}
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
  );
};
