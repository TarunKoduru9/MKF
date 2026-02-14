"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Eye, EyeOff, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";
import Image from "next/image";
import useStore from "@/lib/store"; // Added store import
import { auth } from "@/lib/firebase"; // Added firebase imports
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function SignupPage() {
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        dob: "",
        email: "",
        password: ""
    });
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { toast } = useToast();
    const setUser = useStore((state) => state.setUser); // Store setter

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Firebase Recaptcha Setup
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved
                },
                'expired-callback': () => {
                    toast({ variant: "destructive", title: "Error", description: "Recaptcha expired. Please try again." });
                }
            });
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic Validation
        if (formData.phone.length < 10) {
            toast({ variant: "destructive", title: "Invalid Phone", description: "Please enter a valid phone number." });
            setLoading(false);
            return;
        }

        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        // Format phone number (assuming India +91 for now, or take from input if international needed)
        const formattedPhoneNumber = formData.phone.startsWith("+") ? formData.phone : `+91${formData.phone}`;

        try {
            const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
            setConfirmationResult(result);
            setStep(2);
            toast({ title: "OTP Sent", description: "Please check your phone for the verification code." });
        } catch (error) {
            console.error("SMS Error:", error);
            let msg = error.message;
            if (error.code === 'auth/invalid-phone-number') {
                msg = "The phone number is invalid.";
            } else if (error.code === 'auth/too-many-requests') {
                msg = "Too many requests. Please try again later.";
            }
            toast({ variant: "destructive", title: "Error", description: msg });
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Verify OTP
            await confirmationResult.confirm(otp);
            // If successful, proceed to backend signup

            // 2. Create Account & Auto Login
            const res = await axios.post(API_ROUTES.AUTH.SIGNUP, {
                ...formData,
                role: "user"
            });

            // 3. Update Store
            if (res.data.user) {
                setUser(res.data.user);
            }

            toast({ title: "Account Created", description: "Welcome to MKF Trust!" });

            // 4. Redirect
            router.push("/my-account");

        } catch (error) {
            console.error("Signup Error:", error);
            let msg = "Registration failed.";

            if (error.code === 'auth/invalid-verification-code') {
                msg = "Invalid OTP code entered.";
            } else if (error.response?.data?.error) {
                msg = error.response.data.error;
            } else if (error.response?.status === 409) {
                msg = "Account already exists. Please Login.";
            }

            toast({ variant: "destructive", title: "Error", description: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4">
                {/* Removed max-h-[600px] constraint */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row w-full max-w-4xl h-full lg:h-auto">

                    {/* Left Side - Image & Overlay */}
                    <div className="relative w-full lg:w-[45%] h-[300px] lg:h-auto flex-shrink-0 min-h-[300px]">
                        <Image
                            src="/images/register-image.jpg"
                            alt="Start Donating"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-red-600/10 mix-blend-multiply" />
                        <div className="absolute bottom-8 left-6">
                            <h2 className="text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                                START<br />DONATING
                            </h2>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-[55%] p-6 lg:p-10 flex flex-col justify-center bg-white">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">
                                {step === 1 ? "Create Account" : "Verify Phone"}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {step === 1 ? "Enter Your Details to register" : `Enter the OTP sent to +91${formData.phone}`}
                            </p>
                        </div>

                        {step === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <Input
                                    name="name"
                                    placeholder="Full Name"
                                    className="h-11 bg-white border-slate-200"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                                        🇮🇳 +91
                                    </span>
                                    <Input
                                        name="phone"
                                        placeholder="Phone Number"
                                        className="h-11 rounded-l-none bg-white border-slate-200"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    />
                                </div>
                                <Input
                                    name="dob"
                                    type="date"
                                    className="h-11 bg-white border-slate-200 placeholder:text-slate-400"
                                    required
                                    value={formData.dob}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email ID"
                                    className="h-11 bg-white border-slate-200"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create Password"
                                        className="h-11 bg-white border-slate-200 pr-10"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                <div id="recaptcha-container"></div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-base rounded-md shadow-md mt-2"
                                    disabled={loading || formData.phone.length < 10}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Register"} <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyAndSignup} className="space-y-4">
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
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Complete Signup"}
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

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="text-[#DC2626] font-bold hover:underline text-sm"
                            >
                                Already Have An Account? Login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
