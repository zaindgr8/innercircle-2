import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const SITE_DESCRIPTION =
  'A private circle of founders and investors in Dubai. Small dinners, real introductions, and partnerships that outlast the evening. By member introduction only.';

// Set NEXT_PUBLIC_SITE_URL in production so OG/Twitter images resolve to the
// live domain rather than localhost.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Inner Circle DXB — A private circle for Dubai’s founders and investors',
    template: '%s | The Inner Circle DXB',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Inner Circle DXB',
    'Dubai founders network',
    'Dubai investors',
    'private members club Dubai',
    'founder dinners Dubai',
    'invite only network Dubai',
  ],
  openGraph: {
    title: 'The Inner Circle DXB',
    description: SITE_DESCRIPTION,
    images: ['/logo.jpg'],
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Inner Circle DXB',
    description: SITE_DESCRIPTION,
    images: ['/logo.jpg'],
  },
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Scroll-reveal hides content until observed. Without JS, show it all. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
