import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function StorySection() {
    return (
        <section id="story" className="story py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Content */}
                    <div className="flex-1">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-primary font-bold text-xs mb-6">
                            Our Story
                        </span>
                        <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-6">
                            From a Small Initiative to a Movement
                        </h2>
                        <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
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
                        <div className="mt-8">
                            <Link href="/about#journey">
                                <Button variant="link" className="text-primary text-lg p-0 h-auto font-semibold">
                                    Read Our Full History &rarr;
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Image Grid / Collage */}
                    <div className="flex-1 w-full relative">
                        <div className="relative aspect-square w-full max-w-lg mx-auto">
                            {/* Main Image */}
                            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-200">
                                <img
                                    src="/images/bi.png"
                                    alt="Community"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Image 1 */}
                            <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 w-1/2 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-xl border-4 border-white">
                                <img
                                    src="/images/education_class_kids.png"
                                    alt="Classroom"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Image 2 */}
                            <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-1/2 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-xl border-4 border-white">
                                <img
                                    src="/images/healthcare_camp_kids.png"
                                    alt="Medical Camp"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
