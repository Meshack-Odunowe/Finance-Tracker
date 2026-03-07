import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-keys-should-be-at-least-32-chars-long"
);

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secret);

        if (!payload.userId || typeof payload.userId !== "string") {
            return NextResponse.json({ message: "Invalid payload" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error("Auth me error:", error);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}
