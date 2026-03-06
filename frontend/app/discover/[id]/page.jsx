"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";

function StarIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

const WATCHLIST_STATUSES = [
    { key: "WATCHING", label: "Watching", icon: "▶", color: "bg-emerald-500" },
    { key: "PLANNED", label: "Plan to Watch", icon: "📋", color: "bg-cyan-500" },
    { key: "COMPLETED", label: "Completed", icon: "✓", color: "bg-purple-500" },
    { key: "DROPPED", label: "Dropped", icon: "✕", color: "bg-red-500" },
];

function WatchlistButton({ anime, malId }) {
    const { data: session } = useSession();
    const [inWatchlist, setInWatchlist] = useState(false);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [currentStatus, setCurrentStatus] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [saving, setSaving] = useState(false);

    // Check if anime is already in watchlist
    useEffect(() => {
        if (!session?.user || !malId) return;

        async function check() {
            try {
                const res = await fetch(`/api/watchlist?checkMalId=${malId}`);
                const data = await res.json();
                setInWatchlist(data.inWatchlist);
                setCurrentEntry(data.entry);
                setCurrentStatus(data.entry?.status || "");
            } catch {
                // silent
            }
        }
        check();
    }, [session, malId]);

    async function addToWatchlist(status) {
        if (!session?.user) return;
        setSaving(true);
        setShowDropdown(false);

        try {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    malId: Number(malId),
                    status,
                    title: anime.title,
                    titleJp: anime.titleJp,
                    synopsis: anime.synopsis,
                    studio: anime.studio,
                    posterUrl: anime.posterUrl,
                    genres: anime.genres,
                    themes: anime.themes,
                    episodes: anime.episodes,
                    animeStatus: anime.status,
                    rating: anime.rating,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setInWatchlist(true);
                setCurrentEntry(data.watchlist);
                setCurrentStatus(status);
            }
        } catch {
            // silent
        }
        setSaving(false);
    }

    async function removeFromWatchlist() {
        if (!currentEntry?.id) return;
        setSaving(true);
        setShowDropdown(false);

        try {
            const res = await fetch(`/api/watchlist?id=${currentEntry.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setInWatchlist(false);
                setCurrentEntry(null);
                setCurrentStatus("");
            }
        } catch {
            // silent
        }
        setSaving(false);
    }

    if (!session?.user) {
        return (
            <Link
                href="/login"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 px-5 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400/10"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Sign in to add to Watchlist
            </Link>
        );
    }

    const activeCfg = WATCHLIST_STATUSES.find((s) => s.key === currentStatus);

    return (
        <div className="relative mt-4 inline-block">
            {inWatchlist ? (
                <button
                    onClick={() => setShowDropdown((v) => !v)}
                    disabled={saving}
                    type="button"
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${activeCfg?.color || "bg-cyan-500"
                        } hover:opacity-90 disabled:opacity-50`}
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {saving ? "Saving..." : activeCfg?.label || "In Watchlist"}
                    <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            ) : (
                <button
                    onClick={() => setShowDropdown((v) => !v)}
                    disabled={saving}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300 disabled:opacity-50"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {saving ? "Adding..." : "Add to Watchlist"}
                </button>
            )}

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
                        {WATCHLIST_STATUSES.map((s) => (
                            <button
                                key={s.key}
                                type="button"
                                onClick={() => addToWatchlist(s.key)}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-white/5 ${currentStatus === s.key ? "text-cyan-400 font-semibold" : "text-zinc-200"
                                    }`}
                            >
                                <span className="text-base">{s.icon}</span>
                                {s.label}
                                {currentStatus === s.key && (
                                    <svg className="ml-auto h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}

                        {inWatchlist && (
                            <>
                                <div className="border-t border-white/10" />
                                <button
                                    type="button"
                                    onClick={removeFromWatchlist}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 transition hover:bg-white/5"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove from Watchlist
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function AnimeDetailPage() {
    const params = useParams();
    const malId = params.id;

    const [anime, setAnime] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!malId) return;

        async function fetchDetails() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`/api/jikan?action=details&id=${malId}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Failed to fetch anime details.");
                    return;
                }

                setAnime(data.anime);
                setCharacters(data.characters || []);
                setRecommendations(data.recommendations || []);
            } catch {
                setError("Failed to connect to the server.");
            } finally {
                setLoading(false);
            }
        }

        fetchDetails();
    }, [malId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
                <Navbar />
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <div className="flex flex-col gap-8 md:flex-row">
                        <div className="h-[450px] w-[300px] shrink-0 animate-pulse rounded-2xl bg-zinc-800" />
                        <div className="flex-1 space-y-4">
                            <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-800" />
                            <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
                            <div className="h-4 w-1/4 animate-pulse rounded bg-zinc-800" />
                            <div className="mt-6 h-32 w-full animate-pulse rounded bg-zinc-800" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !anime) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
                <Navbar />
                <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20">
                    <p className="text-lg text-red-400">{error || "Anime not found."}</p>
                    <Link
                        href="/discover"
                        className="mt-4 text-sm text-cyan-400 hover:underline"
                    >
                        ← Back to Discover
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
                {/* Back link */}
                <Link
                    href="/discover"
                    className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-6"
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Discover
                </Link>

                {/* Hero section */}
                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Poster */}
                    <div className="shrink-0">
                        {anime.posterUrl ? (
                            <img
                                src={anime.posterUrl}
                                alt={anime.title}
                                className="w-[280px] rounded-2xl border border-white/10 shadow-2xl shadow-cyan-400/5"
                            />
                        ) : (
                            <div className="flex h-[400px] w-[280px] items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 text-sm text-zinc-600">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold leading-tight">{anime.title}</h1>
                        {anime.titleJp && (
                            <p className="mt-1 text-sm text-zinc-400">{anime.titleJp}</p>
                        )}

                        {/* Score & stats row */}
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            {anime.score && (
                                <div className="flex items-center gap-1.5 rounded-xl bg-yellow-500/10 px-3 py-1.5 text-sm font-bold text-yellow-400">
                                    <StarIcon className="h-4 w-4" />
                                    {anime.score.toFixed(1)}
                                    <span className="ml-1 text-xs font-normal text-yellow-400/60">
                                        ({anime.scoredBy?.toLocaleString()} users)
                                    </span>
                                </div>
                            )}
                            {anime.rank && (
                                <span className="text-sm text-zinc-400">
                                    Ranked <span className="font-semibold text-white">#{anime.rank}</span>
                                </span>
                            )}
                            {anime.popularity && (
                                <span className="text-sm text-zinc-400">
                                    Popularity <span className="font-semibold text-white">#{anime.popularity}</span>
                                </span>
                            )}
                            {anime.members > 0 && (
                                <span className="text-sm text-zinc-400">
                                    {anime.members.toLocaleString()} members
                                </span>
                            )}
                        </div>

                        {/* Meta tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {anime.type && (
                                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                                    {anime.type}
                                </span>
                            )}
                            {anime.episodes && (
                                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
                                    {anime.episodes} episodes
                                </span>
                            )}
                            {anime.duration && (
                                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
                                    {anime.duration}
                                </span>
                            )}
                            {anime.status && (
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${anime.status === "Currently Airing"
                                            ? "bg-emerald-500/20 text-emerald-300"
                                            : anime.status === "Not yet aired"
                                                ? "bg-orange-500/20 text-orange-300"
                                                : "bg-white/5 border border-white/10 text-zinc-300"
                                        }`}
                                >
                                    {anime.status}
                                </span>
                            )}
                            {anime.source && (
                                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
                                    {anime.source}
                                </span>
                            )}
                            {anime.rating && (
                                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
                                    {anime.rating}
                                </span>
                            )}
                        </div>

                        {/* Studio, season */}
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
                            {anime.studio && (
                                <div>
                                    Studio:{" "}
                                    <span className="text-white">{anime.studio}</span>
                                </div>
                            )}
                            {anime.season && anime.year && (
                                <div>
                                    Season:{" "}
                                    <span className="capitalize text-white">
                                        {anime.season} {anime.year}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Genres & themes */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {anime.genres.map((g) => (
                                <span
                                    key={g}
                                    className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-300"
                                >
                                    {g}
                                </span>
                            ))}
                            {anime.themes.map((t) => (
                                <span
                                    key={t}
                                    className="rounded-full border border-purple-400/30 px-3 py-1 text-xs text-purple-300"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* ===== WATCHLIST BUTTON ===== */}
                        <WatchlistButton anime={anime} malId={malId} />

                        {/* Synopsis */}
                        <div className="mt-6">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                                Synopsis
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                                {anime.synopsis || "No synopsis available."}
                            </p>
                        </div>

                        {/* Trailer */}
                        {anime.trailerUrl && (
                            <a
                                href={anime.trailerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Trailer
                            </a>
                        )}
                    </div>
                </div>

                {/* Characters */}
                {characters.length > 0 && (
                    <section className="mt-14">
                        <h2 className="text-xl font-semibold">Characters</h2>
                        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                            {characters.map((char, i) => (
                                <div
                                    key={`${char.name}-${i}`}
                                    className="flex flex-col items-center rounded-xl border border-white/5 bg-white/5 p-3 text-center"
                                >
                                    {char.image ? (
                                        <img
                                            src={char.image}
                                            alt={char.name}
                                            className="h-20 w-20 rounded-full object-cover border border-white/10"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-500">
                                            ?
                                        </div>
                                    )}
                                    <p className="mt-2 line-clamp-2 text-xs font-medium text-white">
                                        {char.name}
                                    </p>
                                    <p className="text-[10px] text-zinc-500">{char.role}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <section className="mt-14">
                        <h2 className="text-xl font-semibold">
                            You Might Also Like
                        </h2>
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {recommendations.map((rec) => (
                                <Link
                                    key={rec.malId}
                                    href={`/discover/${rec.malId}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition hover:border-cyan-400/40"
                                >
                                    <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                                        {rec.posterUrl ? (
                                            <img
                                                src={rec.posterUrl}
                                                alt={rec.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="line-clamp-2 text-xs font-semibold text-white">
                                            {rec.title}
                                        </h3>
                                        <p className="mt-1 text-[10px] text-zinc-500">
                                            {rec.votes} votes
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
