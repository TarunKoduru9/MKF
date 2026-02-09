"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Globe, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { API_ROUTES } from "@/lib/routes";

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
            const res = await axios.post(API_ROUTES.CONTACT, formData);
            const data = res.data;

            if (res.status !== 201) throw new Error(data.error || "Failed to send message");

            alert("Message sent successfully!");
            e.target.reset();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || error.message;
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Header Section */}
                <section className="py-10 bg-white relative overflow-hidden border-b border-slate-100">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="max-w-xl">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                                    Get In Touch<br />
                                    With Us Today
                                </h1>
                            </div>
                            <div className="max-w-md pb-2">
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                    We’re here to assist you. Reach out for any questions or inquiries, and our team will be happy to help you.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="py-10 bg-[#F9FAFB]">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                            {/* Left: Form */}
                            <div className="flex-1">
                                <span className="text-blue-600 font-bold text-sm mb-2 block">Contact Us</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                                    We’d Love<br />To Hear From You
                                </h2>

                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Input id="name" name="name" placeholder="Your Full Name" required className="bg-white border-slate-200 h-12" />
                                        </div>

                                        <div className="space-y-2">
                                            <Input id="email" name="email" type="email" placeholder="Your Email" required className="bg-white border-slate-200 h-12" />
                                        </div>

                                        <div className="space-y-2">
                                            <Input id="phone" name="phone" type="tel" placeholder="Your Phone Number" className="bg-white border-slate-200 h-12" />
                                        </div>

                                        <div className="space-y-2">
                                            <Textarea id="message" name="message" placeholder="Your Message" rows={6} required className="bg-white border-slate-200 resize-none pt-4" />
                                        </div>

                                        <Button type="submit" className="bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold h-12 px-8 rounded-full" disabled={loading}>
                                            {loading ? "Sending..." : "Send Message"} <ArrowUpRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* Right: Placeholder Image */}
                            <div className="flex-1 relative mt-10">
                                <Image src="/images/register-image.jpg" alt="Contact" width={400} height={400} className="rounded-xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Google Map Section */}
                <section className="w-full h-[450px] bg-slate-200">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15229.565848961445!2d78.54057108715824!3d17.3929914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb993e73373bd7%3A0x6bfcf7608eed805e!2sMKF%20TRUST!5e0!3m2!1sen!2sin!4v1770210670709!5m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="MKF Trust Location"
                    ></iframe>
                </section>

                {/* Social Media Feeds Section */}
                <section className="py-10 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="text-blue-600 font-bold text-sm mb-2 block">Stay Connected</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Follow Us On Social Media
                            </h2>
                        </div>
                        <div className="flex flex-col xl:flex-row justify-center items-start gap-10">
                            {/* Facebook Feed */}
                            <div className="w-full max-w-[500px] mx-auto xl:mx-0 overflow-hidden rounded-xl shadow-lg bg-white">
                                <iframe
                                    src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/profile.php?id=61555264095906&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                                    width="500"
                                    height="600"
                                    style={{ border: "none", overflow: "hidden" }}
                                    scrolling="no"
                                    frameBorder="0"
                                    allowFullScreen={true}
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    title="Facebook Feed"
                                    className="w-full"
                                ></iframe>
                            </div>

                            {/* Instagram Feed */}
                            <div className="w-full max-w-[400px] mx-auto xl:mx-0 overflow-hidden rounded-xl shadow-lg bg-white">
                                <iframe
                                    src="https://www.instagram.com/mkftrust/embed"
                                    width="400"
                                    height="600" // Embedding limit
                                    frameBorder="0"
                                    scrolling="no"
                                    allowtransparency="true"
                                    title="Instagram Feed"
                                    className="w-full flex-1"
                                    style={{ border: "none", overflow: "hidden" }}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Contact Info Cards ("Have Questions?") */}
                <section className="py-10 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="lg:w-1/3">
                                <span className="text-blue-600 font-bold text-sm mb-2 block">Ask Question</span>
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                    Have<br />Questions?
                                </h2>
                                <p className="text-slate-500 text-xl font-light">We’re Here To Help!</p>
                            </div>

                            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {/* Address */}
                                <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                        <MapPin className="text-red-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Address</h3>
                                        <p className="text-sm text-slate-500">Hyderabad, Telangana</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                        <Phone className="text-red-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Phone</h3>
                                        <p className="text-sm text-slate-500">+91-99662 22532</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                        <Mail className="text-red-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Email</h3>
                                        <p className="text-sm text-slate-500">mkfcharitabletrust@gmail.com</p>
                                    </div>
                                </div>

                                {/* Website */}
                                <div className="bg-white p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                        <Globe className="text-red-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Website</h3>
                                        <p className="text-sm text-slate-500">www.mkftrustindia.org</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
