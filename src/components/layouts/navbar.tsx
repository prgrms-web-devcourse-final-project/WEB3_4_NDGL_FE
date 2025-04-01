import Link from 'next/link';
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
import { Logo } from './logo';
import { MobileNavbar } from './mobile-navbar';
import { cookies } from 'next/headers';
import { LINKS } from '@/constants/links';

export const Navbar = async () => {
  // TODO: 수정 필요
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');

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
    <nav className="flex w-full items-center justify-between px-6 py-6 md:px-10">
      <Logo />
      <div className="hidden items-center gap-6 md:flex">
        {token ? (
          <ul className="flex items-center gap-4 text-sm font-medium text-gray-800 dark:text-gray-300">
            {navbarItems.map((item) => (
              <li key={item.id}>{renderNavbarLinks(item)}</li>
            ))}
          </ul>
        ) : (
          <Button variant="ghost" className="cursor-pointer font-semibold">
            <Link href={LINKS.SIGN_IN} className="flex items-center gap-2">
              로그인
            </Link>
          </Button>
        )}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Search />
        </div>
      </div>
      <MobileNavbar />
    </nav>
  );
};
