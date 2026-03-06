"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useState, useEffect } from "react";

export default function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch("/api/jikan?action=top&limit=8&filter=airing");
        const data = await res.json();
        setTrending(data.anime || []);
      } catch {
        // silent
      }
    }
    loadTrending();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 pb-24">
        {/* Hero Section */}
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
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300"
              >
                Explore Discovery
              </Link>
              <Link
                href="/community"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/60"
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
                  &ldquo;Late Night Watch&rdquo; picks
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
                <div className="mt-2 text-xl font-semibold">
                  {trending[0]?.title || "Astra Pulse"}
                </div>
                <p className="mt-2 text-sm text-zinc-400">
                  {trending[0]
                    ? `${trending[0].studio} • ${trending[0].episodes || "?"} eps • ${trending[0].status}`
                    : "Studio Nova • 12 eps • Ongoing"}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 p-4 text-sm text-zinc-200">
                4,812 fans are watching the live episode thread right now.
              </div>
            </div>
          </div>
        </section>

        {/* Feature Pillars */}
        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Discovery Engine",
              desc: "Dynamic trending, vibe search, and recommendation signals from real fans.",
              href: "/discover",
            },
            {
              title: "Social Forum",
              desc: "Megathreads, polls, rich posts, and live reaction rooms per episode.",
              href: "/community",
            },
            {
              title: "Personalization",
              desc: "Watchlists, contribution scoring, and seasonal bracket votes.",
              href: "/watchlist",
            },
          ].map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30"
            >
              <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm text-zinc-300">{pillar.desc}</p>
            </Link>
          ))}
        </section>

        {/* Trending Now - Real Data */}
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Trending Now</h2>
            <Link href="/discover" className="text-sm text-cyan-300 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {trending.length > 0
              ? trending.map((anime) => (
                <Link
                  key={anime.malId}
                  href={`/discover/${anime.malId}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent transition hover:border-cyan-400/30"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                    {anime.posterUrl ? (
                      <img
                        src={anime.posterUrl}
                        alt={anime.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-600">
                        No Image
                      </div>
                    )}
                    {anime.score && (
                      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-sm">
                        ★ {anime.score.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold">
                      {anime.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      {anime.studio}
                    </p>
                  </div>
                </Link>
              ))
              : // Skeleton fallback
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent"
                >
                  <div className="aspect-[3/4] w-full animate-pulse bg-zinc-800 rounded-t-2xl" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800" />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
