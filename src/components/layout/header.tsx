import { Container } from '@/components/ui/container';
import { getSiteSettings } from '@/server/site-settings';

export async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="border-b border-border">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <span className="text-lg font-semibold">{settings.siteName}</span>
          {settings.contactPhone && (
            <a href={`tel:${settings.contactPhone}`} className="text-sm text-text-secondary hover:text-text-primary">
              {settings.contactPhone}
            </a>
          )}
        </div>
      </Container>
    </header>
  );
}
