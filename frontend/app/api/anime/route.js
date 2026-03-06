import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const take = Number(searchParams.get("take") || 12);

  const anime = await prisma.anime.findMany({
    where: search
      ? {
        OR: [
          { title: { contains: search } },
          { titleJp: { contains: search } },
          { studio: { contains: search } },
          { synopsis: { contains: search } },
        ],
      }
      : undefined,
    orderBy: { updatedAt: "desc" },
    take: Number.isNaN(take) ? 12 : Math.min(take, 50),
  });

  return NextResponse.json({ anime });
}

export async function POST(request) {
  const body = await request.json();
  const created = await prisma.anime.create({
    data: {
      malId: body.malId,
      title: body.title,
      titleJp: body.titleJp,
      synopsis: body.synopsis,
      studio: body.studio,
      airDate: body.airDate ? new Date(body.airDate) : null,
      status: body.status,
      trailerUrl: body.trailerUrl,
      posterUrl: body.posterUrl,
      genres: body.genres || [],
      themes: body.themes || [],
      rating: body.rating,
    },
  });

  return NextResponse.json({ anime: created }, { status: 201 });
}
