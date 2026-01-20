import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-white via-red-50 to-white px-4 py-20">
            <div className="container relative z-10 mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
                {/* Text Content */}
                <div className="max-w-2xl text-center lg:text-left">
                    <div className="mb-6 inline-flex items-center rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm hover:bg-red-200 transition-colors">
                        <span className="mr-2 flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                        Together We Make a Difference
                    </div>
                    <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                        Empowering Lives, <br />
                        <span className="text-primary">Building Futures</span>
                    </h1>
                    <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                        MKF Trust is dedicated to creating positive change in our communities through
                        sustainable education, healthcare, and social welfare initiatives. Join us in our mission.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <Button size="lg" className="rounded-full px-8 text-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all">
                            Donate Now
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8 text-lg border-2 hover:bg-secondary">
                            Learn More
                        </Button>
                    </div>
                    {/* Stats Floating Cards */}
                    <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-center lg:justify-start">
                        <div className="rounded-xl bg-white p-4 shadow-xl ring-1 ring-black/5 animate-bounce-slow">
                            <p className="text-3xl font-bold text-primary">10K+</p>
                            <p className="text-sm font-medium text-muted-foreground">Lives Impacted</p>
                        </div>
                        <div className="rounded-xl bg-white p-4 shadow-xl ring-1 ring-black/5 animate-bounce-slow delay-150">
                            <p className="text-3xl font-bold text-primary">15+</p>
                            <p className="text-sm font-medium text-muted-foreground">Years Active</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image/Abstract Art */}
                <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
                    <div className="relative">
                        <Image
                            src="/images/helping-hands.png"
                            alt="Happy Community"
                            className="w-full h-full object-cover"
                            width={600}
                            height={600}
                        />
                    </div>
                </div>
            </div>
        </section >
    );
}
