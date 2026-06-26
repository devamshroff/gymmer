import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f7f4] px-5 py-8 text-[#08080b]">
      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl flex-col justify-center">
        <div className="mb-10 text-center">
          <span
            aria-hidden
            className="mx-auto block h-20 w-20 rounded-2xl bg-[url('/icons/gymmer-icon.svg')] bg-cover bg-center shadow-2xl shadow-[#3b207f]/20"
          />
          <h1 className="mt-6 text-5xl font-semibold text-[#08080b] sm:text-6xl">
            Temple
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/nutrition"
            className="rounded-lg border border-[#757567]/35 bg-[#eaeae3] p-6 text-center text-[#08080b] shadow-sm transition hover:-translate-y-0.5 hover:border-[#758700] hover:bg-[#dfdfd6]"
          >
            <span className="block text-2xl font-semibold">Nommer</span>
          </Link>
          <Link
            href="/workout"
            className="rounded-lg border border-[#757567]/35 bg-white/70 p-6 text-center text-[#08080b] shadow-sm transition hover:-translate-y-0.5 hover:border-[#758700] hover:bg-[#efefe9]"
          >
            <span className="block text-2xl font-semibold">Gymmer</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
