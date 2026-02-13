"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import Image from "next/image";
import { loadRazorpay } from "@/lib/razorpay";
import axios from "axios";
import { Minus, Plus, Heart } from "lucide-react";
import useStore from "@/lib/store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { API_ROUTES } from "@/lib/routes";

import { foodPackages, specialPackages } from "@/lib/constants";

// Reusable Package Card Component (Internal for cleaner page file)
const PackageCard = ({ item }) => {
    const addToCart = useStore((state) => state.addToCart);
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [variant, setVariant] = useState(item.variants ? "veg" : null);

    const price = item.variants ? item.variants[variant] : item.price;
    const title = item.variants ? `${item.title}` : item.title;

    const handleDonate = () => {
        addToCart({
            id: item.variants ? `${item.id}-${variant}` : item.id,
            title: item.variants ? `${title} (${variant === 'veg' ? 'Veg' : 'Non-Veg'})` : title,
            price: price,
            quantity: quantity,
            image: item.image,
            description: item.desc
        });
        router.push('/cart');
    };

    return (
        <div className="bg-[#FAF9F5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col">
            <div className="relative aspect-[4/3] bg-slate-200">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Image
                        src={item.image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <div className="text-xl font-bold text-red-600 mb-4">
                    ₹{price * quantity}
                    {quantity > 1 && <span className="text-sm font-normal text-slate-500 ml-2">(₹{price} x {quantity})</span>}
                    <span className="text-xs text-slate-400 font-normal"> /Pack</span>
                </div>

                {/* Variant Toggle for Food */}
                {item.variants && (
                    <div className="flex bg-white border border-slate-200 rounded-md mb-4 overflow-hidden">
                        <button
                            onClick={() => setVariant("veg")}
                            className={cn("flex-1 py-1.5 text-xs font-bold uppercase transition-colors", variant === "veg" ? "bg-white text-green-600 shadow-sm" : "bg-slate-50 text-slate-400 hover:text-slate-600")}
                        >
                            Veg
                        </button>
                        <div className="w-[1px] bg-slate-200" />
                        <button
                            onClick={() => setVariant("nonveg")}
                            className={cn("flex-1 py-1.5 text-xs font-bold uppercase transition-colors", variant === "nonveg" ? "bg-white text-red-600 shadow-sm" : "bg-slate-50 text-slate-400 hover:text-slate-600")}
                        >
                            Non-Veg
                        </button>
                    </div>
                )}

                {/* Quantity & Action */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-slate-400 hover:text-red-600"><Minus className="w-4 h-4" /></button>
                        <span className="font-semibold text-slate-700">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-slate-400 hover:text-red-600"><Plus className="w-4 h-4" /></button>
                    </div>

                    <Button onClick={handleDonate} className="w-full bg-white text-red-600 border border-red-600 hover:bg-red-50 font-bold uppercase text-sm tracking-wider">
                        Donate Now <Heart className="w-3 h-3 ml-2 fill-current" />
                    </Button>
                </div>
            </div>
        </div>
    );
};


export default function DonatePage() {
    const [amount, setAmount] = useState(1);
    const [customAmount, setCustomAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({ name: "", email: "", phone: "", anonymous: false });
    const router = useRouter();

    // Pre-fill user data if logged in
    const { user } = useStore();
    useEffect(() => {
        if (user) {
            setUserData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
            }));
        }
    }, [user]);

    const finalAmount = customAmount ? parseInt(customAmount) : amount;

    const handleHeroDonate = async () => {
        // Hero Donation (Custom Amount) = Guest allowed. No login check.

        if (!finalAmount || finalAmount <= 0) return alert("Please enter a valid amount");
        // Require details if guest
        if (!userData.anonymous && (!userData.name || !userData.email)) return alert("Please fill in your details");

        setLoading(true);
        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) return alert('Razorpay SDK failed to load.');

            const res = await axios.post(API_ROUTES.DONATION.CREATE, {
                amount: finalAmount,
                purpose: "Direct Donation",
                guest_name: userData.anonymous ? "Anonymous" : userData.name,
                guest_email: userData.email,
                guest_phone: userData.phone,
                anonymous: userData.anonymous
            });

            const data = res.data;
            if (!data.success) throw new Error(data.error || "Payment initiation failed");

            const options = {
                key: data.key,
                amount: data.amount,
                currency: "INR",
                name: "MKF Trust",
                description: "General Donation",
                image: "/logo.png",
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(API_ROUTES.DONATION.VERIFY, {
                            orderId: data.orderId,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        });
                        if (verifyRes.data.success) {
                            alert("Thank you for your donation!");
                            setUserData({ name: "", email: "", phone: "", anonymous: false });
                            setCustomAmount("");
                        }
                    } catch (e) {
                        alert("Verification failed, but payment was successful. Please contact support.");
                    }
                },
                prefill: {
                    name: userData.name,
                    email: userData.email,
                    contact: userData.phone
                },
                theme: { color: "#DC2626" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans">
            <Navbar />

            <main className="flex-1">
                {/* HERO SECTION */}
                <section className="container mx-auto px-4 py-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Donate</span>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1]">
                                Your<br />
                                <span className="text-red-600">Donation</span><br />
                                Can Change<br />
                                Lives Today
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
                                Support our mission to provide education, healthcare, and relief for communities in need. Every contribution brings hope and makes a difference.
                            </p>
                        </div>

                        {/* Right Form Card */}
                        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 border border-slate-100 max-w-md ml-auto w-full">
                            <h3 className="font-bold text-lg mb-6 text-slate-900">Choose Your Contribution Amount</h3>

                            {/* Preset Buttons */}
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {[1500, 2500, 5000, 10000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => { setAmount(val); setCustomAmount(""); }}
                                        className={cn(
                                            "py-2 px-1 rounded-lg text-sm font-bold border transition-all",
                                            amount === val && !customAmount
                                                ? "bg-red-600 text-white border-red-600 shadow-md transform scale-105"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        ₹{val.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Input */}
                            <div className="relative mb-6">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 font-bold">₹</span>
                                <Input
                                    type="text"
                                    placeholder="Enter Your Desired Amount"
                                    className="pl-8 bg-[#FDFBF7] border-slate-100 h-12"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                />
                            </div>

                            {/* User Details */}
                            <div className="space-y-3 mb-6">
                                <Input
                                    placeholder="Your Full Name"
                                    className="h-11 bg-white border-slate-200"
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    disabled={userData.anonymous}
                                />
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="anon"
                                        checked={userData.anonymous}
                                        onCheckedChange={(c) => setUserData({ ...userData, anonymous: c })}
                                    />
                                    <Label htmlFor="anon" className="text-slate-400 text-sm font-normal cursor-pointer">Hide your Name (Anonymous)</Label>
                                </div>
                                <Input
                                    type="email"
                                    placeholder="Your Email"
                                    className="h-11 bg-white border-slate-200"
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                />
                                <Input
                                    type="tel"
                                    placeholder="Your Phone Number"
                                    className="h-11 bg-white border-slate-200"
                                    value={userData.phone}
                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                />
                            </div>

                            <Button onClick={handleHeroDonate} disabled={loading} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg shadow-red-100 text-lg">
                                {loading ? "Processing..." : "Donate Now!"} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* PACKAGES SECTION */}
                <section className="py-10 bg-white">
                    <div className="container mx-auto px-4 text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">Make A Donation</h2>
                        <p className="text-slate-500">Place inform us atleast 3 days in advance so we can make proper arrangements</p>
                    </div>

                    {/* Food Packages */}
                    <div className="container mx-auto px-4 mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1 h-8 bg-blue-600"></div>
                            <h3 className="text-2xl font-bold text-slate-900">Food Donation Packages</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {foodPackages.map(pkg => <PackageCard key={pkg.id} item={pkg} />)}
                        </div>
                    </div>

                    {/* Special Packages */}
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1 h-8 bg-blue-600"></div>
                            <h3 className="text-2xl font-bold text-slate-900">Special Packages & Add-ons</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...specialPackages].map(pkg => <PackageCard key={pkg.id} item={pkg} />)}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function ArrowRight(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
