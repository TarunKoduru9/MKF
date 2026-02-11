"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Earth, Shield, ThumbsUp } from "lucide-react";
import Image from "next/image";


export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-10 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            {/* Left Content */}
                            <div className="flex-1 space-y-8">
                                <div>
                                    <h4 className="text-blue-600 font-semibold mb-2">Together We Make A Difference</h4>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                                        Empowering Lives,<br />
                                        Building Futures
                                    </h1>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Link href="/donate">
                                        <Button size="lg" className="rounded-full bg-[#DC2626] hover:bg-red-700 text-white px-8 h-12 text-base font-bold shadow-lg hover:shadow-red-500/25 transition-all w-full sm:w-auto">
                                            Donate Now! <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={3} />
                                        </Button>
                                    </Link>
                                    <Link href="/gallery">
                                        <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold border border-slate-300 hover:bg-slate-50 text-slate-700 w-full sm:w-auto">
                                            View Our Program
                                        </Button>
                                    </Link>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-100 max-w-lg">
                                    <div className="flex justify-between items-center text-center">
                                        <div>
                                            <div className="text-3xl md:text-4xl font-bold text-[#DC2626]">10k</div>
                                            <div className="text-sm font-medium text-slate-600">We Served</div>
                                        </div>
                                        <div className="w-px h-12 bg-slate-200"></div>
                                        <div>
                                            <div className="text-3xl md:text-4xl font-bold text-[#DC2626]">10+</div>
                                            <div className="text-sm font-medium text-slate-600">Programs</div>
                                        </div>
                                        <div className="w-px h-12 bg-slate-200"></div>
                                        <div>
                                            <div className="text-3xl md:text-4xl font-bold text-[#DC2626]">15+</div>
                                            <div className="text-sm font-medium text-slate-600">Experience</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative flex justify-center">
                                <Image src="/images/abouthero.svg" alt="About Hero" width={500} height={500} />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="journey" className="py-10 bg-white overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20">
                            <span className="text-blue-600 font-semibold tracking-wide uppercase">Our Journey</span>
                            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-[#DC2626]">A Legacy Of Compassion</h2>
                        </div>

                        <div className="relative max-w-5xl mx-auto">
                            <div className="absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-slate-300 -translate-x-1/2 hidden md:block"></div>

                            <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between mb-16 md:mb-24 last:mb-0 group">
                                <div className="hidden md:block w-5/12"></div>

                                <div className="z-10 bg-[#DC2626] w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] border-4 border-white mb-6 md:mb-0 relative shrink-0">
                                    2018
                                </div>

                                <div className="w-full md:w-5/12 pl-0 md:pl-12">
                                    <div className="bg-sky-200/50 p-8 rounded-xl relative">
                                        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-3 w-0 h-0 border-t-[12px] border-t-transparent border-r-[14px] border-r-sky-200/50 border-b-[12px] border-b-transparent"></div>

                                        <h3 className="font-bold text-xl text-slate-900 mb-2">The Beginning</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            Started With A Small Group Volunteers Distributing Food Packets To 50 Homeless Individuals Weekly
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex flex-col md:flex-row-reverse items-center justify-center md:justify-between mb-16 md:mb-24 last:mb-0 group">
                                <div className="hidden md:block w-5/12"></div>
                                <div className="z-10 bg-[#DC2626] w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] border-4 border-white mb-6 md:mb-0 relative shrink-0">
                                    2020
                                </div>

                                <div className="w-full md:w-5/12 pr-0 md:pr-12">
                                    <div className="bg-sky-200/50 p-8 rounded-xl relative">
                                        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-3 w-0 h-0 border-t-[12px] border-t-transparent border-l-[14px] border-l-sky-200/50 border-b-[12px] border-b-transparent"></div>

                                        <h3 className="font-bold text-xl text-slate-900 mb-2">Pandemic Relief</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            Scaled Operations To Provide Over 10,000 Meals During The Covid-19 Lockdown, Establishing Trust With In The Community
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between mb-16 md:mb-24 last:mb-0 group">
                                <div className="hidden md:block w-5/12"></div>
                                <div className="z-10 bg-[#DC2626] w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] border-4 border-white mb-6 md:mb-0 relative shrink-0">
                                    2023
                                </div>

                                <div className="w-full md:w-5/12 pl-0 md:pl-12">
                                    <div className="bg-sky-200/50 p-8 rounded-xl relative">
                                        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-3 w-0 h-0 border-t-[12px] border-t-transparent border-r-[14px] border-r-sky-200/50 border-b-[12px] border-b-transparent"></div>

                                        <h3 className="font-bold text-xl text-slate-900 mb-2">Education Initiative</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            Launched Our First Evening Learning Center, Supporting 50+ Underprivileged Children With Tuition And Supplies
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-10 pb-20 bg-[#F4F4F4] text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-[#DC2626] mb-4">Our Core Values</h2>
                            <p className="text-[#000000] max-w-2xl mx-auto">The principles that guide every decision and action we take.</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="p-6 bg-[#FFFFFF] rounded-xl text-center shadow-2xl transition-colors">
                                <Shield className="h-10 w-10 text-[#DC2626] mb-4 mx-auto" />
                                <h3 className="font-bold text-xl text-[#DC2626] mb-2">Transparency</h3>
                                <p className="text-[#000000] text-sm">100% donation transparency with regular impact reports.</p>
                            </div>
                            <div className="p-6 bg-[#FFFFFF] rounded-xl text-center shadow-2xl transition-colors">
                                <HeartHandshake className="h-10 w-10 text-[#DC2626] mb-4 mx-auto" />
                                <h3 className="font-bold text-xl text-[#DC2626] mb-2">Compassion</h3>
                                <p className="text-[#000000] text-sm">Treating every individual with dignity and kindness.</p>
                            </div>
                            <div className="p-6 bg-[#FFFFFF] rounded-xl text-center shadow-2xl transition-colors">
                                <ThumbsUp className="h-10 w-10 text-[#DC2626] mb-4 mx-auto" />
                                <h3 className="font-bold text-xl text-[#DC2626] mb-2">Impact</h3>
                                <p className="text-[#000000] text-sm">Focusing on sustainable, long-term solutions, not just aid.</p>
                            </div>
                            <div className="p-6 bg-[#FFFFFF] rounded-xl text-center shadow-2xl transition-colors">
                                <Earth className="h-10 w-10 text-[#DC2626] mb-4 mx-auto" />
                                <h3 className="font-bold text-xl text-[#DC2626] mb-2">Community</h3>
                                <p className="text-[#000000] text-sm">Building a network of care that empowers everyone.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
