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

const featureCards = [
  {
    title: 'Build fast',
    description: 'Manual builder and AI-assisted drafts work side by side.',
  },
  {
    title: 'Save favorites',
    description: 'Keep the routines you love ready for any day.',
  },
  {
    title: 'Track progress',
    description: 'See last workout dates and performance snapshots.',
  },
];

export default function WhatIsGymmerPage() {
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

      <main className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--home-muted)] home-fade-in">
            Training hub
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl home-fade-up">
            What is Gymmer?
          </h1>
          <p className="max-w-3xl text-base text-zinc-300 sm:text-lg home-fade-up">
            Gymmer is your training hub for building routines, exploring what others are
            running, and keeping your next session one click away.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((item, index) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--home-border)] bg-zinc-900/40 p-5 text-sm text-zinc-300 home-fade-up"
              style={{ animationDelay: `${120 + index * 80}ms` }}
            >
              <div className="text-base font-semibold text-white">{item.title}</div>
              <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[var(--home-border)] bg-[var(--home-surface)] p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] home-fade-up">
          <div className="text-xs uppercase tracking-[0.35em] text-[var(--home-muted)]">
            Quick focus
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Pick the energy for your next session
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/80 p-4">
              <div className="text-sm text-zinc-400">Intensity</div>
              <div className="mt-2 text-lg font-semibold text-white">Strength + Power</div>
            </div>
            <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/80 p-4">
              <div className="text-sm text-zinc-400">Focus</div>
              <div className="mt-2 text-lg font-semibold text-white">Upper Body Split</div>
            </div>
            <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/80 p-4">
              <div className="text-sm text-zinc-400">Tempo</div>
              <div className="mt-2 text-lg font-semibold text-white">45 Minute Flow</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[var(--home-border)] bg-zinc-900/60 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:border-emerald-400/60"
          >
            Back to Home
          </Link>
          <Link
            href="/routines"
            className="inline-flex items-center justify-center rounded-full bg-[var(--home-accent-strong)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-emerald-500"
          >
            Go to Routines
          </Link>
        </div>
      </main>
    </div>
  );
}
