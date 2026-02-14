"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function InvolvedSection() {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.muted = true;
                    video.play().catch(e => console.log("Autoplay error:", e));
                    setIsPlaying(true);
                } else {
                    video.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.6 }
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
        <section id="involved" className="py-10 bg-zinc-50">
            <div className="container mx-auto px-4 text-center">

                {/* Header */}
                <div className="text-center mb-16 space-y-2">
                    <span className="text-blue-600 font-bold text-sm tracking-wide uppercase">
                        Get Involved
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#DC2626] leading-tight">
                        Be Part Of The Change
                    </h2>
                    <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                        There are many ways you can contribute to our mission and help create a better future for
                        those in need.
                    </p>
                </div>

                {/* Video Placeholder Container */}
                <div
                    className="relative w-full max-w-5xl mx-auto aspect-video bg-black rounded-[2rem] shadow-xl overflow-hidden group cursor-pointer"
                    onClick={togglePlay}
                >
                    <video
                        ref={videoRef}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className={cn(
                            "w-full h-full object-cover transition-transform duration-700 will-change-transform",
                            isPlaying ? "scale-105" : "scale-100"
                        )}
                        poster="/videos/thumb-involved.jpg"
                    >
                        <source src="/videos/C4016.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Play/Pause Overlay Hint */}
                    <div className={cn(
                        "absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 pointer-events-none",
                        isPlaying ? "opacity-0" : "opacity-100"
                    )}>
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50">
                            <Play className="w-8 h-8 text-white fill-white translate-x-1" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
