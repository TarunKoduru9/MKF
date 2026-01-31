"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Droplets, HeartPulse, Utensils } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const stories = [
    {
        tag: "Education",
        title: "Books For Hope",
        description: "Providing quality education, scholarships, and learning materials to underprivileged children.",
        icon: BookOpen,
        color: "bg-blue-100 text-blue-600",
        image: "/images/education_class_kids.png",
    },
    {
        tag: "Food & Nutrition",
        title: "Food & Nutrition",
        description: "Daily meal programs, nutrition awareness, and food distribution to families in need.",
        icon: Utensils,
        color: "bg-orange-100 text-orange-600",
        image: "/images/food_distribution_kids.png",
    },
    {
        tag: "Clean Water Access",
        title: "Water For Life",
        description: "Ensuring clean water for remote communities through sustainable water projects.",
        icon: Droplets,
        color: "bg-cyan-100 text-cyan-600",
        image: "/images/skill_training_kids.png",
    },
    {
        tag: "Healthcare",
        title: "Healthy Tomorrow",
        description: "Free medical camps and health awareness programs for rural areas.",
        icon: HeartPulse,
        color: "bg-red-100 text-red-600",
        image: "/images/healthcare_camp_kids.png",
    },
];

export function ProgramSection() {
    const [activeIndex, setActiveIndex] = useState(1); // Default to middle item (Food & Nutrition)

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <section id="programs" className="py-24 bg-white overflow-hidden">
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
                                opacity = "opacity-100";
                                transform = "translate(-50%, -50%) translateX(-600px) scale(0.9)";
                            } else if (index === (activeIndex + 1) % stories.length) {
                                // Next (Right)
                                positionClass = "block";
                                zIndex = "z-10";
                                opacity = "opacity-100";
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
                                                    Learn More
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
