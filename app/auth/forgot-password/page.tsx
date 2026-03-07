"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Wallet, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            setIsSubmitted(true);
            toast.success("Check your email for a reset link");
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
                        <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
                    <p className="text-slate-500 mt-2 text-center text-sm">
                        {isSubmitted
                            ? "We've sent a recovery link to your email"
                            : "No worries, we'll send you reset instructions"}
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="space-y-6">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 mr-3 shrink-0" />
                            <p className="text-sm text-emerald-800">
                                A password reset link has been sent to your email. Please check your inbox and spam folder.
                            </p>
                        </div>
                        <Link
                            href="/auth/login"
                            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            Back to Sign in
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="name@example.com"
                                className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Send Reset Link"}
                        </button>

                        <Link
                            href="/auth/login"
                            className="w-full flex items-center justify-center h-11 text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Back to login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}
