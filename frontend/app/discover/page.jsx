"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/app/components/Navbar";

const GENRE_MAP = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 4, name: "Comedy" },
  { id: 8, name: "Drama" },
  { id: 10, name: "Fantasy" },
  { id: 22, name: "Romance" },
  { id: 24, name: "Sci-Fi" },
  { id: 36, name: "Slice of Life" },
  { id: 14, name: "Horror" },
  { id: 7, name: "Mystery" },
  { id: 25, name: "Shoujo" },
  { id: 27, name: "Shounen" },
  { id: 18, name: "Mecha" },
  { id: 40, name: "Psychological" },
  { id: 30, name: "Sports" },
  { id: 42, name: "Seinen" },
];

const TABS = [
  { key: "top", label: "Top Rated" },
  { key: "season", label: "This Season" },
  { key: "upcoming", label: "Upcoming" },
];

function AnimeCard({ anime }) {
  return (
    <Link
      href={`/discover/${anime.malId}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/5"
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
            <svg
              className="h-3 w-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {anime.score.toFixed(1)}
          </div>
        )}
        {anime.type && (
          <div className="absolute left-2 top-2 rounded-full bg-cyan-500/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {anime.type}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
          {anime.title}
        </h3>
        <p className="mt-1 text-xs text-zinc-400">{anime.studio}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          {anime.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-400"
            >
              {g}
            </span>
          ))}
          {anime.episodes && (
            <span className="ml-auto text-[10px] text-zinc-500">
              {anime.episodes} eps
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <div className="aspect-[3/4] w-full animate-pulse bg-zinc-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800" />
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("top");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch anime data
  const fetchAnime = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let url;

      if (debouncedQuery || selectedGenre) {
        // Search mode
        const params = new URLSearchParams({
          action: "search",
          page: String(page),
          limit: "24",
        });
        if (debouncedQuery) params.set("q", debouncedQuery);
        if (selectedGenre) params.set("genres", String(selectedGenre));
        url = `/api/jikan?${params.toString()}`;
      } else {
        // Tab-based browsing
        url = `/api/jikan?action=${activeTab}&page=${page}&limit=24`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch anime data.");
        setAnimeList([]);
        return;
      }

      setAnimeList(data.anime || []);
      setPagination(data.pagination || null);
    } catch {
      setError("Failed to connect to the server.");
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedQuery, selectedGenre, page]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre((prev) => (prev === genreId ? null : genreId));
    setPage(1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedGenre(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8">
        {/* Search Bar */}
        <section className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 focus-within:border-cyan-400/40">
            <svg
              className="h-5 w-5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              placeholder="Search anime by title, studio, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedQuery("");
                }}
                className="text-zinc-400 hover:text-white"
                type="button"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </section>

        {/* Genre Filters */}
        <section className="mt-6">
          <div className="flex flex-wrap gap-2">
            {GENRE_MAP.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => handleGenreClick(genre.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${selectedGenre === genre.id
                  ? "bg-cyan-400 text-zinc-900"
                  : "border border-white/10 text-zinc-300 hover:border-cyan-400/40 hover:text-cyan-300"
                  }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </section>

        {/* Tabs */}
        {!debouncedQuery && !selectedGenre && (
          <section className="mt-8">
            <div className="flex gap-1 rounded-xl bg-white/5 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab.key)}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${activeTab === tab.key
                    ? "bg-cyan-400 text-zinc-900 shadow-lg shadow-cyan-400/20"
                    : "text-zinc-400 hover:text-white"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Search indicator */}
        {(debouncedQuery || selectedGenre) && (
          <div className="mt-6 flex items-center gap-2 text-sm text-zinc-400">
            <span>
              {debouncedQuery && <>Searching for &quot;{debouncedQuery}&quot;</>}
              {debouncedQuery && selectedGenre && " in "}
              {selectedGenre && (
                <>
                  genre:{" "}
                  <span className="text-cyan-400">
                    {GENRE_MAP.find((g) => g.id === selectedGenre)?.name}
                  </span>
                </>
              )}
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setDebouncedQuery("");
                setSelectedGenre(null);
                setPage(1);
              }}
              className="ml-2 text-xs text-cyan-400 hover:underline"
              type="button"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-sm text-red-300">
            {error}
            <button
              onClick={fetchAnime}
              className="ml-3 text-red-200 underline hover:text-white"
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {/* Anime Grid */}
        <section className="mt-8">
          {loading ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))}
            </div>
          ) : animeList.length === 0 && !error ? (
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">No anime found</p>
              <p className="mt-1 text-sm">
                Try a different search term or genre.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {animeList.map((anime) => (
                <AnimeCard key={anime.malId} anime={anime} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {pagination && pagination.last_visible_page > 1 && (
          <section className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-sm text-zinc-500">
              Page {page} of {pagination.last_visible_page}
            </span>
            <button
              type="button"
              disabled={!pagination.has_next_page}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
