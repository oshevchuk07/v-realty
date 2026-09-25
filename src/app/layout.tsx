import type { Metadata } from 'next';
import { Geist, Geist_Mono, Manrope } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/server/site-settings';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: { default: settings.seoTitle ?? settings.siteName, template: '%s' },
    description: settings.seoDescription ?? undefined,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="uk"
      className={`${manrope.variable} h-full antialiased`}
      style={{ '--color-accent': settings.accentColor } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
