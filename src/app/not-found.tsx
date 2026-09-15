import Link from 'next/link';
import { Container } from '@/components/ui/container';

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-6xl font-semibold text-accent">404</p>
        <p className="mt-4 text-lg">Сторінку не знайдено</p>
        <p className="mt-2 text-text-secondary">Можливо, об&apos;єкт вже продано або здано</p>
        <Link href="/" className="mt-6 rounded bg-accent px-4 py-2 font-medium text-accent-foreground">
          На головну
        </Link>
      </div>
    </Container>
  );
}
