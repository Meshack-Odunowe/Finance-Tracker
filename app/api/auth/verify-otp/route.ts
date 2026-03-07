import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { message: "Email and OTP are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: "User is already verified. Please login." },
                { status: 400 }
            );
        }

        if (user.otp !== otp) {
            return NextResponse.json(
                { message: "Invalid OTP" },
                { status: 400 }
            );
        }

        if (!user.otpExpiry || new Date() > user.otpExpiry) {
            return NextResponse.json(
                { message: "OTP has expired. Please register again to get a new one." },
                { status: 400 }
            );
        }

        // Verify user and clear OTP
        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null,
            },
        });

        return NextResponse.json(
            {
                message: "Verification successful. You can now log in.",
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("OTP verification error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
