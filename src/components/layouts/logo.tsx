import { LINKS } from '@/constants/links';
import Link from 'next/link';
import { LogoIcon } from '../ui/icons';

export const Logo = () => {
  return (
    <Link href={LINKS.HOME} className="flex items-center gap-2.5">
      <LogoIcon className="size-6" pathClassName="fill-foreground" />
      <h1 className="text-sm font-extrabold">어디 갔대?</h1>
    </Link>
  );
};
