import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-base font-semibold uppercase tracking-[0.45em] text-emerald-200 sm:text-lg"
          aria-label="Gymmer home"
        >
          Gymmer
        </Link>
      </div>
    </header>
  );
}
