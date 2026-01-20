"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DonationCard } from "@/components/donate/DonationCard";
import { useState } from "react";

// Data matching strict user requirements
const foodPackages = [
    { id: "veg-20", title: "Food Packets (20 People)", price: 1500, type: "veg", count: 20, desc: "Veg Meal for 20 People", image: "/images/food_distribution_kids.png" },
    { id: "nonveg-20", title: "Food Packets (20 People - Non Veg)", price: 2000, type: "non-veg", count: 20, desc: "Non-Veg Meal for 20 People", image: "/images/food_distribution_kids.png" },
    { id: "veg-30", title: "Food Packets (30 People)", price: 2000, type: "veg", count: 30, desc: "Veg Meal for 30 People", image: "/images/food_distribution_kids.png" },
    { id: "nonveg-30", title: "Food Packets (30 People - Non Veg)", price: 2500, type: "non-veg", count: 30, desc: "Non-Veg Meal for 30 People", image: "/images/food_distribution_kids.png" },
    { id: "veg-50", title: "Food Packets (50 People)", price: 3500, type: "veg", count: 50, desc: "Veg Meal for 50 People", image: "/images/food_distribution_kids.png" },
    { id: "nonveg-50", title: "Food Packets (50 People - Non Veg)", price: 4500, type: "non-veg", count: 50, desc: "Non-Veg Meal for 50 People", image: "/images/food_distribution_kids.png" },
    { id: "veg-100", title: "Food Packets (100 People)", price: 6000, type: "veg", count: 100, desc: "Veg Meal for 100 People", image: "/images/food_distribution_kids.png" },
    { id: "nonveg-100", title: "Food Packets (100 People - Non Veg)", price: 8000, type: "non-veg", count: 100, desc: "Non-Veg Meal for 100 People", image: "/images/food_distribution_kids.png" },
];

const specialPackages = [
    { id: "combo-20", title: "20 Food + Cake + Wishes", price: 2000, desc: "20 Food + Cake + Wishes from Kids", image: "/images/birthday_party_kids_v2.png" }
];

const addOns = [
    { id: "cake-500", title: "Cake (Add-on)", price: 500, desc: "Optional Add-on: Cake", image: "/images/birthday_cake.png" }
];

export default function DonatePage() {
    const [selectedCount, setSelectedCount] = useState("all");
    const [selectedType, setSelectedType] = useState("all");

    const filteredPackages = foodPackages.filter(item => {
        const matchCount = selectedCount === "all" || item.count.toString() === selectedCount;
        const matchType = selectedType === "all" || item.type === selectedType;
        return matchCount && matchType;
    });

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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="h-8 w-1 bg-primary rounded-full" /> Food Donation Packages
                            </h2>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-4">
                                <select
                                    className="px-3 py-2 border rounded-md bg-white text-sm"
                                    value={selectedCount}
                                    onChange={(e) => setSelectedCount(e.target.value)}
                                >
                                    <option value="all">All Sizes</option>
                                    <option value="20">20 People</option>
                                    <option value="30">30 People</option>
                                    <option value="50">50 People</option>
                                    <option value="100">100 People</option>
                                </select>

                                <div className="flex border rounded-md overflow-hidden bg-white">
                                    <button
                                        onClick={() => setSelectedType("all")}
                                        className={`px-4 py-2 text-sm transition-colors ${selectedType === "all" ? "bg-primary text-white" : "hover:bg-slate-50"}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setSelectedType("veg")}
                                        className={`px-4 py-2 text-sm transition-colors ${selectedType === "veg" ? "bg-green-600 text-white" : "hover:bg-slate-50"}`}
                                    >
                                        Veg
                                    </button>
                                    <button
                                        onClick={() => setSelectedType("non-veg")}
                                        className={`px-4 py-2 text-sm transition-colors ${selectedType === "non-veg" ? "bg-red-600 text-white" : "hover:bg-slate-50"}`}
                                    >
                                        Non-Veg
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredPackages.map((item) => (
                                <DonationCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    price={item.price}
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
