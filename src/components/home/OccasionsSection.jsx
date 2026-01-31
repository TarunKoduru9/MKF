import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Target, Leaf, Users } from "lucide-react";
import Image from "next/image";

// Data matching the screenshot text and icons
const occasions = [
    {
        title: "Birthday Celebration",
        description: "To empower underprivileged communities through livelihood programs.",
        icon: GraduationCap,
    },
    {
        title: "Anniversary",
        description: "A world where every individual has access to basic necessities and opportunities to thrive.",
        icon: Target,
    },
    {
        title: "Special Achievement",
        description: "Integrity, compassion, transparency, and commitment to creating lasting positive change.",
        icon: Leaf,
    },
    {
        title: "In Memory",
        description: "Dedicated volunteers and professionals working together to make a meaningful difference.",
        icon: Users,
    },
];

export function OccasionsSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background glow effect similar to screenshot */}
            <div className="absolute inset-0 bg-white" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-2">
                    <span className="text-blue-600 font-bold text-sm tracking-wide uppercase">
                        Special Occasions
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#DC2626] leading-tight">
                        Celebrate With Purpose
                    </h2>
                    <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                        Make your special day even more meaningful by donating food in your name or in honor of your
                        loved ones. Every celebration becomes a blessing for those in need.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: 2x2 Grid using Flex/Grid */}
                    <div className="lg:w-[60%] grid md:grid-cols-2 gap-6">
                        {occasions.map((item, index) => (
                            <Card key={index} className="bg-white border-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all text-center rounded-[2rem] p-6 h-full flex flex-col items-center justify-center">
                                <CardHeader className="p-0 mb-6 w-full flex flex-col items-center">
                                    <div className="text-[#DC2626] mb-4">
                                        <item.icon className="h-10 w-10" strokeWidth={1.5} />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-slate-900">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <CardDescription className="text-slate-500 leading-relaxed">
                                        {item.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Right: Large Image Placeholder */}
                    <div className="lg:w-[40%]">
                        <div className="w-full h-full min-h-[500px] bg-[#BDBdbd] rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                            <Image
                                src="/images/birthday_party_kids.png"
                                alt="Occasions"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
