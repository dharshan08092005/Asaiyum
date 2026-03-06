import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId");
  const take = Number(searchParams.get("take") || 50);

  if (!threadId) {
    return NextResponse.json(
      { error: "threadId required" },
      { status: 400 }
    );
  }

  const posts = await prisma.post.findMany({
    where: { threadId },
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
    take: Number.isNaN(take) ? 50 : Math.min(take, 100),
  });

  return NextResponse.json({ posts });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.threadId || (!body.content?.trim() && !body.imageUrl)) {
    return NextResponse.json(
      { error: "threadId and content or image required" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      threadId: body.threadId,
      animeId: body.animeId || null,
      content: body.content?.trim() || "",
      imageUrl: body.imageUrl || null,
      hasSpoilers: Boolean(body.hasSpoilers),
      userId: session.user.id,
    },
    include: {
      author: {
        select: { id: true, name: true, username: true, image: true },
      },
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
