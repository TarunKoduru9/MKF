"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useStore from "@/lib/store";
import { usePathname } from "next/navigation";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const cart = useStore((state) => state.cart);
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const pathname = usePathname();

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Donate", href: "/donate" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                        <Image
                            src="/images/logo.jpg"
                            alt="Logo"
                            width={160}
                            height={160}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="hidden flex-col md:flex">
                        <span className="text-xl font-bold leading-none text-primary">MKF TRUST</span>
                        <span className="text-[10px] text-muted-foreground">Together We Make Change</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary font-bold" : "text-foreground"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
                            <ShoppingCart className="h-5 w-5" />
                            {cart.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {isAuthenticated ? (
                        <Link href="/my-account">
                            <Button variant="ghost" className="gap-2 text-foreground hover:text-primary">
                                <User className="h-5 w-5" />
                                <span>My Account</span>
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" className="gap-2 text-foreground hover:text-primary">
                                <User className="h-5 w-5" />
                                <span>Login</span>
                            </Button>
                        </Link>
                    )}

                    <Link href="/donate">
                        <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                            Donate Now
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="fixed inset-0 z-[200] bg-white w-screen h-screen flex flex-col md:hidden">
                    <div className="flex justify-between items-center p-6 border-b">
                        <Link href="/">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                                <Image
                                    src="/images/logo.jpg"
                                    alt="Logo"
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Link>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-foreground hover:bg-slate-100 rounded-full transition-colors">
                            <X className="h-8 w-8" />
                        </button>
                    </div>

                    <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-md font-semibold transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-foreground"}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="w-full h-px bg-slate-200 my-2" />

                        <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-xl font-medium hover:text-primary">
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6" />
                                {cart.length > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </div>
                            Cart
                        </Link>

                        {isAuthenticated ? (
                            <Link href="/my-account" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" size="lg" className="w-full justify-start gap-3 text-lg h-14">
                                    <User className="h-5 w-5" /> My Account
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" size="lg" className="w-full justify-start gap-3 text-lg h-14">
                                    <User className="h-5 w-5" /> Login
                                </Button>
                            </Link>
                        )}
                        <Link href="/donate" onClick={() => setIsOpen(false)}>
                            <Button size="lg" className="w-full text-lg rounded-full py-6 shadow-lg">Donate Now</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
