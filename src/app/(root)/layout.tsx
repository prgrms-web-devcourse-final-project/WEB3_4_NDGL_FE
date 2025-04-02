import { FloatingButton } from '@/components/layouts/floating-button';
import { Navbar } from '@/components/layouts/navbar';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <FloatingButton />
    </>
  );
}
