"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";

function VerifyOTPContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is missing. Please try registering again.");
            return;
        }

        if (otp.length < 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Verification failed");
            }

            toast.success("Account verified successfully! You can now log in.");
            router.push("/auth/login");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 mb-4">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
                    <p className="text-slate-500 mt-2 text-center text-sm">
                        Please enter the 6-digit verification code sent to <br />
                        <span className="font-medium text-slate-900">{email}</span>
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Verification Code</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="123456"
                            className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-center tracking-widest text-xl font-semibold"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || otp.length < 6}
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Verify Account"}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-slate-500">
                    Didn't receive the code?{" "}
                    <button
                        onClick={() => router.push("/auth/register")}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Register again
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        }>
            <VerifyOTPContent />
        </Suspense>
    );
}
