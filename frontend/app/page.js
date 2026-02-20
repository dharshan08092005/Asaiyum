import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-black font-bold">
            AH
          </div>
          <div className="text-lg font-semibold tracking-wide">AimeHub</div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <Link href="/discover" className="hover:text-white">
            Discover
          </Link>
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
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-white/60"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            Create Account
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="grid items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
              Next-gen anime ecosystem
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Discovery. Discussion. Personalization. All in one unified anime
              community.
            </h1>
            <p className="text-lg text-zinc-300">
              AimeHub blends trending intelligence, real-time fan threads, and
              tailored watchlists to help you find the perfect show and the
              perfect community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/discover"
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-cyan-300"
              >
                Explore Discovery
              </Link>
              <Link
                href="/community"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/60"
              >
                Join Community
              </Link>
            </div>
            <div className="grid gap-4 text-sm text-zinc-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                24h Trending Wall
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                140k Recommendations
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                8k Live Threads
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8">
            <div className="absolute right-6 top-6 rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">
              Live reactions
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-black/60 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Vibe search
                </div>
                <div className="mt-2 text-lg font-semibold">
                  “Late Night Watch” picks
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-300">
                  {["Monochrome", "Cyber Glow", "Lo-fi Nights", "Quiet Drama"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="rounded-2xl bg-black/60 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Community Choice</span>
                  <span className="text-cyan-300">#1 This Week</span>
                </div>
                <div className="mt-2 text-xl font-semibold">Astra Pulse</div>
                <p className="mt-2 text-sm text-zinc-400">
                  Studio Nova • 12 eps • Ongoing
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 p-4 text-sm text-zinc-200">
                4,812 fans are watching the live episode thread right now.
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Discovery Engine",
              desc: "Dynamic trending, vibe search, and recommendation signals from real fans.",
            },
            {
              title: "Social Forum",
              desc: "Megathreads, polls, rich posts, and live reaction rooms per episode.",
            },
            {
              title: "Personalization",
              desc: "Watchlists, contribution scoring, and seasonal bracket votes.",
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-xl font-semibold">{pillar.title}</h3>
              <p className="mt-3 text-sm text-zinc-300">{pillar.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Trending Now</h2>
            <Link href="/discover" className="text-sm text-cyan-300">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Nova Rift", "Juniper Sky", "Echo Blossom", "Noir Circuit"].map(
              (title) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4"
                >
                  <div className="h-32 rounded-xl bg-white/10" />
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Community recommendation surge
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
