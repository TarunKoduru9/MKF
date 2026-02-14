"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const videos = [
    { id: 1, src: "/videos/C4016.mp4" },
    { id: 2, src: "/videos/snapsave-app_1190128076660575_hd.mp4" },
    { id: 3, src: "/videos/snapsave-app_1DxML4LJmu_hd.mp4" },
    { id: 4, src: "/videos/snapsave-app_3887410368216924_hd.mp4" },
    { id: 5, src: "/videos/snapsave-app_4543085489266832_hd.mp4" },
    { id: 6, src: "/videos/snapsave-app_878577787888046_hd.mp4" },
];

export function VideoCarousel() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth / 2;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            setTimeout(checkScroll, 300);
        }
    };

    return (
        <section className="py-10 bg-zinc-50 border-t border-zinc-200 group">
            <div className="container mx-auto px-4 relative">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <span className="text-blue-600 font-bold text-sm tracking-wide uppercase">
                            Watch Our Stories
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mt-2">
                            Impact in Action
                        </h2>
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative group">
                    {/* Left Button */}
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={cn(
                            "absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300",
                            canScrollLeft
                                ? "bg-[#dc2626]/80 hover:bg-[#dc2626] text-white scale-100"
                                : "hidden"
                        )}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={cn(
                            "absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300",
                            canScrollRight
                                ? "bg-[#dc2626]/80 hover:bg-[#dc2626] text-white scale-100"
                                : "hidden"
                        )}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}

function VideoCard({ video }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const videoElement = videoRef.current;
                if (!videoElement) return;

                if (entry.isIntersecting) {
                    videoElement.muted = true;
                    videoElement.play()
                        .then(() => setIsPlaying(true))
                        .catch((e) => console.log("Autoplay blocked:", e));
                } else {
                    videoElement.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.6 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (!videoRef.current) return;

        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="relative flex-none w-[280px] md:w-[320px] aspect-[9/16] bg-black rounded-2xl overflow-hidden group shadow-md snap-center">
            <video
                ref={videoRef}
                src={video.src}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted
                onClick={togglePlay}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                    <button
                        onClick={togglePlay}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
