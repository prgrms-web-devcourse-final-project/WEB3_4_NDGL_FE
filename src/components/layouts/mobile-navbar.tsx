import { navbarItems } from '@/constants/navbar';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ThemeToggle } from '../ui/theme-toggle';
import { Logo } from './logo';

export const MobileNavbar = () => {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="block md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-72">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">
            <Logo />
          </DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-4 px-6 py-4">
          {navbarItems.map((item) => (
            <Link
              key={item.id}
              href={item.href || '#'}
              className="rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-auto flex items-center justify-between px-3 py-2">
            <span className="font-medium">테마 변경</span>
            <ThemeToggle />
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
};
