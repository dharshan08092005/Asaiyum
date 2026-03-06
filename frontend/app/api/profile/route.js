import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
            bio: true,
            createdAt: true,
            _count: {
                select: {
                    recommendations: true,
                    watchlist: true,
                    threads: true,
                    posts: true,
                    comments: true,
                    votes: true,
                },
            },
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
}

export async function PATCH(request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updateData = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.username !== undefined) {
        // Check username uniqueness
        const existing = await prisma.user.findUnique({
            where: { username: body.username },
        });
        if (existing && existing.id !== session.user.id) {
            return NextResponse.json(
                { error: "Username is already taken." },
                { status: 409 }
            );
        }
        updateData.username = body.username;
    }

    const user = await prisma.user.update({
        where: { id: session.user.id },
        data: updateData,
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
            bio: true,
        },
    });

    return NextResponse.json({ user });
}
