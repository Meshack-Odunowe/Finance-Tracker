import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = forgotPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: "If an account exists with this email, a reset link will be sent.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: expiry,
            },
        });

        const resetUrl = `${process.env.APP_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`;

        // In a real app, you would send an email here.
        // For this task, we'll log it to console or just return it in the response (for testing)
        console.log(`Reset URL for ${email}: ${resetUrl}`);

        return NextResponse.json({
            message: "If an account exists with this email, a reset link will be sent.",
            // For demo purposes, we usually don't include this, but I'll add a helper message
            _debug_info: process.env.NODE_ENV === "development" ? { resetUrl } : undefined,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { message: "Validation error", errors: error.errors },
                { status: 400 }
            );
        }
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
