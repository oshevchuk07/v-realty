import { AdminNotificationRow } from '@/components/admin/admin-notification-row';
import { CreateAdminForm } from '@/components/admin/create-admin-form';
import { prisma } from '@/lib/prisma';

export default async function AdminsPage() {
  const admins = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-6 text-xl font-semibold">Адміни та сповіщення</h1>
        <div className="space-y-3">
          {admins.map((admin) => (
            <AdminNotificationRow key={admin.id} admin={admin} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Додати адміна</h2>
        <CreateAdminForm />
      </div>
    </div>
  );
}