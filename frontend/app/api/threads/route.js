import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get("animeId");
  const take = Number(searchParams.get("take") || 20);

  const threads = await prisma.thread.findMany({
    where: animeId ? { animeId } : undefined,
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true },
      },
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: "desc" },
    take: Number.isNaN(take) ? 20 : Math.min(take, 50),
  });

  return NextResponse.json({ threads });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title || !body.title.trim()) {
    return NextResponse.json(
      { error: "Thread title is required." },
      { status: 400 }
    );
  }

  const thread = await prisma.thread.create({
    data: {
      title: body.title.trim(),
      type: body.type || "DISCUSSION",
      animeId: body.animeId || null,
      createdBy: session.user.id,
    },
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true },
      },
      _count: { select: { posts: true } },
    },
  });

  // If initial content or image was provided, create the first post
  if ((body.content && body.content.trim()) || body.imageUrl) {
    await prisma.post.create({
      data: {
        threadId: thread.id,
        content: body.content?.trim() || "",
        imageUrl: body.imageUrl || null,
        hasSpoilers: Boolean(body.hasSpoilers),
        userId: session.user.id,
      },
    });
  }

  return NextResponse.json({ thread }, { status: 201 });
}
