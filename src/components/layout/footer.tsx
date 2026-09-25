import { Container } from '@/components/ui/container';
import { getSiteSettings } from '@/server/site-settings';

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-border py-6">
      <Container>
        <p className="text-sm text-text-secondary">© {new Date().getFullYear()} {settings.siteName}</p>
      </Container>
    </footer>
  );
}
