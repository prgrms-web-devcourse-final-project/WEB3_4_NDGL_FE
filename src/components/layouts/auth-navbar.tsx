import { ThemeToggle } from '../ui/theme-toggle';
import { Logo } from './logo';

export const AuthNavbar = () => {
  return (
    <nav className="flex w-full items-center justify-between px-10 py-6">
      <Logo />
      <ThemeToggle />
    </nav>
  );
};
