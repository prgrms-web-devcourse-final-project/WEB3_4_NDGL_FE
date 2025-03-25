import { LINKS } from '@/constants/links';
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
      <Logo />
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
