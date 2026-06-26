import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import Link from 'next/link';
import Header from './components/Header';
import PwaBootstrap from './components/PwaBootstrap';
import PwaStatusBanner from './components/PwaStatusBanner';
import { PWA_MANIFEST_PATH, PWA_THEME_COLOR } from '@/lib/pwa/config';

export const metadata: Metadata = {
  applicationName: 'Temple',
  title: 'Temple',
  description: 'flow and progress',
  manifest: PWA_MANIFEST_PATH,
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192-v4.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512-v4.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon-v4.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Temple',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: PWA_THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <PwaBootstrap />
          <PwaStatusBanner />
          <div className="min-h-screen flex flex-col">
            <Header />
            <Link
              href="/report-bug"
              className="fixed right-4 top-4 z-50 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:border-zinc-600 hover:bg-zinc-800"
            >
              Report Bug
            </Link>
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
