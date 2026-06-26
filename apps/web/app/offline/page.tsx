import Link from 'next/link';

const offlineLinks = [
  { href: '/', label: 'Back Home' },
  { href: '/login', label: 'Open Login' },
  { href: '/routines', label: 'Try Routines' },
];

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
            Offline
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Temple needs a connection for most live data.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            This first PWA release supports installability and a cached app shell. It does not yet
            support continuing workouts offline or editing routines, profile data, or settings
            without a network connection.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">What works in v1</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Install the app, reopen it quickly, and recover to a known offline screen instead of
              hitting a blank browser failure state.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">What still needs network</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Login, fresh server data, autosave sync, workout completion, AI features, and all
              editing flows.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {offlineLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/70 hover:bg-zinc-800"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
