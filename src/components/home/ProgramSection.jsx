"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Droplets, HeartPulse, Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const stories = [
    {
        tag: "Charity",
        title: "The Joy of Giving",
        description: "Witness the transformative power of your donations in changing lives.",
        icon: BookOpen,
        color: "bg-blue-100 text-blue-600",
        image: "/images/7583809940071ede1dddc2039fe9758b0f67bab4.jpg",
        // Keeping original image
    },
    {
        tag: "Food & Nutrition",
        title: "Food & Nutrition",
        description: "Daily meal programs, nutrition awareness, and food distribution to families in need.",
        icon: Utensils,
        color: "bg-orange-100 text-orange-600",
        image: "/images/c5678f4e8e1217d90c2f72f72c0655764fa3af2a.jpg",
        // Using same image
    },
    {
        tag: "Impact",
        title: "Lives Saved",
        description: "Celebrating the countless lives touched and improved by your generosity.",
        icon: HeartPulse,
        color: "bg-red-100 text-red-600",
        image: "/images/aceb5753ec4688f80c19a7be4c042823800b5cc5.jpg",
    },
];

export function ProgramSection() {
    const [activeIndex, setActiveIndex] = useState(1); // Default to middle item (Food & Nutrition)

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % stories.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % stories.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <section id="programs" className="py-10 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 space-y-2">
                    <span className="text-blue-600 font-bold text-sm tracking-wide uppercase">
                        Success Story
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#DC2626] leading-tight">
                        Stories Of Lives Transformed <br className="hidden md:block" />
                        Through Our Support
                    </h2>
                </div>

                {/* Carousel */}
                <div className="relative w-full h-[550px] overflow-hidden flex justify-center items-center">
                    {/* Arrow Navigation */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-[#dc2626]/80 hover:bg-[#dc2626] text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 hidden md:flex"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-[#dc2626]/80 hover:bg-[#dc2626] text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 hidden md:flex"
                        aria-label="Next Slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute inset-0 flex justify-center items-center">
                        {stories.map((story, index) => {
                            const isActive = index === activeIndex;
                            let positionClass = "hidden"; // Default hidden
                            let zIndex = "z-0";
                            let opacity = "opacity-0";
                            let transform = "";


                            if (index === activeIndex) {
                                // Active Center
                                positionClass = "block";
                                zIndex = "z-30";
                                opacity = "opacity-100";
                                transform = "translate(-50%, -50%) scale(1)";
                            } else if (index === (activeIndex - 1 + stories.length) % stories.length) {
                                // Previous (Left)
                                positionClass = "block";
                                zIndex = "z-10";
                                opacity = "opacity-80";
                                transform = "translate(-50%, -50%) translateX(-600px) scale(0.9)";
                            } else if (index === (activeIndex + 1) % stories.length) {
                                // Next (Right)
                                positionClass = "block";
                                zIndex = "z-10";
                                opacity = "opacity-80";
                                transform = "translate(-50%, -50%) translateX(600px) scale(0.9)";
                            }
                            // Else hidden

                            return (
                                <div
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    style={{
                                        transform: transform,
                                        left: "50%",
                                        top: "50%",
                                        position: "absolute"
                                    }}
                                    className={`
                                        transition-all duration-700 ease-in-out cursor-pointer
                                        ${isActive
                                            ? "w-[800px] h-[450px]"
                                            : "w-[300px] h-[400px]"
                                        } 
                                        ${positionClass} ${zIndex} ${opacity}
                                    `}
                                >
                                    {isActive ? (
                                        // Active Card: Image Left + Text Right
                                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 h-[450px] flex overflow-hidden">
                                            {/* Left: Image */}
                                            <div className="w-1/2 relative h-full bg-gray-100">
                                                <Image
                                                    src={story.image}
                                                    alt={story.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {/* Tag Pill on Image */}
                                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm z-10">
                                                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                                                    <span className="text-slate-800 font-bold text-xs">{story.tag}</span>
                                                </div>
                                            </div>

                                            {/* Right: Content */}
                                            <div className="w-1/2 p-8 md:p-10 flex flex-col justify-center text-left">
                                                <h3 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                                                    {story.title}
                                                </h3>
                                                <div className="w-12 h-1 bg-red-500 rounded-full mb-6"></div>
                                                <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8">
                                                    {story.description}
                                                </p>
                                                <Button variant="outline" className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 px-8 w-fit mt-auto font-bold">
                                                    <Link href="/donate">
                                                        Learn More
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Inactive Card: Image Only
                                        <div className="bg-gray-200 rounded-3xl h-[400px] flex items-center justify-center relative overflow-hidden mt-6">
                                            {/* Tag Pill */}
                                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                                                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                                                <span className="text-slate-800 font-bold text-xs">{story.tag}</span>
                                            </div>

                                            {/* Image */}
                                            <Image
                                                src={story.image}
                                                alt={story.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {/* Overlay for better text readability if needed, or just dark tint */}
                                            <div className="absolute inset-0 bg-black/20"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center gap-3 mt-12">
                    {stories.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-red-600" : "w-2.5 bg-slate-200 hover:bg-slate-300"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
