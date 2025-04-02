import { Banner } from '@/components/home/banner';

type HomeayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeayoutProps) {
  return (
    <>
      <Banner />
      {children}
    </>
  );
}
