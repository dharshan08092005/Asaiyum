import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const checkMalId = searchParams.get("checkMalId");

  // If checkMalId is provided, check if this anime is in the user's watchlist
  if (checkMalId) {
    const anime = await prisma.anime.findUnique({
      where: { malId: Number(checkMalId) },
    });
    if (!anime) {
      return NextResponse.json({ inWatchlist: false, entry: null });
    }
    const entry = await prisma.watchlist.findUnique({
      where: {
        userId_animeId: { userId: session.user.id, animeId: anime.id },
      },
    });
    return NextResponse.json({
      inWatchlist: Boolean(entry),
      entry: entry || null,
    });
  }

  // Otherwise, return full watchlist
  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    include: {
      anime: {
        select: {
          id: true,
          malId: true,
          title: true,
          posterUrl: true,
          genres: true,
          episodes: true,
          status: true,
          studio: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ watchlist });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Accept either animeId (internal) or malId + anime metadata (from Jikan)
  let animeId = body.animeId;

  if (!animeId && body.malId) {
    // Upsert the Anime record using Jikan data
    const anime = await prisma.anime.upsert({
      where: { malId: Number(body.malId) },
      update: {
        title: body.title || undefined,
        titleJp: body.titleJp || undefined,
        synopsis: body.synopsis || undefined,
        studio: body.studio || undefined,
        posterUrl: body.posterUrl || undefined,
        genres: body.genres || undefined,
        themes: body.themes || undefined,
        episodes: body.episodes ? Number(body.episodes) : undefined,
        status: body.animeStatus || undefined,
        rating: body.rating || undefined,
      },
      create: {
        malId: Number(body.malId),
        title: body.title || "Unknown",
        titleJp: body.titleJp || null,
        synopsis: body.synopsis || null,
        studio: body.studio || null,
        posterUrl: body.posterUrl || null,
        genres: body.genres || [],
        themes: body.themes || [],
        episodes: body.episodes ? Number(body.episodes) : null,
        status: body.animeStatus || null,
        rating: body.rating || null,
      },
    });
    animeId = anime.id;
  }

  if (!animeId) {
    return NextResponse.json(
      { error: "animeId or malId required" },
      { status: 400 }
    );
  }

  const entry = await prisma.watchlist.upsert({
    where: {
      userId_animeId: { userId: session.user.id, animeId },
    },
    update: { status: body.status || "PLANNED" },
    create: {
      userId: session.user.id,
      animeId,
      status: body.status || "PLANNED",
    },
    include: {
      anime: {
        select: {
          id: true,
          malId: true,
          title: true,
          posterUrl: true,
        },
      },
    },
  });

  return NextResponse.json({ watchlist: entry }, { status: 201 });
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id || !body.status) {
    return NextResponse.json(
      { error: "id and status required" },
      { status: 400 }
    );
  }

  // Verify ownership
  const entry = await prisma.watchlist.findUnique({
    where: { id: body.id },
  });
  if (!entry || entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.watchlist.update({
    where: { id: body.id },
    data: { status: body.status },
    include: {
      anime: {
        select: {
          id: true,
          malId: true,
          title: true,
          posterUrl: true,
        },
      },
    },
  });

  return NextResponse.json({ watchlist: updated });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  // Verify ownership
  const entry = await prisma.watchlist.findUnique({ where: { id } });
  if (!entry || entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.watchlist.delete({ where: { id } });
  return NextResponse.json({ message: "Removed" });
}
