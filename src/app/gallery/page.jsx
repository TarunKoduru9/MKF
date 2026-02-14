"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/lib/routes";

// Mock Data for Gallery


const VideoCard = ({ item, className, showOverlay = true }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.muted = true; // Ensure muted for autoplay policy
                    video.play().catch(e => console.log("Autoplay error:", e));
                    setIsPlaying(true);
                } else {
                    video.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.6 } // Play when 60% visible
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div
            className={cn("relative overflow-hidden bg-black group h-full w-full", className)}
            onClick={togglePlay}
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
    const { data: items = [], isLoading, isError } = useQuery({
        queryKey: ['gallery'],
        queryFn: async () => {
            const res = await axios.get(API_ROUTES.GALLERY.GET);
            return res.data;
        }
    });

    const photoItems = items.filter(item => item.type === 'image');
    const videoItems = items.filter(item => item.type === 'video');

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

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
                                            // Mobile: Taller aspect ratio to show more of the image
                                            "aspect-[3/4]",
                                            // Desktop: Wide or Standard aspect ratio
                                            isWide ? "md:col-span-2 md:aspect-[16/9]" : "md:col-span-1 md:aspect-[4/3]"
                                        )}
                                    >
                                        <Image
                                            src={item.src}
                                            alt={item.title}
                                            fill
                                            sizes={isWide ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
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
