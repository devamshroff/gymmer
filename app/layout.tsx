import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GYMMER",
  description: "flow and progress",
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
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <footer className="border-t border-zinc-800 bg-zinc-900">
              <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-6">
                <Link
                  href="/report-bug"
                  className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-zinc-600 hover:bg-zinc-700"
                >
                  Report bug
                </Link>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
