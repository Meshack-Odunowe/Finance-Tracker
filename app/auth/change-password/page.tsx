"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordInput } from "@/lib/validations/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wallet, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function ChangePasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordInput) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to change password");
            }

            toast.success("Password changed successfully!");
            reset();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Security Settings</h1>
                        <p className="text-sm text-slate-500 mt-1">Update your password to keep your account secure.</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-indigo-600" />
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Current Password</label>
                            <div className="relative">
                                <input
                                    {...register("currentPassword")}
                                    type={showCurrent ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">New Password</label>
                            <div className="relative">
                                <input
                                    {...register("newPassword")}
                                    type={showNew ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                            )}
                            <ul className="text-xs text-slate-500 space-y-1 mt-2 list-disc pl-4">
                                <li>Minimum 8 characters</li>
                                <li>At least one uppercase letter</li>
                                <li>At least one number</li>
                            </ul>
                        </div>

                        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
