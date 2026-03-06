"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { href: "/discover", label: "Discover" },
        { href: "/community", label: "Community" },
        { href: "/watchlist", label: "Watchlist" },
        { href: "/profile", label: "Profile" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 text-xs font-black text-zinc-900">
                        AH
                    </span>
                    <span className="hidden sm:inline">AimeHub</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-6 text-sm md:flex">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`transition ${pathname.startsWith(l.href)
                                    ? "font-semibold text-cyan-400"
                                    : "text-zinc-300 hover:text-white"
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Auth buttons */}
                <div className="flex items-center gap-3">
                    {session?.user ? (
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-white/30"
                                type="button"
                            >
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt=""
                                        className="h-6 w-6 rounded-full"
                                    />
                                ) : (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/20 text-xs font-bold text-cyan-300">
                                        {(session.user.name || session.user.email)?.[0]?.toUpperCase() || "?"}
                                    </span>
                                )}
                                <span className="hidden sm:inline">
                                    {session.user.name || session.user.email?.split("@")[0]}
                                </span>
                            </button>

                            {menuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
                                        <Link
                                            href="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-3 text-sm text-zinc-200 hover:bg-white/5"
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/watchlist"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-3 text-sm text-zinc-200 hover:bg-white/5"
                                        >
                                            Watchlist
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                signOut({ callbackUrl: "/" });
                                            }}
                                            className="block w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5"
                                            type="button"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white/60"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 sm:block"
                            >
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
