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
            <Link
              href="/report-bug"
              className="fixed right-4 top-4 z-50 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:border-zinc-600 hover:bg-zinc-800"
            >
              Report bug
            </Link>
            <div className="flex-1">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
