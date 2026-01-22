import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const programs = [
    {
        title: "Education Support",
        description: "Providing quality education, scholarships, and learning materials to underprivileged children.",
        image: "/images/education_class_kids.png",
    },
    {
        title: "Food & Nutrition",
        description: "Daily meal programs, nutrition awareness, and food distribution to families in need.",
        image: "/images/food_distribution_kids.png",
    },
    {
        title: "Healthcare Initiative",
        description: "Free medical camps, health awareness programs, and access to essential healthcare services.",
        image: "/images/healthcare_camp_kids.png",
    },
    {
        title: "Skill Development",
        description: "Vocational training and job placement programs to empower individuals with sustainable livelihoods.",
        image: "/images/skill_training_kids.png",
    },
];

export function ProgramSection() {
    return (
        <section id="programs" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs mb-4">
                        Our Programs
                    </span>
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl">How We Make an Impact</h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Our comprehensive programs address critical needs across education, healthcare, nutrition, and employment.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {programs.map((program, index) => (
                        <Card
                            key={index}
                            id={program.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}
                            className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full scroll-mt-24"
                        >
                            <div className="aspect-[4/3] w-full bg-gray-200 relative overflow-hidden group">
                                <Image
                                    src={program.image}
                                    alt={program.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-lg font-bold">{program.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center flex-1">
                                <CardDescription className="text-sm">
                                    {program.description}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="justify-center pb-6">
                                <Button variant="outline" size="sm" className="rounded-md border-red-200 text-primary hover:bg-red-50 hover:text-red-700">
                                    Learn More
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
