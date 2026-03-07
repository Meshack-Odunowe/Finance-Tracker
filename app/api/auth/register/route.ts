import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";
import { sendOTP } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const hashedPassword = await hashPassword(validatedData.password);

        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json(
                    { message: "User with this email already exists" },
                    { status: 400 }
                );
            } else {
                // User exists but is not verified; update OTP and resend
                await prisma.user.update({
                    where: { email: existingUser.email },
                    data: {
                        password: hashedPassword,
                        name: validatedData.name,
                        otp,
                        otpExpiry,
                    },
                });

                await sendOTP(existingUser.email, otp);

                return NextResponse.json(
                    { message: "Account pending verification. OTP sent to your email.", email: existingUser.email },
                    { status: 200 }
                );
            }
        }

        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                isVerified: false,
                otp,
                otpExpiry,
            },
        });

        await sendOTP(user.email, otp);

        return NextResponse.json(
            {
                message: "Registration successful. Please verify your OTP.",
                email: user.email,
            },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { message: "Validation error", errors: error.errors },
                { status: 400 }
            );
        }
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
