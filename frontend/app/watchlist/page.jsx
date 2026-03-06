"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const STATUS_TABS = [
  { key: "ALL", label: "All" },
  { key: "WATCHING", label: "Watching" },
  { key: "PLANNED", label: "Planned" },
  { key: "COMPLETED", label: "Completed" },
  { key: "DROPPED", label: "Dropped" },
];

const STATUS_COLORS = {
  WATCHING: "bg-emerald-500/20 text-emerald-300",
  PLANNED: "bg-cyan-500/20 text-cyan-300",
  COMPLETED: "bg-purple-500/20 text-purple-300",
  DROPPED: "bg-red-500/20 text-red-300",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${STATUS_COLORS[status] || "bg-zinc-800 text-zinc-400"
        }`}
    >
      {status}
    </span>
  );
}

export default function WatchlistPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session?.user) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/watchlist");
        const data = await res.json();
        setWatchlist(data.watchlist || []);
      } catch {
        // silent
      }
      setLoading(false);
    }
    load();
  }, [session, sessionStatus]);

  async function updateStatus(entryId, newStatus) {
    // Optimistic update
    setWatchlist((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, status: newStatus } : e))
    );

    try {
      const res = await fetch("/api/watchlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entryId, status: newStatus }),
      });
      if (!res.ok) {
        // Revert on failure — re-fetch
        const refetch = await fetch("/api/watchlist");
        const data = await refetch.json();
        setWatchlist(data.watchlist || []);
      }
    } catch {
      // silent
    }
  }

  async function removeEntry(entryId) {
    setRemovingId(entryId);
    try {
      const res = await fetch(`/api/watchlist?id=${entryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWatchlist((prev) => prev.filter((e) => e.id !== entryId));
      }
    } catch {
      // silent
    }
    setRemovingId(null);
  }

  const filtered =
    filter === "ALL"
      ? watchlist
      : watchlist.filter((e) => e.status === filter);

  const counts = {};
  STATUS_TABS.forEach((tab) => {
    counts[tab.key] =
      tab.key === "ALL"
        ? watchlist.length
        : watchlist.filter((e) => e.status === tab.key).length;
  });

  // Not logged in
  if (sessionStatus !== "loading" && !session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
        <Navbar />
        <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center">
          <svg
            className="h-20 w-20 text-zinc-700 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold">Track Your Anime</h1>
          <p className="mt-2 text-zinc-400">
            Sign in to create your personal watchlist and track your progress.
          </p>
          <Link
            href="/login"
            className="mt-6 rounded-xl bg-cyan-400 px-8 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300"
          >
            Sign In
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Watchlist</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {watchlist.length}{" "}
              {watchlist.length === 1 ? "title" : "titles"} tracked
            </p>
          </div>
          <Link
            href="/discover"
            className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300"
          >
            + Browse Anime
          </Link>
        </div>

        {/* Status filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filter === tab.key
                  ? "bg-cyan-400 text-zinc-900"
                  : "border border-white/10 text-zinc-300 hover:border-white/30"
                }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  ({counts[tab.key]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Watchlist content */}
        <section className="mt-8">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-28 w-20 rounded-lg bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-16 rounded bg-zinc-800" />
                      <div className="h-4 w-3/4 rounded bg-zinc-800" />
                      <div className="h-3 w-1/2 rounded bg-zinc-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-zinc-500">
              <svg
                className="h-16 w-16 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-lg font-medium">
                {filter === "ALL"
                  ? "Your watchlist is empty"
                  : `No ${filter.toLowerCase()} titles`}
              </p>
              <p className="mt-1 text-sm">
                Head to{" "}
                <Link
                  href="/discover"
                  className="text-cyan-400 hover:underline"
                >
                  Discover
                </Link>{" "}
                to find anime you love.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  className="group relative rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-cyan-400/20"
                >
                  <Link
                    href={`/discover/${entry.anime?.malId || ""}`}
                    className="flex gap-3"
                  >
                    {entry.anime?.posterUrl ? (
                      <img
                        src={entry.anime.posterUrl}
                        alt={entry.anime.title}
                        className="h-28 w-20 rounded-lg object-cover border border-white/10"
                      />
                    ) : (
                      <div className="flex h-28 w-20 items-center justify-center rounded-lg bg-zinc-800 text-xs text-zinc-600">
                        ?
                      </div>
                    )}

                    <div className="flex flex-1 flex-col">
                      <StatusBadge status={entry.status} />
                      <h3 className="mt-1.5 text-sm font-semibold leading-snug line-clamp-2">
                        {entry.anime?.title || "Unknown Anime"}
                      </h3>
                      {entry.anime?.studio && (
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {entry.anime.studio}
                        </p>
                      )}
                      {entry.anime?.episodes && (
                        <p className="text-xs text-zinc-500">
                          {entry.anime.episodes} episodes
                        </p>
                      )}
                      {entry.anime?.genres?.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {entry.anime.genres.slice(0, 2).map((g) => (
                            <span
                              key={g}
                              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-400"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Actions bar */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                    <select
                      value={entry.status}
                      onChange={(e) => updateStatus(entry.id, e.target.value)}
                      className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-zinc-300 focus:border-cyan-400/40 focus:outline-none"
                    >
                      <option value="WATCHING">Watching</option>
                      <option value="PLANNED">Planned</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="DROPPED">Dropped</option>
                    </select>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      disabled={removingId === entry.id}
                      className="flex items-center gap-1 text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
                      type="button"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      {removingId === entry.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
