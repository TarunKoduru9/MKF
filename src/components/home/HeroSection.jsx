import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative flex flex-col justify-center overflow-visible bg-white">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            {/* Overlapping Cards Section */}
            <div className="relative z-20 container mx-auto px-4 -mt-10 mb-12">
                <div className="grid gap-6 md:grid-cols-3">
                    <HeroCard
                        category="General Support"
                        title="Give Hope"
                        image="/images/a0a21d96e89afd4577c2c8c8c7543e11673c0b2f1.jpg"
                        goalPercentage={62}
                        description="Your kind contributions bring smiles to faces and warmth to hearts."
                    />
                    <HeroCard
                        category="Emergency Fund"
                        title="Urgent Relief"
                        image="/images/143b1ea32ff101b5af8784514c5ab1b53621d68d.jpg"
                        goalPercentage={92}
                        description="Stand with us to provide immediate aid where it is needed most."
                    />
                    <HeroCard
                        category="Community Care"
                        title="Care For All"
                        image="/images/7583809940071ede1dddc2039fe9758b0f67bab4.jpg"
                        goalPercentage={84}
                        description="Building stronger communities through your continuous support and love."
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
            <div className="relative w-full h-64 mb-5 rounded-2xl overflow-hidden bg-gray-100">
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
                        className="bg-blue-600 h-1.5 rounded-full"
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
