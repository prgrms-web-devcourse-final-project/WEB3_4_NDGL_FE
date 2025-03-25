import { AllPosts } from '@/components/home/all-posts';
import { BestPosts } from '@/components/home/best-posts';

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6 px-10">
      <BestPosts />
      <AllPosts />
    </main>
  );
}
