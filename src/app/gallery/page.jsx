"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

// Mock Data for Gallery
const galleryItems = [
    { id: 1, type: "image", category: "distribution", src: "/images/food_distribution_kids.png", title: "Food Distribution Drive", link: "#" },
    { id: 2, type: "image", category: "education", src: "/images/education_class_kids.png", title: "Evening Classes", link: "#" },
    { id: 3, type: "image", category: "events", src: "/images/birthday_party_kids.png", title: "Birthday Celebration", link: "#" },
    { id: 4, type: "image", category: "distribution", src: "/images/food_packets.png", title: "Meal Prep", link: "#" },
    { id: 5, type: "image", category: "health", src: "/images/healthcare_camp_kids.png", title: "Health Checkup Camp", link: "#" },
    { id: 6, type: "image", category: "education", src: "/images/skill_training_kids.png", title: "Skill Development", link: "#" },
    // Real Reels/Videos
    { id: 7, type: "video", category: "videos", src: "/images/helping-hands.png", title: "Community Impact", link: "https://www.instagram.com/reel/DTmwBRdCett/" },
    { id: 8, type: "video", category: "videos", src: "/images/birthday_party_kids.png", title: "Smiles & Joy", link: "https://www.instagram.com/reel/DTmwBRdCett/" },
    { id: 9, type: "video", category: "videos", src: "/images/food_distribution_kids.png", title: "Sharing Happiness", link: "https://www.instagram.com/reel/DTmwBRdCett/" },
];

const categories = [
    { id: "all", label: "All" },
    { id: "distribution", label: "Food Distribution" },
    { id: "education", label: "Education" },
    { id: "health", label: "Healthcare" },
    { id: "events", label: "Events" },
    { id: "videos", label: "Videos" },
];

import { motion } from "framer-motion";

export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [playingVideoId, setPlayingVideoId] = useState(null);

    const filteredItems = activeCategory === "all"
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory);

    // Helper to extract Instagram Embed URL
    const getEmbedUrl = (url) => {
        if (!url) return "";
        // Basic check for Instagram URL, strip query params and add /embed/
        if (url.includes("instagram.com")) {
            const cleanUrl = url.split("?")[0].replace(/\/$/, "");
            return `${cleanUrl}/embed/`;
        }
        return url;
    };

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
                <div className="mb-16">
                    <h2 className="text-xl font-bold mb-6 px-1 border-l-4 border-primary pl-3">Recent Moments (Reels)</h2>
                    <div className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide snap-x py-2">
                        {/* We specifically map the known video items or just slice mixed content, but let's prioritize the video items for this view */}
                        {[...galleryItems.filter(i => i.type === 'video'), ...galleryItems.filter(i => i.type !== 'video')].slice(0, 6).map((item) => (
                            <motion.div
                                key={`highlight-${item.id}`}
                                className="min-w-[250px] md:min-w-[280px] aspect-[9/16] relative rounded-2xl overflow-hidden shadow-lg snap-center shrink-0 border border-slate-200 bg-black"
                                whileHover={{ y: -5 }}
                            >
                                {item.type === 'video' ? (
                                    <div className="w-full h-full relative">
                                        <iframe
                                            src={getEmbedUrl(item.link)}
                                            className="w-full h-full absolute inset-0 pointer-events-auto"
                                            frameBorder="0"
                                            allowFullScreen
                                            title={item.title}
                                            scrolling="no"
                                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        />
                                        {/* Overlay to prevent hijacking scroll on mobile until interaction? optional. For now leaving interactive. */}
                                    </div>
                                ) : (
                                    <>
                                        <Image
                                            src={item.src}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                                            <h3 className="text-white font-bold">{item.title}</h3>
                                            <span className="text-white/80 text-xs">Story Highlight</span>
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
                            {playingVideoId === item.id ? (
                                <iframe
                                    src={getEmbedUrl(item.link)}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allowFullScreen
                                    title={item.title}
                                />
                            ) : (
                                <>
                                    <Image
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <h3 className="text-white font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                                        <p className="text-white/80 text-xs capitalize mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.type === 'video' ? 'Video' : item.category}</p>

                                        {/* Two Options: View & Link */}
                                        <div className="flex items-center gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                            <button
                                                onClick={() => item.type === 'video' ? setPlayingVideoId(item.id) : null}
                                                className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                            >
                                                {item.type === 'video' ? <Play className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                {item.type === 'video' ? "Play" : "View"}
                                            </button>
                                            <Link href={item.link} target="_blank" className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                                <ExternalLink className="w-4 h-4" /> Visit
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Video Indicator (if not playing) */}
                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center pl-1">
                                                <Play className="w-6 h-6 text-white fill-current" />
                                            </div>
                                        </div>
                                    )}
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
