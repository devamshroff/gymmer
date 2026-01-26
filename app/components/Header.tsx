'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <Link href="/" className="block text-center mb-6">
      <span className="text-2xl font-bold text-green-500">GYMMER</span>
    </Link>
  );
}
