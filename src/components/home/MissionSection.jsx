import { Target, Eye, Award, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
    {
        title: "Our Mission",
        icon: Target,
        description: "To empower underprivileged communities through sustainable education, healthcare, and livelihood programs.",
    },
    {
        title: "Our Vision",
        icon: Eye,
        description: "A world where every individual has access to basic necessities and opportunities to thrive.",
    },
    {
        title: "Our Values",
        icon: Award,
        description: "Integrity, compassion, transparency, and commitment to creating lasting positive change.",
    },
    {
        title: "Our Team",
        icon: Users,
        description: "Dedicated volunteers and professionals working together to make a meaningful difference.",
    },
];

export function MissionSection() {
    return (
        <section id="mission" className="py-24 bg-slate-50/50">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-20 space-y-4">
                    <span className="text-blue-600 font-bold text-sm tracking-wide uppercase">
                        About Us
                    </span>
                    <h2 className="text-4xl font-extrabold text-red-600 md:text-5xl tracking-tight">Making A Difference Together</h2>
                    <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        MKF Trust is a registered charitable organization committed to uplifting communities and creating
                        sustainable change through targeted programs and initiatives.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 items-center mb-16 relative">
                    {/* Background Glow Effect - Optional but adds polish */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-3xl -z-10"></div>

                    {features.map((feature, index) => {
                        const isHighlighted = index === 1; // "Our Vision" is 2nd item (index 1)
                        return (
                            <div
                                key={index}
                                className={`
                                    relative flex flex-col items-center text-center transition-all duration-300
                                    ${isHighlighted
                                        ? "bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-110 z-10 border border-slate-100"
                                        : "p-4 hover:translate-y-[-5px] z-0"
                                    }
                                `}
                            >
                                <div className={`
                                    mb-6 inline-flex p-3 rounded-full 
                                    ${isHighlighted ? "text-red-600" : "text-red-500"}
                                `}>
                                    <feature.icon className={`${isHighlighted ? "h-12 w-12" : "h-10 w-10"}`} strokeWidth={1.5} />
                                </div>
                                <h3 className={`font-bold mb-4 text-slate-900 ${isHighlighted ? "text-2xl" : "text-xl"}`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-slate-500 leading-relaxed ${isHighlighted ? "text-base" : "text-sm"}`}>
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                <Link href="/categories">
                    <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700 text-white px-8 h-12 text-base font-bold shadow-lg hover:shadow-red-500/25 transition-all">
                        View All Category <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={3} />
                    </Button>
                </Link>
            </div>
        </section>
    );
}
