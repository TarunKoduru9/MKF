"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import useStore from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadRazorpay } from "@/lib/razorpay";
import { useState, useEffect } from "react";
import { API_ROUTES } from "@/lib/routes";
import { DonationCard } from "@/components/donate/DonationCard";
import axios from "axios";

import { foodPackages, specialPackages } from "@/lib/constants";

export default function CartPage() {
    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const clearCart = useStore((state) => state.clearCart);
    const user = useStore((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [addons, setAddons] = useState([]);
    const [selectedAddonIds, setSelectedAddonIds] = useState([]);

    useEffect(() => {
        // Fetch Products and Addons from DB
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                const products = res.data;

                if (Array.isArray(products)) {
                    // Filter addons
                    const fetchedAddons = products.filter(p => p.type === 'addon');
                    setAddons(fetchedAddons);

                    // Recommendations (Random food packages + specific packages)
                    const foodPackages = products.filter(p => p.type === 'package' && p.id.startsWith('food'));
                    const otherPackages = products.filter(p => p.type === 'package' && !p.id.startsWith('food'));

                    const shuffledFood = [...foodPackages].sort(() => 0.5 - Math.random());
                    const randomFood = shuffledFood.slice(0, 2);

                    setRecommendations([...otherPackages, ...randomFood]);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, []);

    const toggleAddon = (addonId) => {
        setSelectedAddonIds(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    // Calculate Total
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const addonsTotal = addons
        .filter(addon => selectedAddonIds.includes(addon.id))
        .reduce((total, addon) => total + Number(addon.price), 0);

    const totalAmount = cartTotal + addonsTotal;

    const router = useRouter();

    const handleCheckout = async () => {
        if (!user || !user.uid) {
            return router.push('/login');
        }

        setLoading(true);

        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // Construct detailed purpose string
            const cartDetails = cart.map(item => `${item.title} (x${item.quantity})`).join(", ");
            const addonDetails = addons
                .filter(a => selectedAddonIds.includes(a.id))
                .map(a => `${a.title} (Addon)`)
                .join(", ");

            const purposeDetails = [cartDetails, addonDetails].filter(Boolean).join(" + ");

            // Create Order on Server
            const res = await axios.post(API_ROUTES.DONATION.CREATE, {
                amount: totalAmount, // This is just for initial check, server will validate
                purpose: purposeDetails,
                uid: user?.uid || "guest",
                cart: cart,
                addonIds: selectedAddonIds // Send selected addons IDs
            });
            const data = res.data;

            if (!data.success) {
                alert(data.error || "Server error processing donation.");
                setLoading(false);
                return;
            }

            // Options for Razorpay
            const options = {
                key: data.key,
                amount: data.amount,
                currency: "INR",
                name: "MKF Trust",
                description: "Donation for a cause",
                getImage: "/logo.png",
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(API_ROUTES.DONATION.VERIFY, {
                            orderId: data.orderId,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            alert(`Payment Successful! Email sent.`);
                            clearCart();
                            setSelectedAddonIds([]); // Clear addons
                        } else {
                            alert("Payment success, but verification failed. Please contact support.");
                        }

                    } catch (error) {
                        console.error(error);
                        alert("Error verifying payment.");
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                theme: { color: "#DC2626" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <ShoppingCart className="h-8 w-8" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Your Cart is Empty</h2>
                        <p className="text-muted-foreground mb-6">Start making a difference by exploring our donation programs.</p>
                        <Link href="/donate">
                            <Button className="w-full">Donate Now</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Your Contribution Cart</h1>

                <div className="grid gap-8 lg:grid-cols-12 items-start">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4">
                                    <div className="h-20 w-20 bg-slate-200 rounded-md shrink-0 overflow-hidden relative">
                                        <Image
                                            src={item.image || "/images/placeholder.svg"}
                                            alt={item.title}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            ₹{item.price} x {item.quantity} = <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-slate-200 rounded-md">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-slate-50">-</button>
                                            <span className="px-2">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-slate-50">+</button>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Special Addon Section */}
                        {addons.length > 0 && (
                            <div className="bg-amber-100/50 p-6 rounded-xl border border-amber-200">
                                <h3 className="text-xl font-bold mb-4 text-amber-900">Special Addon</h3>
                                <div className="space-y-3">
                                    {addons.map((addon) => (
                                        <div
                                            key={addon.id}
                                            className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${selectedAddonIds.includes(addon.id)
                                                    ? "bg-white border-red-500 shadow-sm"
                                                    : "bg-white/50 border-transparent hover:bg-white"
                                                }`}
                                            onClick={() => toggleAddon(addon.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                                    {/* You can add dynamic icons here based on type/title if needed */}
                                                    <span className="text-xl">🎁</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">{addon.title}</h4>
                                                    <p className="text-sm text-slate-500">{addon.description} {addon.price > 0 && `(₹${addon.price})`}</p>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedAddonIds.includes(addon.id) ? "bg-red-600 border-red-600" : "border-slate-300 bg-white"
                                                }`}>
                                                {selectedAddonIds.includes(addon.id) && <span className="text-white text-xs">✓</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add More to Your Impact */}
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <h3 className="text-xl font-bold mb-6">Add More to Your Impact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recommendations.map((item) => (
                                    <DonationCard
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        price={item.price}
                                        variants={item.variants}
                                        description={item.description || item.desc}
                                        type={item.variants ? "pack" : "unit"}
                                        image={item.image}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Summary */}
                    <div className="lg:col-span-4 sticky top-24">
                        <Card>
                            <CardHeader>
                                <CardTitle>Donation Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cart Items</span>
                                    <span className="font-medium">₹{cartTotal}</span>
                                </div>
                                {addonsTotal > 0 && (
                                    <div className="flex justify-between text-sm text-amber-700">
                                        <span className="flex items-center gap-1"> Special Addons</span>
                                        <span className="font-medium">+ ₹{addonsTotal}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t pt-4">
                                    <span>Total Amount</span>
                                    <span className="text-primary">₹{totalAmount}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button size="lg" className="w-full shadow-lg" onClick={handleCheckout} disabled={loading}>
                                    {loading ? "Processing..." : "Proceed to Pay"} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
