import { LINKS } from '@/constants/links';
import Link from 'next/link';
import { LogoIcon } from '../ui/icons';
import { navbarItems, NavbarItemsType } from '@/constants/navbar';
import { Search } from '../common/search';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const Navbar = () => {
  const renderNavbarLinks = (item: NavbarItemsType) => {
    switch (item.id) {
      case 'logout':
        return (
          <Button variant="ghost" className="cursor-pointer font-semibold">
            {item.label}
          </Button>
        );
      case 'collection':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer font-semibold">
                {item.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>좋아요</DropdownMenuItem>
              <DropdownMenuItem>팔로우</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return item.href ? (
          <Link href={item.href} className="font-semibold">
            {item.label}
          </Link>
        ) : null;
    }
  };

  return (
    <nav className="flex w-full items-center justify-between px-10 py-6">
      <Link href={LINKS.HOME} className="flex items-center gap-2.5">
        <LogoIcon className="size-6" pathClassName="fill-foreground" />
        <h1 className="text-sm font-extrabold">어디 갔대?</h1>
      </Link>
      <div className="flex items-center gap-6">
        {false ? (
          <Link href={LINKS.SIGN_IN}>
            <Button variant="ghost" className="cursor-pointer font-semibold">
              로그인
            </Button>
          </Link>
        ) : (
          <ul className="flex items-center gap-4 text-sm font-medium text-gray-800">
            {navbarItems.map((item) => (
              <li key={item.id}>{renderNavbarLinks(item)}</li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Search />
        </div>
      </div>
    </nav>
  );
};
