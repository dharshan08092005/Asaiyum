import Link from "next/link";

export const metadata = {
  title: "Anime | AimeHub",
  description: "Anime details, megathreads, and community activity.",
};

export default function AnimeDetailPage({ params }) {
  const animeId = params?.id ?? "unknown";

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
          <Link href="/watchlist" className="hover:text-white">
            Watchlist
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="h-72 rounded-2xl bg-white/10" />
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-400">
              {["Shonen", "Sci-fi", "Action"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-zinc-900"
              >
                Recommend This
              </button>
              <button
                type="button"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold"
              >
                Save to Watchlist
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Anime ID: {animeId}
              </div>
              <h1 className="mt-3 text-3xl font-semibold">Astra Pulse</h1>
              <p className="mt-3 text-sm text-zinc-300">
                A rogue crew of astro-divers uncovers a fractal signal hidden in
                deep space, pulling them into an interstellar conspiracy.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-zinc-500">Studio</div>
                  Studio Nova
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Air Date</div>
                  Oct 2025
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Status</div>
                  Ongoing
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Community Activity</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  "Live Episode 09 Thread",
                  "Soundtrack Breakdown",
                  "Lore Vault: Signal 7",
                  "Fan Art Spotlight",
                ].map((thread) => (
                  <div
                    key={thread}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <div className="text-xs text-zinc-400">Thread</div>
                    <div className="mt-2 text-sm font-semibold">{thread}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
