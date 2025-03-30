import { Banner } from '@/components/home/banner';
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
    </>
  );
}
