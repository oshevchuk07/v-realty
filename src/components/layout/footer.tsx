import { Container } from '@/components/ui/container';

export function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <Container>
        <p className="text-sm text-text-secondary">© {new Date().getFullYear()} Нерухомість</p>
      </Container>
    </footer>
  );
}
