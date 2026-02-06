"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Image from "next/image";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [loading, setLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const router = useRouter();
    const { toast } = useToast();

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/auth/forgot-password/init", { email });
            toast({ title: "OTP Sent", description: "Check your email for the verification code." });
            setStep(2);
        } catch (error) {
            let msg = error.response?.data?.error || "Failed to send OTP.";
            toast({ variant: "destructive", title: "Error", description: msg });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/auth/forgot-password/confirm", { email, code: otp, newPassword });
            toast({ title: "Success", description: "Password reset successfully. Please login." });
            router.push("/login"); // Redirect to login
        } catch (error) {
            let msg = error.response?.data?.error || "Failed to reset password.";
            toast({ variant: "destructive", title: "Error", description: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-10 pb-30">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row w-full max-w-4xl h-full lg:max-h-[600px]">

                    {/* Left Side - Image */}
                    <div className="relative w-full lg:w-[45%] h-[300px] lg:h-auto flex-shrink-0">
                        <Image
                            src="/images/login-image.jpg" // Reusing login image
                            alt="Reset Password"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
                        <div className="absolute bottom-8 left-6">
                            <h2 className="text-3xl font-extrabold text-white leading-tight drop-shadow-lg">
                                SECURE YOUR<br />
                                <span className="text-4xl text-red-500">ACCOUNT</span>
                            </h2>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-[55%] p-6 lg:p-10 flex flex-col justify-center bg-white">
                        <div className="mb-6">
                            <Link href="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-600 mb-4 transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">
                                {step === 1 ? "Forgot Password?" : "Reset Password"}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {step === 1
                                    ? "Enter your email to receive a verification code."
                                    : `Enter the code sent to ${email} and your new password.`
                                }
                            </p>
                        </div>

                        {step === 1 ? (
                            <form onSubmit={handleRequestOtp} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    className="h-11 bg-white border-slate-200"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-base rounded-md shadow-md mt-2"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Verification Code"}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-4">
                                    <Input
                                        type="text"
                                        placeholder="Enter 6-digit Code"
                                        className="h-11 bg-white border-slate-200 text-center tracking-widest font-mono text-lg"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="New Password"
                                        className="h-11 bg-white border-slate-200"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-base rounded-md shadow-md mt-4"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="w-full mt-2"
                                    onClick={() => setStep(1)}
                                >
                                    Change Email
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
