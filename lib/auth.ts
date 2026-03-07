import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-keys-should-be-at-least-32-chars-long"
);

export const generateToken = async (userId: string) => {
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
};

export const verifyToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as { userId: string };
    } catch (error) {
        return null;
    }
};

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashed: string) => {
    return await bcrypt.compare(password, hashed);
};

export const getSession = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;
    return await verifyToken(token);
};
