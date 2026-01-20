"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import useStore from "@/lib/store";
import Link from "next/link";
import { loadRazorpay } from "@/lib/razorpay";
import { useState } from "react";
import { API_ROUTES } from "@/lib/routes";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, user } = useStore();
    const [loading, setLoading] = useState(false);

    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        // 1. Check Auth (Optional for donations, but good for tracking)
        // if (!user) return router.push('/login');

        setLoading(true);

        try {
            // 2. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 3. Create Order on Server
            const res = await fetch(API_ROUTES.DONATION.CREATE, {
                method: 'POST',
                body: JSON.stringify({
                    amount: totalAmount,
                    purpose: "Cart Donation", // Could be list of items
                    uid: user?.uid || "guest"
                })
            });
            const data = await res.json();

            if (!data.success) {
                alert("Server error processing donation. Please try again.");
                setLoading(false);
                return;
            }

            // 4. Options for Razorpay
            const options = {
                key: data.key,
                amount: data.amount,
                currency: "INR",
                name: "MKF Trust",
                description: "Donation for a cause",
                image: "/logo.png", // Add logo in public folder
                order_id: data.orderId,
                handler: function (response) {
                    // Payment Success
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    // Verify payment on server here
                    clearCart();
                    // Redirect to success page
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                theme: {
                    color: "#e11d48" // Primary Red
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
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

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-4">
                        {cart.map((item) => (
                            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4">
                                <div className="h-20 w-20 bg-slate-200 rounded-md shrink-0 overflow-hidden">
                                    {/* Image Placeholder */}
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">₹{item.price} x {item.quantity}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-slate-200 rounded-md">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-slate-50">-</button>
                                        <span className="px-2">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-slate-50">+</button>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Donation Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Items</span>
                                    <span className="font-medium">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                </div>
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
