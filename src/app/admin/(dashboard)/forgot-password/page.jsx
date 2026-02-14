"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";

export default function AdminForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    async function handleSendOtp(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            await axios.post(API_ROUTES.AUTH.FORGOT_PASSWORD.INIT, { email });
            setStep(2);
            setMessage("OTP sent to your email. Please check your inbox.");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP. Please check the email.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await axios.post(API_ROUTES.AUTH.FORGOT_PASSWORD.CONFIRM, {
                email,
                code: otp,
                newPassword
            });

            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                router.push("/admin/login");
            }, 2000);
        } catch (err) {
            // console.error(err);
            setError(err.response?.data?.error || "Failed to reset password. Invalid OTP.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-xl">
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 1 ? "Enter your email to receive a recovery code" : "Enter the OTP sent to your email"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-600">
                        {message}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    className="block w-full rounded-lg border border-gray-300 pl-10 p-2.5 text-gray-900 focus:border-primary focus:ring-primary"
                                    placeholder="admin@mkf.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-black px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">Email Address</label>
                            <input
                                type="email"
                                disabled
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-500"
                                value={email}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">OTP Code</label>
                            <input
                                type="text"
                                required
                                className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:ring-primary font-mono tracking-widest text-center text-lg"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">New Password</label>
                            <input
                                type="password"
                                required
                                className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-primary focus:ring-primary"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-black px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
