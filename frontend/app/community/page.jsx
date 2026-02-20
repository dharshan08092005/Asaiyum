import Link from "next/link";

export const metadata = {
  title: "Community | AimeHub",
  description: "Join megathreads, live reaction rooms, and polls.",
};

const liveThreads = [
  { title: "Astra Pulse Ep. 09 Live Reactions", viewers: "4.8k" },
  { title: "Juniper Sky Ep. 03 Watch Party", viewers: "2.1k" },
  { title: "Noir Circuit Finale Thread", viewers: "6.5k" },
];

const megathreads = [
  "Nova Rift Official Megathread",
  "Echo Blossom Season Hub",
  "Crimson Wave Rewatch",
  "Starlit Drift Lore Vault",
];

export default function CommunityPage() {
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Social Forum</h1>
              <p className="mt-2 text-sm text-zinc-300">
                Live rooms, megathreads, polls, and spoiler-safe discussions.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-zinc-900"
            >
              Start a Thread
            </button>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {liveThreads.map((thread) => (
              <div
                key={thread.title}
                className="rounded-2xl border border-white/10 bg-black/40 p-4"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Live Now
                </div>
                <h3 className="mt-2 text-lg font-semibold">{thread.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {thread.viewers} watching now
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Megathreads</h2>
            <div className="mt-4 space-y-3">
              {megathreads.map((thread) => (
                <div
                  key={thread}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                >
                  <span>{thread}</span>
                  <span className="text-xs text-zinc-400">Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Community Polls</h2>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="text-sm text-zinc-300">
                Which winter release deserves the Community Choice badge?
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {["Nova Rift", "Juniper Sky", "Echo Blossom"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2"
                  >
                    <input type="radio" name="poll" className="h-4 w-4" />
                    {option}
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold"
              >
                Submit Vote
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
