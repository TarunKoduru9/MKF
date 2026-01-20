"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DonationCard } from "@/components/donate/DonationCard";
import { useState } from "react";

// Data matching strict user requirements
const foodPackages = [
    {
        id: "food-20",
        title: "Food Packets (20 People)",
        variants: { veg: 1500, nonveg: 2000 },
        desc: "Complete meal distribution for 20 people.",
        image: "/images/food_distribution_kids.png"
    },
    {
        id: "food-30",
        title: "Food Packets (30 People)",
        variants: { veg: 2000, nonveg: 2500 },
        desc: "Complete meal distribution for 30 people.",
        image: "/images/food_distribution_kids.png"
    },
    {
        id: "food-50",
        title: "Food Packets (50 People)",
        variants: { veg: 3500, nonveg: 4500 },
        desc: "Complete meal distribution for 50 people.",
        image: "/images/food_distribution_kids.png"
    },
    {
        id: "food-100",
        title: "Food Packets (100 People)",
        variants: { veg: 6000, nonveg: 8000 },
        desc: "Complete meal distribution for 100 people.",
        image: "/images/food_distribution_kids.png"
    },
];

const specialPackages = [
    { id: "combo-20", title: "20 Food + Cake + Wishes", price: 2000, desc: "20 Food + Cake + Wishes from Kids", image: "/images/birthday_party_kids.png" }
];

const addOns = [
    { id: "cake-500", title: "Cake (Add-on)", price: 500, desc: "Optional Add-on: Cake", image: "/images/birthday_party_kids.png" }
];

export default function DonatePage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md inline-block max-w-2xl mx-auto">
                        <p className="font-medium">Please inform us at least 3 days in advance so we can make proper arrangements.</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-16">

                    {/* 1. Food Packets */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                            <span className="h-8 w-1 bg-primary rounded-full" /> Food Donation Packages
                        </h2>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {foodPackages.map((item) => (
                                <DonationCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    variants={item.variants}
                                    description={item.desc}
                                    type="pack"
                                    image={item.image}
                                />
                            ))}
                        </div>
                    </section>

                    {/* 2. Special Features */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="h-8 w-1 bg-primary rounded-full" /> Special Packages & Add-ons
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {specialPackages.map((item) => (
                                <DonationCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    price={item.price}
                                    description={item.desc}
                                    type="unit"
                                    image={item.image}
                                />
                            ))}
                            {addOns.map((item) => (
                                <DonationCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    price={item.price}
                                    description={item.desc}
                                    type="unit"
                                    image={item.image}
                                />
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
