"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";

import { HeroSection } from "@/components/home/HeroSection";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1">
                <HeroSection />

                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-12">
                            <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Journey</span>
                            <h2 className="text-3xl font-bold mt-2">A Legacy of Compassion</h2>
                        </div>

                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <span className="font-bold text-xs">2018</span>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-lg mb-1">The Beginning</h3>
                                    <p className="text-muted-foreground text-sm">Started with a small group of volunteers distributing food packets to 50 homeless individuals weekly.</p>
                                </div>
                            </div>
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <span className="font-bold text-xs">2020</span>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-lg mb-1">Pandemic Relief</h3>
                                    <p className="text-muted-foreground text-sm">Scaled operations to provide over 10,000 meals during the COVID-19 lockdown, establishing trust within the community.</p>
                                </div>
                            </div>
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <span className="font-bold text-xs">2023</span>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-lg mb-1">Education Initiative</h3>
                                    <p className="text-muted-foreground text-sm">Launched our first evening learning center, supporting 50+ underprivileged children with tuition and supplies.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-20 bg-slate-900 text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">The principles that guide every decision and action we take.</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="p-6 bg-slate-800 rounded-xl text-center hover:bg-slate-700 transition-colors">
                                <div className="text-4xl mb-4">🤝</div>
                                <h3 className="font-bold text-xl mb-2">Transparency</h3>
                                <p className="text-slate-400 text-sm">100% donation transparency with regular impact reports.</p>
                            </div>
                            <div className="p-6 bg-slate-800 rounded-xl text-center hover:bg-slate-700 transition-colors">
                                <div className="text-4xl mb-4">❤️</div>
                                <h3 className="font-bold text-xl mb-2">Compassion</h3>
                                <p className="text-slate-400 text-sm">Treating every individual with dignity and kindness.</p>
                            </div>
                            <div className="p-6 bg-slate-800 rounded-xl text-center hover:bg-slate-700 transition-colors">
                                <div className="text-4xl mb-4">🚀</div>
                                <h3 className="font-bold text-xl mb-2">Impact</h3>
                                <p className="text-slate-400 text-sm">Focusing on sustainable, long-term solutions, not just aid.</p>
                            </div>
                            <div className="p-6 bg-slate-800 rounded-xl text-center hover:bg-slate-700 transition-colors">
                                <div className="text-4xl mb-4">🌍</div>
                                <h3 className="font-bold text-xl mb-2">Community</h3>
                                <p className="text-slate-400 text-sm">Building a network of care that empowers everyone.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section (Extension) */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Our Leadership</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Met and led by a passionate team of visionaries committed to social change.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="group p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                            <span className="text-2xl">👤</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-center mb-1">Board Member {item}</h3>
                                    <p className="text-sm text-center text-primary font-medium mb-3">Trustee</p>
                                    <p className="text-sm text-center text-muted-foreground">
                                        Committed to driving our mission forward with strategic guidance.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
