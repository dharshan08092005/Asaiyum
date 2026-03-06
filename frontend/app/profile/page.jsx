"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data: session, status: sessionStatus } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (sessionStatus === "loading") return;
        if (!session?.user) {
            setLoading(false);
            return;
        }

        async function load() {
            setLoading(true);
            try {
                const res = await fetch("/api/profile");
                const data = await res.json();
                if (res.ok) {
                    setProfile(data.user);
                    setEditName(data.user.name || "");
                    setEditBio(data.user.bio || "");
                    setEditUsername(data.user.username || "");
                }
            } catch {
                // silent
            }
            setLoading(false);
        }
        load();
    }, [session, sessionStatus]);

    async function handleSave() {
        setSaving(true);
        setError("");
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editName,
                    bio: editBio,
                    username: editUsername,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to update.");
                setSaving(false);
                return;
            }
            setProfile((prev) => ({ ...prev, ...data.user }));
            setEditing(false);
        } catch {
            setError("Something went wrong.");
        }
        setSaving(false);
    }

    // Not logged in
    if (sessionStatus !== "loading" && !session?.user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
                <Navbar />
                <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center">
                    <svg className="h-20 w-20 text-zinc-700 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h1 className="text-2xl font-bold">Your Profile</h1>
                    <p className="mt-2 text-zinc-400">
                        Sign in to view and customize your anime profile.
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

            <main className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8">
                {loading ? (
                    <div className="space-y-6">
                        <div className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-8">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-2xl bg-zinc-800" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-6 w-1/3 rounded bg-zinc-800" />
                                    <div className="h-4 w-1/4 rounded bg-zinc-800" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : profile ? (
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                                {/* Avatar */}
                                {profile.image ? (
                                    <img
                                        src={profile.image}
                                        alt=""
                                        className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 text-3xl font-bold text-cyan-300">
                                        {(profile.name || profile.email)?.[0]?.toUpperCase() || "?"}
                                    </div>
                                )}

                                <div className="flex-1">
                                    {editing ? (
                                        <div className="space-y-3">
                                            {error && (
                                                <div className="rounded bg-red-500/20 px-3 py-2 text-sm text-red-300">
                                                    {error}
                                                </div>
                                            )}
                                            <input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                placeholder="Display name"
                                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
                                            />
                                            <input
                                                value={editUsername}
                                                onChange={(e) => setEditUsername(e.target.value)}
                                                placeholder="Username"
                                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
                                            />
                                            <textarea
                                                value={editBio}
                                                onChange={(e) => setEditBio(e.target.value)}
                                                placeholder="Tell us about yourself..."
                                                rows={3}
                                                className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-cyan-400/40 focus:outline-none"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="rounded-lg bg-cyan-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300 disabled:opacity-50"
                                                    type="button"
                                                >
                                                    {saving ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditing(false);
                                                        setError("");
                                                    }}
                                                    className="rounded-lg border border-white/10 px-5 py-2 text-sm text-zinc-300 hover:border-white/30"
                                                    type="button"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h1 className="text-2xl font-bold">
                                                        {profile.name || "Unnamed User"}
                                                    </h1>
                                                    <p className="text-sm text-zinc-500">
                                                        @{profile.username || profile.email?.split("@")[0]}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setEditing(true)}
                                                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/30"
                                                    type="button"
                                                >
                                                    Edit Profile
                                                </button>
                                            </div>
                                            {profile.bio && (
                                                <p className="mt-3 text-sm text-zinc-300">
                                                    {profile.bio}
                                                </p>
                                            )}
                                            <p className="mt-2 text-xs text-zinc-500">
                                                Joined{" "}
                                                {new Date(profile.createdAt).toLocaleDateString(
                                                    "en-US",
                                                    { year: "numeric", month: "long", day: "numeric" }
                                                )}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                {
                                    label: "Watchlist",
                                    value: profile._count?.watchlist || 0,
                                    color: "text-cyan-400",
                                    icon: "♡",
                                },
                                {
                                    label: "Recommendations",
                                    value: profile._count?.recommendations || 0,
                                    color: "text-emerald-400",
                                    icon: "★",
                                },
                                {
                                    label: "Community Posts",
                                    value:
                                        (profile._count?.threads || 0) +
                                        (profile._count?.posts || 0) +
                                        (profile._count?.comments || 0),
                                    color: "text-amber-400",
                                    icon: "◆",
                                },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                                >
                                    <div className={`text-3xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                    <div className="mt-1 text-sm text-zinc-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick links */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Link
                                href="/watchlist"
                                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
                                    ♡
                                </span>
                                <div>
                                    <p className="font-semibold">Your Watchlist</p>
                                    <p className="text-xs text-zinc-400">
                                        View and manage your tracked anime
                                    </p>
                                </div>
                            </Link>
                            <Link
                                href="/community"
                                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/30"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-lg text-amber-400">
                                    ◆
                                </span>
                                <div>
                                    <p className="font-semibold">Community</p>
                                    <p className="text-xs text-zinc-400">
                                        Your threads and discussions
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-zinc-500 py-20">
                        Could not load profile.
                    </div>
                )}
            </main>
        </div>
    );
}
