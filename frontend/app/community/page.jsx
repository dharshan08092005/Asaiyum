"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const THREAD_TYPES = [
  { key: "DISCUSSION", label: "Discussion", color: "text-cyan-400" },
  { key: "MEGATHREAD", label: "Megathread", color: "text-amber-400" },
  { key: "LIVE", label: "Live", color: "text-emerald-400" },
];

function ThreadTypeTag({ type }) {
  const cfg = THREAD_TYPES.find((t) => t.key === type) || THREAD_TYPES[0];
  return (
    <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function TimeAgo({ date }) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return <span>just now</span>;
  if (mins < 60) return <span>{mins}m ago</span>;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return <span>{hrs}h ago</span>;
  const days = Math.floor(hrs / 24);
  return <span>{days}d ago</span>;
}

// ========== Base64 Image Hook ==========
function useBase64Image() {
  const [base64, setBase64] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  function handleFile(file) {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, GIF, and WebP allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }

    setError("");
    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target.result;
      setBase64(dataUri);
      setPreview(dataUri);
      setProcessing(false);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    setBase64(null);
    setPreview(null);
    setError("");
  }

  return { base64, preview, processing, error, handleFile, clear };
}

// ========== Image Picker Component ==========
function ImagePicker({ onFile, processing, preview, onClear, error }) {
  const inputRef = useRef(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(e.target.files[0]);
          e.target.value = "";
        }}
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:border-white/30 hover:text-zinc-200 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {processing ? "Processing..." : "Add Image"}
        </button>
      ) : (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 rounded-lg object-cover border border-white/10"
          />
          {processing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-cyan-400" />
            </div>
          )}
          <button
            type="button"
            onClick={onClear}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ========== Create Thread Modal ==========
function CreateThreadModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("DISCUSSION");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const img = useBase64Image();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || img.processing) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          type,
          imageUrl: img.base64 || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create thread.");
        setLoading(false);
        return;
      }
      img.clear();
      onCreated(data.thread);
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Start a Thread</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white" type="button">
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded bg-red-500/20 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thread title"
            required
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-400/40 focus:outline-none"
          />

          <div className="flex gap-2">
            {THREAD_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setType(t.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${type === t.key
                    ? "bg-cyan-400 text-zinc-900"
                    : "border border-white/10 text-zinc-300 hover:border-white/30"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your first post (optional)..."
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-400/40 focus:outline-none resize-none"
          />

          <ImagePicker
            onFile={img.handleFile}
            processing={img.processing}
            preview={img.preview}
            onClear={img.clear}
            error={img.error}
          />

          <button
            type="submit"
            disabled={loading || !title.trim() || img.processing}
            className="w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Thread"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ========== Thread Detail View (posts) ==========
function ThreadView({ thread, onBack }) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [expandedImages, setExpandedImages] = useState({});
  const img = useBase64Image();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/posts?threadId=${thread.id}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setLoading(false);
    }
    load();
  }, [thread.id]);

  async function handlePost(e) {
    e.preventDefault();
    if ((!newPost.trim() && !img.base64) || img.processing) return;
    setPosting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: thread.id,
          content: newPost,
          imageUrl: img.base64 || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [...prev, data.post]);
        setNewPost("");
        img.clear();
      }
    } catch {
      // silent
    }
    setPosting(false);
  }

  function toggleImageExpand(postId) {
    setExpandedImages((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
        type="button"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Threads
      </button>

      {/* Thread header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <ThreadTypeTag type={thread.type} />
        <h2 className="mt-2 text-2xl font-bold">{thread.title}</h2>
        <div className="mt-2 flex items-center gap-3 text-sm text-zinc-400">
          <span className="font-medium text-zinc-200">
            {thread.author?.name || thread.author?.username || "Anonymous"}
          </span>
          <span>•</span>
          <TimeAgo date={thread.createdAt} />
          <span>•</span>
          <span>{thread._count?.posts || 0} posts</span>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-4 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="h-4 w-1/4 rounded bg-zinc-800" />
              <div className="mt-3 h-3 w-3/4 rounded bg-zinc-800" />
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/5 p-6 text-center text-sm text-zinc-500">
            No posts yet. Be the first to reply!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-white/5 bg-white/5 p-4">
              {/* Author row */}
              <div className="flex items-center gap-3 text-sm">
                {post.author?.image ? (
                  <img src={post.author.image} alt="" className="h-7 w-7 rounded-full" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/20 text-xs font-bold text-cyan-300">
                    {(post.author?.name || "?")?.[0]?.toUpperCase()}
                  </span>
                )}
                <span className="font-medium text-zinc-200">
                  {post.author?.name || post.author?.username || "Anonymous"}
                </span>
                <span className="text-zinc-500">
                  <TimeAgo date={post.createdAt} />
                </span>
                {post.hasSpoilers && (
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                    SPOILER
                  </span>
                )}
              </div>

              {/* Text content */}
              {post.content && (
                <p className="mt-3 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {post.content}
                </p>
              )}

              {/* Image attachment */}
              {post.imageUrl && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => toggleImageExpand(post.id)}
                    className="overflow-hidden rounded-xl border border-white/10 transition hover:border-cyan-400/30 block"
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post attachment"
                      className={`transition-all duration-300 ${expandedImages[post.id]
                          ? "max-h-[600px] w-full object-contain"
                          : "max-h-60 max-w-sm object-cover"
                        }`}
                    />
                  </button>
                  <p className="mt-1 text-[10px] text-zinc-600">
                    {expandedImages[post.id] ? "Click to collapse" : "Click to expand"}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reply form */}
      {session?.user ? (
        <form onSubmit={handlePost} className="mt-4 space-y-3">
          <div className="flex gap-3">
            <input
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-400/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={posting || img.processing || (!newPost.trim() && !img.base64)}
              className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {posting ? "..." : "Reply"}
            </button>
          </div>

          <ImagePicker
            onFile={img.handleFile}
            processing={img.processing}
            preview={img.preview}
            onClear={img.clear}
            error={img.error}
          />
        </form>
      ) : (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-zinc-500">
          <Link href="/login" className="text-cyan-400 hover:underline">
            Sign in
          </Link>{" "}
          to reply.
        </div>
      )}
    </div>
  );
}

