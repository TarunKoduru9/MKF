import { Button } from "@/components/ui/button";
import { HandHeart, Users, Handshake, Share2 } from "lucide-react";

const ways = [
    { title: "Donate", icon: HandHeart, action: "Donate Now" },
    { title: "Volunteer", icon: Users, action: "Join Us" },
    { title: "Partner", icon: Handshake, action: "Partner With Us" },
    { title: "Spread Awareness", icon: Share2, action: "Share" },
];

export function InvolvedSection() {
    return (
        <section id="involved" className="py-24 bg-white">
            <div className="container mx-auto px-4 text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs mb-4 shadow-md shadow-red-200">
                    Get Involved
                </span>
                <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">Be Part of the Change</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                    There are many ways you can contribute to our mission and help create a better future for those in need.
                </p>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {ways.map((way, index) => (
                        <div key={index} className="flex flex-col items-center p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all group">
                            <div className="mb-6 h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-primary group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <way.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{way.title}</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Join our team and make a direct impact.
                            </p>
                            <Button variant="outline" className="w-full border-red-200 text-primary hover:bg-red-50">
                                {way.action}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
