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
        img: "/images/Frame104.png",
    },
    {
        id: 2,
        title: "Support Our Causes",
        img: "/images/Frame105.png",
    },
    {
        id: 3,
        title: "Empower Through Giving",
        img: "/images/Frame106.png",
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
            className="relative bg-white overflow-hidden pb-10 md:pb-28 md:pt-5"
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

                <div className="relative w-full h-[250px] md:h-[550px] flex justify-center items-center overflow-hidden">
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
                                transform = "translate(-50%, -50%) translateX(-700px) scale(0.4)";
                            } else if (index === (currentIndex + 1) % banners.length) {
                                positionClass = "hidden md:block";
                                zIndex = "z-10";
                                opacity = "opacity-35";
                                blur = "blur-sm";
                                transform = "translate(-50%, -50%) translateX(700px) scale(0.4)";
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
                                            ? "w-full md:w-[1200px] shadow-xl bg-[#FFFFFF]"
                                            : "w-[300px] md:w-[800px] shadow-lg bg-gray-50/80"
                                        }
                                        ${positionClass} ${zIndex} ${opacity} ${blur}
                                        flex flex-col md:flex-row items-center justify-between rounded-[2rem] md:rounded-[2.5rem]
                                        relative overflow-hidden h-[200px] md:h-[500px] border border-gray-100
                                    `}
                                >
                                    {/* Full Slide Image */}
                                    <div className="absolute inset-0 h-full w-full z-0">
                                        <Link href="/donate">
                                            <Image
                                                src={banner.img}
                                                alt={banner.title}
                                                fill
                                                className="object-fill"
                                                priority={isActive}
                                            />
                                        </Link>
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
