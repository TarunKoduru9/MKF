import Image from "next/image";

export function StorySection() {
    return (
        <section id="story" className="story py-10 bg-white">
            <div className="container mx-auto px-4">
                {/* Centered Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#DC2626] uppercase tracking-wide">
                        Our Story
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
                    {/* Left Side: Image & Stats */}
                    <div className="lg:w-1/2">
                        {/* Gray Placeholder Image */}
                        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-300 md:bg-[#BDBdbd] mb-8 flex items-center justify-center">
                            {/* Placeholder Icon similar to reference */}
                            <div className="text-white transform scale-150">
                                <Image
                                    src="/images/2ab7ca8c2778d9c0a9656aef2343d52d69cb9902.png"
                                    alt="Our Story"
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-4xl md:text-5xl font-extrabold text-slate-900">10k</span>
                                <span className="text-blue-600 font-bold text-sm mt-1">We Served</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl md:text-5xl font-extrabold text-slate-900">10+</span>
                                <span className="text-blue-600 font-bold text-sm mt-1">Programs</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl md:text-5xl font-extrabold text-slate-900">15+</span>
                                <span className="text-blue-600 font-bold text-sm mt-1">Experience</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Text Content with Divider */}
                    <div className="lg:w-1/2 lg:pl-12 lg:border-l lg:border-slate-200">
                        <div className="space-y-6 text-slate-500 text-lg leading-relaxed">
                            <p>
                                Founded with a vision to create meaningful change, MKF Trust has been at the forefront
                                of community development for over 15 years. What started as a small initiative has
                                grown into a comprehensive organization touching thousands of lives.
                            </p>
                            <p>
                                We believe in the power of collective action and work closely with local communities
                                to identify needs and implement sustainable solutions. Our programs are designed to
                                create lasting impact, not just temporary relief.
                            </p>
                            <p>
                                Through education, healthcare, livelihood support, and social welfare initiatives,
                                we're building a foundation for stronger, more resilient communities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
