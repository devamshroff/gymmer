'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <Link href="/" className="block text-center mb-6">
      <span className="text-2xl font-bold text-emerald-700">GYMMER</span>
    </Link>
  );
}
