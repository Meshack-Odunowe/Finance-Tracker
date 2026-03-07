import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword, getSession } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = changePasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await comparePassword(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid current password" },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { message: "Validation error", errors: error.errors },
                { status: 400 }
            );
        }
        console.error("Change password error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
