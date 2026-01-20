import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cake, Heart, Trophy, Video } from "lucide-react";

const occasions = [
    {
        title: "Birthday Celebration",
        description: "Celebrate your special day by feeding those in need.",
        icon: Cake,
    },
    {
        title: "Anniversary",
        description: "Mark your milestone by spreading joy through food.",
        icon: Heart,
    },
    {
        title: "Special Achievement",
        description: "Celebrate success by giving back to the community.",
        icon: Trophy,
    },
    {
        title: "In Memory",
        description: "Honor loved ones by feeding families in their name.",
        icon: Video, // Using Video/Film icon as placeholder for 'Memory' or maybe 'Candle' if available
    },
];

export function OccasionsSection() {
    return (
        <section className="py-24 bg-red-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs mb-4">
                        Special Occasions
                    </span>
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">Celebrate with Purpose</h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Make your special day even more meaningful by donating food in your name or in honor of your loved ones.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {occasions.map((item, index) => (
                        <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-all text-center">
                            <CardHeader className="pt-8 pb-4">
                                <div className="mx-auto h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-primary mb-4">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{item.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
