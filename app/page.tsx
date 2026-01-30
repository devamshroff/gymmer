import Link from 'next/link';
import type { CSSProperties } from 'react';

const homeStyles = {
  '--home-ink': '#f8fafc',
  '--home-muted': '#a1a1aa',
  '--home-accent': '#34d399',
  '--home-accent-strong': '#059669',
  '--home-surface': 'rgba(24, 24, 27, 0.75)',
  '--home-border': 'rgba(148, 163, 184, 0.2)',
} as CSSProperties;

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-zinc-950 text-[var(--home-ink)]"
      style={homeStyles}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-5%] h-[28rem] w-[28rem] rounded-full bg-orange-500/20 blur-[140px]"
      />

      <main className="relative mx-auto flex min-h-[calc(100vh-96px)] max-w-4xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <p
          className="text-2xl uppercase tracking-[0.5em] text-[var(--home-muted)] home-fade-in sm:text-3xl"
          style={{ animationDelay: '80ms' }}
        >
          Training hub
        </p>
        <h1
          className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl home-fade-up"
          style={{ animationDelay: '140ms' }}
        >
          <span className="block text-2xl text-zinc-200 sm:text-3xl">welcome to</span>
          <span className="mt-4 block text-6xl text-[var(--home-accent)] sm:text-7xl lg:text-8xl">
            GYMMER
          </span>
          <span className="mt-4 block text-center text-base uppercase tracking-[0.5em] text-[var(--home-muted)] sm:text-lg">
            flow and progress
          </span>
        </h1>

        <div
          className="flex flex-col items-center gap-3 home-fade-up"
          style={{ animationDelay: '220ms' }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-full border border-[var(--home-border)] bg-zinc-900/60 px-5 py-2.5 text-sm font-semibold text-[var(--home-ink)] transition hover:-translate-y-0.5 hover:border-emerald-400/60"
            >
              My Profile
            </Link>
            <Link
              href="/routines"
              className="inline-flex items-center justify-center rounded-full bg-[var(--home-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              My Routines
            </Link>
          </div>
          <Link
            href="/routines/browse"
            className="inline-flex items-center justify-center rounded-full border border-[var(--home-border)] bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400/60"
          >
            Browse Public Routines
          </Link>
        </div>

        <Link
          href="/what-is-gymmer"
          className="mt-12 inline-flex items-center justify-center rounded-full border border-transparent bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:-translate-y-0.5 hover:bg-white/20 home-fade-up sm:mt-16 lg:mt-20"
          style={{ animationDelay: '300ms' }}
        >
          What is Gymmer?
        </Link>
      </main>
    </div>
  );
}
