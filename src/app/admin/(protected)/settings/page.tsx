import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const { success, error } = await searchParams;

  async function changePassword(formData: FormData) {
    'use server';
    const session = await auth();
    if (!session?.user) redirect('/admin/login');

    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') return;

    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
      redirect('/admin/settings?error=1');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(newPassword, 10) },
    });

    redirect('/admin/settings?success=1');
  }

  return (
    <div className="max-w-sm space-y-4">
      <h1 className="text-lg font-semibold">Зміна пароля</h1>

      {success && <p className="text-sm text-status-active">Пароль оновлено</p>}
      {error && <p className="text-sm text-red-400">Поточний пароль невірний</p>}

      <form action={changePassword} className="space-y-3">
        <input
          name="currentPassword"
          type="password"
          placeholder="Поточний пароль"
          required
          className="w-full rounded border border-border bg-surface px-3 py-2"
        />
        <input
          name="newPassword"
          type="password"
          placeholder="Новий пароль"
          required
          minLength={8}
          className="w-full rounded border border-border bg-surface px-3 py-2"
        />
        <button type="submit" className="w-full rounded bg-accent px-3 py-2 font-medium text-accent-foreground">
          Змінити пароль
        </button>
      </form>
    </div>
  );
}
