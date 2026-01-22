"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            message: e.target.message.value,
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send message");

            alert("Message sent successfully!");
            e.target.reset();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">

                    {/* Trust Introduction */}
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl font-bold">Get in Touch with MKF Trust</h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            We believe in the power of connection. Whether you want to volunteer, donate, or partner with us, your trust is our foundation.
                            We are committed to <span className="font-bold text-primary">100% transparency</span> in all our operations.
                            Join us in making a difference today.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                        {/* Left Side: Contact Information */}
                        <div className="space-y-12">
                            <div>
                                <h1 className="text-3xl font-bold mb-8">Contact Information</h1>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors">
                                            <MapPin className="stroke-red-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Address</h3>
                                            <p className="text-muted-foreground">Hyderabad, Telangana</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors">
                                            <Phone className="stroke-red-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Phone</h3>
                                            <p className="text-muted-foreground">+91 99662 22532</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors">
                                            <Mail className="stroke-red-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Email</h3>
                                            <p className="text-muted-foreground">mkfcharitabletrust@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="bg-red-50 p-3 rounded-lg group-hover:bg-red-100 transition-colors">
                                            <Globe className="stroke-red-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Website</h3>
                                            <p className="text-muted-foreground">https://mkftrustindia.org/</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Message Form */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                    <Input id="name" placeholder="Your name" required className="bg-slate-50 border-slate-200" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                    <Input id="email" type="email" placeholder="your@email.com" required className="bg-slate-50 border-slate-200" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                    <Input id="phone" type="tel" placeholder="Your phone number" className="bg-slate-50 border-slate-200" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                                    <Textarea id="message" placeholder="How can we help you?" rows={4} required className="bg-slate-50 border-slate-200 resize-none" />
                                </div>

                                <Button type="submit" className="w-full bg-[#E11D48] hover:bg-[#ce1942] text-white text-lg py-6" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
