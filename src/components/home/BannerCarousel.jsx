"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const banners = [
    {
        id: 1,
        title: "Your Contribution Matters",
        subtitle: "Every donation helps us bring change to those in need.",
        bgClass: "bg-orange-50",
        img: "/images/3785b985f8dcd25cac23adfc34b286725973f069.png",
        highlightColor: "text-[#dc2626]",
        btnColor: "bg-[#dc2626] hover:bg-[#dc2626]/80 text-white",
        accent: "border-l-8 border-[#dc2626]/20"
    },
    {
        id: 2,
        title: "Support Our Causes",
        subtitle: "Join hands with us to make a lasting impact on society.",
        bgClass: "bg-pink-50",
        img: "/images/aceb5753ec4688f80c19a7be4c042823800b5cc51.jpg",
        highlightColor: "text-[#dc2626]",
        btnColor: "bg-[#dc2626] hover:bg-[#dc2626]/80 text-white",
        accent: "border-l-8 border-[#dc2626]/20"
    },
    {
        id: 3,
        title: "Empower Through Giving",
        subtitle: "Your generosity clears the path for a better future.",
        bgClass: "bg-blue-50",
        img: "/images/e933905819302f6ddd3f23bd9f43bc98ec401420.jpg",
        highlightColor: "text-[#dc2626]",
        btnColor: "bg-[#dc2626] hover:bg-[#dc2626]/80 text-white",
        accent: "border-l-8 border-[#dc2626]/20"
    },
    {
        id: 4,
        title: "Make a Difference Today",
        subtitle: "Small acts of kindness create endless ripples of hope.",
        bgClass: "bg-orange-50",
        img: "/images/143b1ea32ff101b5af8784514c5ab1b53621d68d.jpg",
        highlightColor: "text-[#dc2626]",
        btnColor: "bg-[#dc2626] hover:bg-[#dc2626]/80 text-white",
        accent: "border-l-8 border-[#dc2626]/20"
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
            className="relative bg-white overflow-hidden pb-12 md:pb-28 md:pt-20"
            onMouseEnter={() => setIsHovered(true)}

            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-4 relative">

                {/* Arrow Navigation */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-[#dc2626]/80 hover:bg-[#dc2626] text-white p-2 md:p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-[#dc2626]/80 hover:bg-[#dc2626] text-white p-2 md:p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex"
                    aria-label="Next Slide"
                >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                </button>

                <div className="relative w-full h-[550px] md:h-[550px] flex justify-center items-center overflow-hidden">
                    <div className="absolute inset-0 flex justify-center items-center">
                        {banners.map((banner, index) => {
                            const isActive = index === currentIndex;

                            let positionClass = "hidden";
                            let zIndex = "z-0";
                            let opacity = "opacity-0";
                            let transform = "";
                            let blur = "";

                            if (index === currentIndex) {
                                positionClass = "block";
                                zIndex = "z-30";
                                opacity = "opacity-100";
                                transform = "translate(-50%, -50%) scale(1)";
                            } else if (index === (currentIndex - 1 + banners.length) % banners.length) {
                                positionClass = "hidden md:block";
                                zIndex = "z-10";
                                opacity = "opacity-35";
                                blur = "blur-xs";
                                transform = "translate(-50%, -50%) translateX(-650px) scale(0.4)";
                            } else if (index === (currentIndex + 1) % banners.length) {
                                positionClass = "hidden md:block";
                                zIndex = "z-10";
                                opacity = "opacity-35";
                                blur = "blur-xs";
                                transform = "translate(-50%, -50%) translateX(650px) scale(0.4)";
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
                                            ? "w-full md:w-[1000px] shadow-2xl"
                                            : "w-[300px] md:w-[800px] shadow-lg"
                                        }
                                        ${positionClass} ${zIndex} ${opacity} ${blur}
                                        flex flex-col md:flex-row items-center justify-between p-6 md:p-14 gap-6 md:gap-8 rounded-[2rem] md:rounded-[2.5rem]
                                        ${banner.bgClass} ${banner.accent} relative overflow-hidden
                                    `}
                                >

                                    {/* Decorative Background Elements */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    {/* Content */}
                                    <div className="flex-1 z-10 text-center md:text-left order-2 md:order-1">
                                        <h2 className={`text-2xl md:text-5xl font-extrabold mb-3 md:mb-4 leading-tight ${banner.highlightColor}`}>
                                            {banner.title}
                                        </h2>
                                        <p className="text-base md:text-xl text-slate-700 font-medium mb-6 md:mb-8 max-w-xl mx-auto md:mx-0">
                                            {banner.subtitle}
                                        </p>
                                        <Link href="/donate">
                                            <Button
                                                className={`${banner.btnColor} text-base md:text-lg font-bold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-md hover:shadow-lg transition-all`}
                                            >
                                                Donate Now
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Image */}
                                    <div className="w-full h-[220px] md:h-[380px] md:flex-1 relative max-w-[280px] md:max-w-sm mx-auto md:mx-0 z-10 order-1 md:order-2 shrink-0">
                                        <div className="absolute inset-0 rounded-full border-[8px] md:border-[10px] border-white/50 shadow-inner overflow-hidden">
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
                            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 border-1 border-slate-300 ${currentIndex === idx
                                ? "bg-[#dc2626]/70 w-8 md:w-10 border-[#dc2626]/70"
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
