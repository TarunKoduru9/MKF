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
import Image from "next/image";

export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Check if already logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to access a protected route to verify session
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    router.replace("/admin/dashboard");
                }
            } catch (e) {
                // Not logged in, stay here
            }
        };
        checkAuth();
    }, [router]);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);



    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Login failed");
            }

            toast({ title: "Welcome Admin", description: "Login successful." });
            toast({ title: "Welcome Admin", description: "Login successful." });
            router.replace("/admin/dashboard");
            router.refresh();

        } catch (error) {
            toast({ variant: "destructive", title: "Access Denied", description: error.message });
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
                            alt="Admin Login"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-red-600/10 mix-blend-multiply" />
                        <div className="absolute bottom-8 left-6">
                            <h2 className="text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                                ADMIN<br />
                                <span className="text-5xl">PORTAL</span><br />
                                <span className="text-2xl font-semibold">MKF TRUST</span>
                            </h2>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-[55%] p-6 lg:p-10 flex flex-col justify-center bg-white">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-slate-900 mb-1 font-heading">
                                Admin Access
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Secure Login for Administrators
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Admin Email"
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

                            <Button
                                type="submit"
                                className="w-full h-11 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-base rounded-md shadow-md mt-2"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Secure Login"} <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
