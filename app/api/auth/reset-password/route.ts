import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validations/auth";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { password, token } = resetPasswordSchema.parse(body);

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { message: "Validation error", errors: error.errors },
                { status: 400 }
            );
        }
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
