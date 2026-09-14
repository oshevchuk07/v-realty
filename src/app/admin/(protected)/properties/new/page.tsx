import { PropertyForm } from '@/components/admin/property-form';
import { createProperty } from '@/server/admin-properties';

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Новий об&apos;єкт</h1>
      <PropertyForm action={createProperty} />
    </div>
  );
}