// ========== Main Community Page ==========
export default function CommunityPage() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeThread, setActiveThread] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function loadThreads() {
      setLoading(true);
      const res = await fetch("/api/threads");
      const data = await res.json();
      setThreads(data.threads || []);
      setLoading(false);
    }
    loadThreads();
  }, []);

  const filtered =
    filter === "ALL" ? threads : threads.filter((t) => t.type === filter);

  if (activeThread) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
        <Navbar />
        <main className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8">
          <ThreadView thread={activeThread} onBack={() => setActiveThread(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-black text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Discuss anime, share reactions, and connect with fans.
            </p>
          </div>
          {session?.user ? (
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300"
              type="button"
            >
              + Start a Thread
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border border-cyan-400/40 px-5 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400/10"
            >
              Sign in to post
            </Link>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          {[{ key: "ALL", label: "All" }, ...THREAD_TYPES].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filter === t.key
                  ? "bg-cyan-400 text-zinc-900"
                  : "border border-white/10 text-zinc-300 hover:border-white/30"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-white/5 bg-white/5 p-5">
                <div className="h-3 w-16 rounded bg-zinc-800" />
                <div className="mt-3 h-5 w-3/4 rounded bg-zinc-800" />
                <div className="mt-2 h-3 w-1/3 rounded bg-zinc-800" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-zinc-500">
              <svg className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium">No threads yet</p>
              <p className="mt-1 text-sm">Be the first to start a conversation!</p>
            </div>
          ) : (
            filtered.map((thread) => (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActiveThread(thread)}
                className="w-full rounded-xl border border-white/5 bg-white/5 p-5 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.07]"
              >
                <div className="flex items-center gap-3">
                  <ThreadTypeTag type={thread.type} />
                  {thread.type === "LIVE" && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold">{thread.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                  <span>
                    by{" "}
                    <span className="text-zinc-300">
                      {thread.author?.name || thread.author?.username || "Anonymous"}
                    </span>
                  </span>
                  <span>•</span>
                  <TimeAgo date={thread.createdAt} />
                  <span>•</span>
                  <span>{thread._count?.posts || 0} replies</span>
                </div>
              </button>
            ))
          )}
        </div>
      </main>

      {showCreate && (
        <CreateThreadModal
          onClose={() => setShowCreate(false)}
          onCreated={(thread) => {
            setThreads((prev) => [thread, ...prev]);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}
