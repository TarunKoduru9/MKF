import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";

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
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-primary font-bold text-xs mb-4">
                        About Us
                    </span>
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">Making a Difference Together</h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        MKF Trust is a registered charitable organization committed to uplifting communities and creating sustainable change through targeted programs.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-none shadow-none bg-red-50/50 hover:bg-red-50 hover:shadow-md transition-all duration-300 group">
                            <CardHeader>
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-900/5 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
