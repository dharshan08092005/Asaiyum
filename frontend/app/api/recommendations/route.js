import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get("animeId");
  const take = Number(searchParams.get("take") || 20);

  const recommendations = await prisma.recommendation.findMany({
    where: animeId ? { animeId } : undefined,
    orderBy: { createdAt: "desc" },
    take: Number.isNaN(take) ? 20 : Math.min(take, 50),
  });

  return NextResponse.json({ recommendations });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.animeId) {
    return NextResponse.json({ error: "animeId required" }, { status: 400 });
  }

  const recommendation = await prisma.recommendation.upsert({
    where: { userId_animeId: { userId: session.user.id, animeId: body.animeId } },
    update: {},
    create: { userId: session.user.id, animeId: body.animeId },
  });

  return NextResponse.json({ recommendation }, { status: 201 });
}
