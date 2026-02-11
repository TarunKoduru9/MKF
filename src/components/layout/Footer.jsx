"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const res = await axios.post("/api/newsletter", { email });
            if (res.status === 201) {
                alert("Subscribed successfully!");
                setEmail("");
            } else {
                alert("Failed to subscribe.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-[#111] text-white pt-10 pb-6 font-sans">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Top Section: Logo & Headlines */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-8">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative w-16 h-16 rounded-full bg-white border-2 border-green-600 flex items-center justify-center p-1 overflow-hidden transition-transform group-hover:scale-105">
                            <Image
                                src="/images/logo.jpg"
                                alt="MKF Trust"
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-1 group-hover:text-gray-200 transition-colors">MKF TRUST</h2>
                            <p className="text-gray-400 text-sm tracking-wide">Together We Make Difference</p>
                        </div>
                    </Link>

                    {/* Impact Headline */}
                    <div className="text-left md:text-right max-w-md">
                        <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                            Join Us And Make <br />
                            An Impact!
                        </h3>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 mb-8">

                    {/* Newsletter Section (Left Side - spans 4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-xl font-bold">Join Our Newsletter</h4>
                        <div className="flex bg-white rounded-full p-1 shadow-lg w-full max-w-sm items-center">
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-transparent px-4 py-2 text-slate-800 placeholder:text-slate-400 outline-none text-base w-full min-w-0"
                            />
                            <button
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="bg-[#DC2626] hover:bg-red-700 text-white font-bold px-6 py-2 rounded-full transition-all flex items-center gap-2 whitespace-nowrap shadow-md m-0.5"
                            >
                                {loading ? "..." : (
                                    <>
                                        Submit <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Links Columns (Right Side - spans 8 cols) */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

                        {/* Information */}
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold">Information</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 mt-1 text-white shrink-0" />
                                    <span>
                                        Hyderabad, <br />
                                        Telangana
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-white shrink-0" />
                                    <span>+91 9966222532</span>
                                </li>
                                <li className="flex items-center gap-5">
                                    <Mail className="w-4 h-4 text-white shrink-0" />
                                    <a href="mailto:mkfcharitabletrust@gmail.com" className="hover:text-white transition-colors break-all">
                                        mkfcharitabletrust@gmail.com
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold">Quick Links</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><Link href="/#programs" className="hover:text-white transition-colors">Campaigns</Link></li>
                                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="/#involved" className="hover:text-white transition-colors">Get Involved</Link></li>
                                <li><Link href="/donate" className="hover:text-white transition-colors">Donate</Link></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold">Resources</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><Link href="/#programs" className="hover:text-white transition-colors">Success Story</Link></li>
                                <li><Link href="/#faq" className="hover:text-white transition-colors">Help and FAQ</Link></li>
                            </ul>
                        </div>

                        {/* Follow Us */}
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold">Follow Us</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li>
                                    <Link href="https://www.facebook.com/p/MKF-TRUST-61555264095906/" className="flex items-center gap-2 hover:text-white transition-colors">
                                        Facebook
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://www.instagram.com/mkftrust?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="flex items-center gap-2 hover:text-white transition-colors">
                                        Instagram
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://www.youtube.com/@mkftrust" className="flex items-center gap-2 hover:text-white transition-colors">
                                        Youtube
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
                <div className="lg:flex justify-between items-center px-4 border-t border-gray-800 pt-6 mt-4">
                    <p className="text-white text-sm tracking-wide mb-2 lg:mb-0">Copyright © 2026 MKF Trust, All rights reserved.</p>
                    <p className="text-white text-sm tracking-wide">Design & Developed by Arora Tech Solutions Pvt Ltd</p>
                </div>
            </div>
        </footer>
    );
}
