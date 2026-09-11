import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    'use server';
    try {
      await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: '/admin',
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect('/admin/login?error=1');
      }
      throw err;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form action={login} className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-surface p-6">
        <h1 className="text-lg font-semibold">Вхід в адмінку</h1>

        {error && <p className="text-sm text-red-400">Невірний email або пароль</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border border-border bg-background px-3 py-2 outline-none focus:border-accent"
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          required
          className="w-full rounded border border-border bg-background px-3 py-2 outline-none focus:border-accent"
        />
        <button type="submit" className="w-full rounded bg-accent px-3 py-2 font-medium text-accent-foreground">
          Увійти
        </button>
      </form>
    </div>
  );
}
