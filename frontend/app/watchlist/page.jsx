import Link from "next/link";

export const metadata = {
  title: "Watchlist | AimeHub",
  description: "Track what you are watching, planning, or finished.",
};

const sections = [
  { title: "Watching", items: ["Astra Pulse", "Echo Blossom", "Juniper Sky"] },
  { title: "Planned", items: ["Crimson Wave", "Noir Circuit"] },
  { title: "Completed", items: ["Starlit Drift", "Monochrome Signal"] },
];

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold">
          AimeHub
        </Link>
        <nav className="flex gap-4 text-sm text-zinc-300">
          <Link href="/discover" className="hover:text-white">
            Discover
          </Link>
          <Link href="/community" className="hover:text-white">
            Community
          </Link>
          <Link href="/profile/you" className="hover:text-white">
            Profile
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Your Watchlist</h1>
              <p className="mt-2 text-sm text-zinc-300">
                Keep track of what you are watching and what is next.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-zinc-900"
            >
              Add New Title
            </button>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                  >
                    <div className="text-sm font-semibold">{item}</div>
                    <div className="text-xs text-zinc-400">
                      Updated 2 days ago
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
