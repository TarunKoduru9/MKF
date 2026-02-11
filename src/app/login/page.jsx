"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Eye, EyeOff, Facebook, Chrome, ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";
import Image from "next/image";
import useStore from "@/lib/store";

export default function LoginPage() {
    const [step, setStep] = useState(1); // 1: Creds, 2: OTP
    const [loading, setLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const setUser = useStore((state) => state.setUser);
    const { toast } = useToast();

    const handleCredentials = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Logging in with:", { email });
            await axios.post(API_ROUTES.AUTH.LOGIN_INIT, { email, password });

            toast({ title: "Credentials Verified", description: "OTP sent to your email." });
            setStep(2);

        } catch (error) {
            let msg = error.response?.data?.error || error.message;
            toast({ variant: "destructive", title: "Error", description: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(API_ROUTES.AUTH.VERIFY_2FA, { email, code: otp });
            setUser(res.data.user);
            toast({ title: "Welcome Back!", description: "Login successful." });
            router.push("/my-account");
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Verification Failed", description: "Invalid or expired OTP." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-10 pb-30">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row w-full max-w-4xl h-full lg:max-h-[600px]">

                    {/* Left Side - Image & Overlay */}
                    <div className="relative w-full lg:w-[45%] h-[300px] lg:h-auto flex-shrink-0">
                        <Image
                            src="/images/login-image.jpg"
                            alt="Start Donating"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-red-600/10 mix-blend-multiply" />
                        <div className="absolute bottom-8 left-6">
                            <h2 className="text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                                START DONATING<br />
                                <span className="text-5xl">TODAY</span><br />
                                <span className="text-2xl font-semibold">WITH MKF TRUST</span>
                            </h2>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-[55%] p-6 lg:p-10 flex flex-col justify-center bg-white">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">
                                {step === 1 ? "Welcome Back" : "Security Check"}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {step === 1 ? "Enter Your Email And Password" : `Enter the code sent to ${email}`}
                            </p>
                        </div>

                        {step === 1 ? (
                            <>
                                <form onSubmit={handleCredentials} className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="User Name/Email Id"
                                        className="h-11 bg-white border-slate-200"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="h-11 bg-white border-slate-200 pr-10"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    <div className="flex justify-end mt-2">
                                        <Link href="/forgot-password" className="text-sm text-slate-400 hover:text-[#DC2626] transition-colors">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-base rounded-md shadow-md mt-2"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"} <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>

                                <div className="mt-4 text-center">
                                    <Link
                                        href="/signup"
                                        className="text-[#DC2626] text-sm hover:underline"
                                    >
                                        Don't have An Account? Signup
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="h-11 bg-white border-slate-200 tracking-widest text-center text-lg font-mono placeholder:font-sans placeholder:text-base placeholder:tracking-normal"
                                    maxLength={6}
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-base rounded-md shadow-md mt-2"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="w-full mt-2"
                                    onClick={() => setStep(1)}
                                >
                                    Cancel
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
