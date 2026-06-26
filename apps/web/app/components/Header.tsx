import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-base font-semibold uppercase tracking-[0.35em] text-emerald-200 sm:text-lg"
          aria-label="Temple home"
        >
          <span
            aria-hidden
            className="h-8 w-8 shrink-0 rounded-lg bg-[url('/icons/gymmer-icon.svg')] bg-cover bg-center"
          />
          <span>Temple</span>
        </Link>
      </div>
    </header>
  );
}
