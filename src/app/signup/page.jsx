"use client";

import { useState } from "react";
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

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        dob: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { toast } = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(API_ROUTES.AUTH.SIGNUP, {
                ...formData,
                role: "user"
            });

            toast({ title: "Account Created", description: "Please login with your new account." });
            router.push("/login");

        } catch (error) {
            let msg = error.response?.data?.error || error.message;
            toast({ variant: "destructive", title: "Error", description: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row w-full max-w-4xl h-full max-h-[600px]">

                    {/* Left Side - Image & Overlay */}
                    <div className="relative w-full lg:w-[45%] h-[300px] lg:h-auto flex-shrink-0">
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
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">Create Account</h1>
                            <p className="text-slate-400 text-sm">Enter Your Details to register</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4">
                            <Input
                                name="name"
                                placeholder="Full Name"
                                className="h-11 bg-white border-slate-200"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                name="phone"
                                placeholder="Your Phone Number"
                                className="h-11 bg-white border-slate-200"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                            />
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

                            <Button
                                type="submit"
                                className="w-full h-11 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-base rounded-md shadow-md mt-2"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Register"} <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

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
