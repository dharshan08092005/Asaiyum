import Link from "next/link";

export const metadata = {
  title: "Profile | AimeHub",
  description: "Your anime profile, contribution score, and activity.",
};

export default function ProfilePage({ params }) {
  const username = params?.username ?? "you";

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
        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/10" />
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  @{username}
                </div>
                <div className="text-xl font-semibold">Kai Moru</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-300">
              Building late-night watchlists and sci-fi megathreads. Loves
              character-driven space dramas.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                Contribution Score: <span className="text-cyan-300">4,820</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                Recommendations: <span className="text-emerald-300">312</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                Live Threads Joined: <span className="text-amber-300">48</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Current Watchlist</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {["Astra Pulse", "Noir Circuit", "Echo Blossom", "Juniper Sky"].map(
                  (title) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                    >
                      <div className="text-sm font-semibold">{title}</div>
                      <div className="text-xs text-zinc-400">Watching</div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                {[
                  "Recommended Astra Pulse in Discovery Engine",
                  "Joined Live Thread: Juniper Sky Ep. 03",
                  "Voted in Winter Community Choice poll",
                ].map((activity) => (
                  <div
                    key={activity}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                  >
                    {activity}
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
