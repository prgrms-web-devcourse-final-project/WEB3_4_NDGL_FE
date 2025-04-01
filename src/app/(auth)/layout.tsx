import { AuthNavbar } from '@/components/layouts/auth-navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <AuthNavbar />
      <main className="flex h-full items-start justify-center max-sm:px-4 max-sm:pt-8 md:items-center">
        {children}
      </main>
    </div>
  );
}
