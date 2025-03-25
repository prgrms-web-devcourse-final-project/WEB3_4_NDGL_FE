import { AuthNavbar } from '@/components/layouts/auth-navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden">
      <AuthNavbar />
      <main className="flex h-full items-center justify-center">
        {children}
      </main>
    </div>
  );
}
