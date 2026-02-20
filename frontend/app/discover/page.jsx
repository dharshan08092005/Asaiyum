import Link from "next/link";

export const metadata = {
  title: "Discover | AimeHub",
  description: "Explore trending anime, genres, and vibe-based discovery.",
};

const genres = [
  "Shonen",
  "Seinen",
  "Slice of Life",
  "Fantasy",
  "Psychological",
  "Mecha",
  "Romance",
  "Mystery",
];

const vibes = [
  "Hype",
  "Depressing",
  "Feel Good",
  "Late Night Watch",
  "Cozy",
  "Mind-bending",
];

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold">
          AimeHub
        </Link>
        <nav className="flex gap-4 text-sm text-zinc-300">
          <Link href="/community" className="hover:text-white">
            Community
          </Link>
          <Link href="/watchlist" className="hover:text-white">
            Watchlist
          </Link>
          <Link href="/profile/you" className="hover:text-white">
            Profile
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-semibold">Discovery Engine</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Ranked by community recommendations and real-time engagement.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["24h", "7 days", "All time"].map((period, index) => (
              <button
                key={period}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  index === 0
                    ? "bg-cyan-400 text-zinc-900"
                    : "border border-white/10 text-white/80 hover:border-white/40"
                }`}
                type="button"
              >
                {period}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Nova Rift", "Juniper Sky", "Echo Blossom", "Noir Circuit", "Crimson Wave", "Starlit Drift"].map(
              (title, index) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <div className="text-xs text-zinc-400">
                    Rank #{index + 1}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    4.8k recommends • Studio Nova
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Global Search</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Search by title, studio, air date, or synopsis.
            </p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
              <input
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                placeholder="Search anime, studios, or vibes..."
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
              {["Studio", "Air date", "Trailer", "Synopsis"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Vibe Search</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Find shows by mood instead of genre.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {vibes.map((vibe) => (
                <button
                  key={vibe}
                  type="button"
                  className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:border-cyan-400 hover:text-cyan-300"
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Genre Filters</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:border-emerald-400 hover:text-emerald-300"
              >
                {genre}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
