import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters." },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // Generate a unique username from the email
        let baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
        let username = baseUsername;
        let attempts = 0;
        while (attempts < 10) {
            const existing = await prisma.user.findUnique({
                where: { username },
            });
            if (!existing) break;
            username = baseUsername + Math.floor(Math.random() * 10000);
            attempts++;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Account created successfully.", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
