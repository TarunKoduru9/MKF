import { Play } from "lucide-react";

export function InvolvedSection() {
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
                <div className="relative w-full max-w-5xl mx-auto aspect-video bg-black rounded-[2rem] shadow-xl overflow-hidden group">
                    <video
                        controls
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-cover"
                        poster="/videos/C4016.mp4"
                    >
                        <source autoPlay src="/videos/C4016.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

            </div>
        </section>
    );
}
