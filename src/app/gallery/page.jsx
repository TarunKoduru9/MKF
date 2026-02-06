"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

// Mock Data for Gallery
const galleryItems = [
    { id: 1, type: "image", category: "distribution", src: "/images/food_distribution_kids.png", title: "Food Distribution Drive" },
    { id: 2, type: "image", category: "education", src: "/images/education_class_kids.png", title: "Evening Classes" },
    { id: 3, type: "image", category: "events", src: "/images/birthday_party_kids.png", title: "Birthday Celebration" },
    { id: 4, type: "image", category: "distribution", src: "/images/food_packets.png", title: "Meal Prep" },
    { id: 5, type: "image", category: "education", src: "/images/skill_training_kids.png", title: "Skill Development" },
    { id: 6, type: "video", category: "health", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Health Checkup Camp" },
    { id: 7, type: "video", category: "videos", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Community Impact" },
    { id: 8, type: "video", category: "videos", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Smiles & Joy" },
    { id: 9, type: "video", category: "videos", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Sharing Happiness" },
    { id: 10, type: "video", category: "health", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Health Checkup Camp" },
    { id: 11, type: "video", category: "health", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Health Checkup Camp" },
    { id: 12, type: "video", category: "videos", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Community Impact" },
    { id: 13, type: "video", category: "videos", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Smiles & Joy" },
    { id: 14, type: "video", category: "videos", src: "https://mkftrustindia.org/wp-content/uploads/2026/01/snapsave-app_3887410368216924_hd.mp4", title: "Sharing Happiness" },
];

const VideoCard = ({ item, className, showOverlay = true }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = async () => {
        if (videoRef.current) {
            try {
                videoRef.current.muted = true;
                await videoRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Video play failed:", error);
                }
            }
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div
            className={cn("relative overflow-hidden bg-black group h-full w-full", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                className={cn(
                    "w-full h-full object-cover transition-transform duration-700 will-change-transform",
                    isPlaying ? "scale-110" : "scale-100"
                )}
                muted
                loop
                playsInline
                preload="auto"
            >
                <source src={item.src || item.link} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Info Overlay */}
            {showOverlay && (
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 transition-all duration-300 pointer-events-none",
                    isPlaying ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                )}>
                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                    <span className="text-white/80 text-xs flex items-center gap-1 uppercase tracking-wider font-medium">
                        <Play className="w-3 h-3 fill-current" /> Watch Video
                    </span>
                </div>
            )}
        </div>
    );
};

export default function GalleryPage() {
    const photoItems = galleryItems.filter(item => item.type === 'image');
    // Using placeholders for Instagram links as requested, currently mapping existing video items
    const videoItems = galleryItems.filter(item => item.type === 'video');

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Header Section */}
                <section className="py-10 bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="max-w-2xl">
                                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Gallery</span>
                                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                                    Explore Our Impact<br />
                                    Through Photos<br />
                                    And Ideas
                                </h1>
                            </div>
                            <div className="max-w-md pb-2">
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                    Discover the stories of our work in action. Browse through our gallery of photos and videos to see how we make a difference.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Photos Section */}
                <section className="py-10 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <span className="text-blue-600 font-semibold uppercase text-sm">Our Activity</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">Capturing Moments Of Change And Impact</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {photoItems.map((item, index) => {
                                // Pattern: Wide(2), Narrow(1), Narrow(1), Wide(2)
                                const isWide = index % 4 === 0 || index % 4 === 3;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        key={item.id}
                                        className={cn(
                                            "group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500",
                                            isWide ? "md:col-span-2 aspect-[16/9]" : "md:col-span-1 aspect-[4/3] md:aspect-auto"
                                        )}
                                    >
                                        <Image
                                            src={item.src}
                                            alt={item.title}
                                            fill
                                            sizes={isWide ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <h3 className="text-white font-bold text-xl">{item.title}</h3>
                                            <div className="w-12 h-1 bg-red-600 mt-2 rounded-full"></div>
                                        </div>

                                        {/* Icon Overlay */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                                            <div className="text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Videos Section */}
                <section className="py-10 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <span className="text-blue-600 font-semibold uppercase text-sm">Video Gallery</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">See Our Work In Action<br />Through Videos</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                            {videoItems.map((item, index) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    key={item.id}
                                    className="aspect-square rounded-3xl overflow-hidden shadow-md bg-white border border-slate-100 relative group"
                                >
                                    <VideoCard item={item} className="w-full h-full" showOverlay={false} />

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
                                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center border-2 border-white/50 backdrop-blur-sm">
                                            <Play className="w-6 h-6 text-white ml-1 fill-white" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
