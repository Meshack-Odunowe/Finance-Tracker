import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isPasswordValid = await comparePassword(
            validatedData.password,
            user.password
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { message: "Please verify your email first.", requiresVerification: true },
                { status: 403 }
            );
        }

        const token = await generateToken(user.id);

        const cookieStore = await cookies();
        cookieStore.set({
            name: "auth-token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { message: "Validation error", errors: error.errors },
                { status: 400 }
            );
        }
        console.error("Login error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
