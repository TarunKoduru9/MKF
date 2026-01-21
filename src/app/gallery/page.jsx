"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play, Eye, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
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
];

const categories = [
    { id: "all", label: "All" },
    { id: "distribution", label: "Food Distribution" },
    { id: "education", label: "Education" },
    { id: "health", label: "Healthcare" },
    { id: "events", label: "Events" },
    { id: "videos", label: "Videos" },
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
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredItems = activeCategory === "all"
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Our Impact Gallery
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground max-w-2xl mx-auto"
                    >
                        Visual stories of hope, change, and the smiles we've shared along the way.
                    </motion.p>
                </div>

                {/* Vertical Reels/Highlights Carousel */}
                <div className="mb-16 relative group">
                    <h2 className="text-xl font-bold mb-6 px-1 border-l-4 border-primary pl-3">Recent Moments (Reels)</h2>

                    {/* Navigation Buttons */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('highlights-container');
                            if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                        }}
                        className="absolute left-0 top-[60%] -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-opacity md:opacity-0 md:group-hover:opacity-100 disabled:opacity-0"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-800" />
                    </button>

                    <button
                        onClick={() => {
                            const container = document.getElementById('highlights-container');
                            if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                        }}
                        className="absolute right-0 top-[60%] -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-opacity md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6 text-slate-800" />
                    </button>

                    <div
                        id="highlights-container"
                        className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide snap-x py-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {/* Prioritize videos */}
                        {[...galleryItems.filter(i => i.type === 'video'), ...galleryItems.filter(i => i.type !== 'video')].slice(0, 6).map((item) => (
                            <motion.div
                                key={`highlight-${item.id}`}
                                className="w-[200px] md:w-[230px] aspect-[9/16] relative rounded-xl overflow-hidden shadow-lg snap-center shrink-0 border border-slate-200 bg-black"
                                whileHover={{ y: -5 }}
                            >
                                {item.type === 'video' ? (
                                    <VideoCard item={item} className="w-full h-full" showOverlay={true} />
                                ) : (
                                    <>
                                        <Image
                                            src={item.src}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                                            <h3 className="text-white font-bold">{item.title}</h3>
                                            <span className="text-white/80 text-xs text-white">Story Highlight</span>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                activeCategory === cat.id
                                    ? "bg-primary text-white shadow-lg scale-105"
                                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {filteredItems.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={item.id}
                            className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                            {/* For Grid: Handle Videos nicely too */}
                            {item.type === 'video' ? (
                                <VideoCard item={item} className="w-full h-full" showOverlay={true} />
                            ) : (
                                <>
                                    <Image
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                </>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No items found in this category yet.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
