"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const banners = [
    {
        id: 1,
        title: "Plant Trees, Grow Hope",
        subtitle: "Help expand green cover where it matters most.",
        bgClass: "bg-orange-50",
        img: "/images/skill_training_kids.png",
        highlightColor: "text-green-700",
        btnColor: "bg-amber-400 hover:bg-amber-500 text-black",
        accent: "border-l-8 border-green-700"
    },
    {
        id: 2,
        title: "Annadaan & Vastradaan",
        subtitle: "Honour Your Ancestors by feeding little hungry souls.",
        bgClass: "bg-pink-50",
        img: "/images/food_distribution_kids.png",
        highlightColor: "text-red-600",
        btnColor: "bg-amber-400 hover:bg-amber-500 text-black",
        accent: "border-l-8 border-red-600"
    },
    {
        id: 3,
        title: "Educate a Child",
        subtitle: "Give the gift of knowledge and a brighter future.",
        bgClass: "bg-blue-50",
        img: "/images/education_class_kids.png",
        highlightColor: "text-blue-600",
        btnColor: "bg-amber-400 hover:bg-amber-500 text-black",
        accent: "border-l-8 border-blue-600"
    },
    {
        id: 4,
        title: "Plant Trees, Grow Hope",
        subtitle: "Help expand green cover where it matters most.",
        bgClass: "bg-orange-50",
        img: "/images/skill_training_kids.png",
        highlightColor: "text-green-700",
        btnColor: "bg-amber-400 hover:bg-amber-500 text-black",
        accent: "border-l-8 border-green-700"
    },
    {
        id: 5,
        title: "Plant Trees, Grow Hope",
        subtitle: "Help expand green cover where it matters most.",
        bgClass: "bg-orange-50",
        img: "/images/skill_training_kids.png",
        highlightColor: "text-green-700",
        btnColor: "bg-amber-400 hover:bg-amber-500 text-black",
        accent: "border-l-8 border-green-700"
    }
];


export function BannerCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll logic
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            handleNext();
        }, 4000); // 4 seconds per slide

        return () => clearInterval(interval);
    }, [currentIndex, isHovered]);


    const handlePrev = () => {
        const newIndex = (currentIndex - 1 + banners.length) % banners.length;
        setCurrentIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % banners.length;
        setCurrentIndex(newIndex);
    };

    return (
        <section
            className="relative py-8 md:py-12 bg-white overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-4 relative">

                {/* Arrow Navigation */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-amber-400 hover:bg-amber-500 text-black p-3 rounded-full shadow-lg transition-transform hover:scale-110 hidden md:flex"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-amber-400 hover:bg-amber-500 text-black p-3 rounded-full shadow-lg transition-transform hover:scale-110 hidden md:flex"
                    aria-label="Next Slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Carousel Container - Absolute Positioning Layout */}
                <div className="relative w-full h-[550px] flex justify-center items-center overflow-hidden">
                    <div className="absolute inset-0 flex justify-center items-center">
                        {banners.map((banner, index) => {
                            const isActive = index === currentIndex;

                            // Positioning logic
                            let positionClass = "hidden";
                            let zIndex = "z-0";
                            let opacity = "opacity-0";
                            let transform = "";

                            if (index === currentIndex) {
                                // Active Center
                                positionClass = "block";
                                zIndex = "z-30";
                                opacity = "opacity-100";
                                transform = "translate(-50%, -50%) scale(1)";
                            } else if (index === (currentIndex - 1 + banners.length) % banners.length) {
                                // Previous (Left)
                                positionClass = "block";
                                zIndex = "z-10";
                                opacity = "opacity-50";
                                // Shift Left: 50% offset + extra to peek
                                transform = "translate(-50%, -50%) translateX(-650px) scale(0.85)";
                            } else if (index === (currentIndex + 1) % banners.length) {
                                // Next (Right)
                                positionClass = "block";
                                zIndex = "z-10";
                                opacity = "opacity-50";
                                // Shift Right
                                transform = "translate(-50%, -50%) translateX(650px) scale(0.85)";
                            }

                            return (
                                <div
                                    key={banner.id}
                                    onClick={() => setCurrentIndex(index)}
                                    style={{
                                        transform: transform,
                                        left: "50%",
                                        top: "50%",
                                        position: "absolute"
                                    }}
                                    className={`
                                        transition-all duration-700 ease-in-out cursor-pointer
                                        ${isActive
                                            ? "w-full md:w-[900px] shadow-2xl"
                                            : "w-[300px] md:w-[800px] shadow-lg grayscale hover:grayscale-0"
                                        }
                                        ${positionClass} ${zIndex} ${opacity}
                                        flex flex-col md:flex-row items-center justify-between p-8 md:p-14 gap-8 rounded-[2.5rem]
                                        ${banner.bgClass} ${banner.accent} relative overflow-hidden
                                    `}
                                >
                                    {/* Content (Only show full content for active if desired, or simplified for others. 
                                        Based on 'half visible', probably show minimal on sides or full but clipped) 
                                        Let's keep full content but opacity handles visual focus.
                                    */}

                                    {/* Decorative Background Elements */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    {/* Content */}
                                    <div className="flex-1 z-10 text-center md:text-left">
                                        <h2 className={`text-3xl md:text-5xl font-extrabold mb-4 leading-tight ${banner.highlightColor}`}>
                                            {banner.title}
                                        </h2>
                                        <p className="text-lg md:text-xl text-slate-700 font-medium mb-8 max-w-xl">
                                            {banner.subtitle}
                                        </p>
                                        <Link href="/donate">
                                            <Button
                                                className={`${banner.btnColor} text-lg font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all`}
                                            >
                                                Donate Now
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Image */}
                                    <div className="flex-1 relative w-full h-[250px] md:h-[350px] max-w-sm mx-auto md:mx-0 z-10">
                                        <div className="absolute inset-0 rounded-full border-[10px] border-white/50 shadow-inner overflow-hidden">
                                            <Image
                                                src={banner.img}
                                                alt={banner.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Pagination Dots */}
                <div className="flex justify-center gap-3 mt-6">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 border-2 border-slate-300 ${currentIndex === idx
                                ? "bg-red-500 w-8 md:w-10 border-red-500"
                                : "bg-transparent hover:bg-slate-200"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
