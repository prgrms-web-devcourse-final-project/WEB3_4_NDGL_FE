import { Banner } from '@/components/home/banner';
import { FloatingButton } from '@/components/layouts/floating-button';
import { Navbar } from '@/components/layouts/navbar';

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Navbar />
      <Banner />
      {children}
      <FloatingButton />
    </>
  );
}
