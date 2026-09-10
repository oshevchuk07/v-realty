import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { StatusBadge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { PriceTag } from '@/components/ui/price-tag';

export default function Home() {
  return (
    <>
      <Header />
      <main className="py-8">
        <Container>
          <div className="flex items-center gap-3">
            <StatusBadge status="ACTIVE" />
            <PriceTag usd={85000} uah={3560000} />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
