"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path
        fill="#FFC107"
        d="M43.6 20.3H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.7z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.4 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.3H42V20H24v8h11.3c-1 2.9-3 5.1-5.7 6.5l6.3 5.2C39.6 36.3 44 30.7 44 24c0-1.3-.1-2.5-.4-3.7z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      // Redirect to home page on success
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="netflix-auth-bg flex min-h-screen items-center justify-center px-4 py-8">
      <main className="netflix-card w-full max-w-md rounded-md px-7 py-10 text-white shadow-2xl sm:px-14">
        <h1 className="mb-7 text-3xl font-bold tracking-tight">Sign In</h1>

        {registered && (
          <div className="mb-4 rounded bg-green-500/20 px-4 py-3 text-sm text-green-300">
            Account created successfully! Please sign in.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded bg-red-500/20 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email or phone number"
            className="w-full rounded bg-zinc-700/80 px-4 py-3 text-[15px] text-white placeholder:text-zinc-300 focus:bg-zinc-700 focus:outline-none"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            className="w-full rounded bg-zinc-700/80 px-4 py-3 text-[15px] text-white placeholder:text-zinc-300 focus:bg-zinc-700 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="netflix-red-button mt-2 w-full rounded py-3 text-sm font-semibold text-white transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-4 text-center text-sm text-zinc-400">OR</div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="mt-5 flex items-center justify-between text-sm text-zinc-300">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded" />
            Remember me
          </label>
          <a href="#" className="hover:underline">
            Need help?
          </a>
        </div>

        <p className="mt-10 text-zinc-400">
          New to AimeHub?{" "}
          <Link href="/signup" className="font-semibold text-white hover:underline">
            Sign up now
          </Link>
        </p>
      </main>
    </div>
  );
}
