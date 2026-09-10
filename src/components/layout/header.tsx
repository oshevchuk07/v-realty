import { Container } from '@/components/ui/container';

// Minimal header: agent contact info lives here, no hero/bio section
export function Header() {
  return (
    <header className="border-b border-border">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <span className="text-lg font-semibold">Нерухомість</span>
          <a href="tel:+380000000000" className="text-sm text-text-secondary hover:text-text-primary">
            +380 00 000 00 00
          </a>
        </div>
      </Container>
    </header>
  );
}
