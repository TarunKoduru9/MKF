"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, KeyRound, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1); // 1: Creds, 2: OTP
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const setUser = useStore((state) => state.setUser);
    const { toast } = useToast();

    // Reset Flow when switching modes
    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setStep(1);
        setOtp("");
        setPassword("");
    };

    const handleCredentials = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                // --- SIGN UP FLOW (CUSTOM) ---
                console.log("Signing up with:", { email, name, phone });
                // Password is sending securely over HTTPS (Next.js API)
                await axios.post(API_ROUTES.AUTH.SIGNUP, {
                    email,
                    password,
                    name,
                    phone,
                    dob,
                    role: "user"
                });

                toast({ title: "Account Created", description: "Please login now." });
                setIsSignUp(false); // Switch to login
                setStep(1);

            } else {
                // --- LOGIN FLOW STEP 1 (CUSTOM) ---
                // Verify Password & Send OTP
                console.log("Logging in with:", { email });
                await axios.post(API_ROUTES.AUTH.LOGIN_INIT, { email, password });

                toast({ title: "Credentials Verified", description: "OTP sent to your email." });
                setStep(2); // Move to OTP
            }

        } catch (error) {
            // Error handled via Toast
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
            // --- LOGIN FLOW STEP 2 ---
            // Verify Code & Get Session Cookie
            const res = await axios.post(API_ROUTES.AUTH.VERIFY_2FA, { email, code: otp });

            // Save to Zustand
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

            <main className="flex-1 flex items-center justify-center py-20 px-4">
                <Card className="w-full max-w-md border-0 shadow-xl bg-white">
                    <CardHeader className="space-y-1 text-center pb-8">
                        <div className="mx-auto h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-primary mb-4">
                            {step === 1 ? <Lock className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            {isSignUp ? "Create Account" : (step === 1 ? "Welcome Back" : "Security Check")}
                        </CardTitle>
                        <CardDescription>
                            {isSignUp
                                ? "Enter your details to register"
                                : (step === 1 ? "Enter your email and password" : `Enter the code sent to ${email}`)
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 1 ? (
                            <form onSubmit={handleCredentials} className="space-y-4">
                                {isSignUp && (
                                    <>
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Full Name"
                                                className="h-11" required
                                                value={name} onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Phone Number"
                                                className="h-11" required
                                                value={phone} onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="date"
                                                placeholder="Date of Birth"
                                                className="h-11" required
                                                value={dob} onChange={(e) => setDob(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10 h-11"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="pl-10 h-11 pr-10" // Added pr-10 for icon space
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-11 text-base shadow-md" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {isSignUp ? "Sign Up" : "Next"}
                                </Button>

                                <div className="text-center text-sm pt-2">
                                    <button
                                        type="button"
                                        className="font-semibold text-primary hover:underline"
                                        onClick={toggleMode}
                                    >
                                        {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            className="pl-10 h-11 tracking-widest text-center text-lg font-mono md:text-left md:pl-10"
                                            maxLength={6}
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-11 text-base shadow-md" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Verify & Login
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full text-muted-foreground"
                                    onClick={() => setStep(1)}
                                >
                                    Cancel
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t bg-slate-50/50 p-6">
                        <div className="text-sm text-muted-foreground text-center">
                            By continuing, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                        </div>
                    </CardFooter>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
