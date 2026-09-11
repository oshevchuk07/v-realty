import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';

// proxy.ts already blocks unauthenticated requests before they reach here —
// this check is a defense-in-depth backstop, not the primary gate
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-medium">Адмінка</span>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/admin/login' });
          }}
        >
          <button type="submit" className="text-sm text-text-secondary hover:text-text-primary">
            Вийти
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
