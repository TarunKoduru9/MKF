import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative flex flex-col justify-center overflow-visible bg-white pb-12 pt-12 lg:pt-12 lg:pb-12">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            <div className="container relative z-10 mx-auto px-4 pb-12 lg:pb-24">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    <div className="relative mx-auto w-full max-w-[400px] lg:max-w-[480px] order-2 lg:order-1">
                        {/* Gray Box Placeholder matching reference */}  
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-none bg-gray-300 aspect-[4/3] w-full flex items-center justify-center">
                            <Image
                                src="/images/helping-hands.png"
                                alt="Empowering Lives"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    <div className="text-center lg:text-left order-1 lg:order-2 space-y-6">
                        <h2 className="text-blue-600 font-semibold tracking-normal text-lg">
                            Together We Make A Difference
                        </h2>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                            Empowering Lives, <br />
                            <span className="text-slate-900">Building Futures</span>
                        </h1>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start pt-4">
                            <Link href="/donate">
                                <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700 text-white px-8 h-12 text-base font-bold shadow-lg hover:shadow-red-600/25 transition-all w-full sm:w-auto cursor-pointer">
                                    Donate Now! <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={3} />
                                </Button>
                            </Link>
                            <Link href="/gallery">
                                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold border border-slate-300 hover:bg-slate-50 text-slate-700 w-full sm:w-auto cursor-pointer">
                                    View Our Program
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlapping Cards Section */}
            <div className="relative z-20 container mx-auto px-4 -mt-10 mb-12">
                <div className="grid gap-6 md:grid-cols-3">
                    <HeroCard
                        category="Education"
                        title="Books For Hope"
                        image="/images/education_class_kids.png"
                        goalPercentage={62}
                        description="Providing education access for underprivileged children."
                    />
                    <HeroCard
                        category="Healthcare"
                        title="Healthy Tomorrow"
                        image="/images/healthcare_camp_kids.png"
                        goalPercentage={92}
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
                    />
                    <HeroCard
                        category="Clean Water Access"
                        title="Water For Life"
                        image="/images/food_distribution_kids.png"
                        goalPercentage={84}
                        description="Ensuring clean water for remote communities."
                    />
                </div>
            </div>
        </section >
    );
}

function HeroCard({ category, title, image, goalPercentage, description }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-50 flex flex-col h-full group hover:-translate-y-2 transition-all duration-300 relative z-30">
            {/* Category with Bullet point */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600 text-[10px] leading-none">●</span>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">{category}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">{title}</h3>

            {/* Card Image */}
            <div className="relative w-full h-52 mb-5 rounded-2xl overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Goal and Progress */}
            <div className="mb-5 space-y-2">
                <div className="flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Goal</span>
                    <span>{goalPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${goalPercentage}%` }}
                    ></div>
                </div>
            </div>

            <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed font-medium">
                {description}
            </p>

            <Link href="/donate" className="inline-flex items-center text-slate-900 font-extrabold hover:text-blue-600 transition-colors border-b-2 border-slate-200 hover:border-blue-600 pb-0.5 mt-auto w-fit text-sm">
                Donate Now! <ArrowUpRight className="ml-1 h-3.5 w-3.5" strokeWidth={3} />
            </Link>
        </div>
    );
}
