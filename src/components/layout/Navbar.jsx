"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useStore from "@/lib/store";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Donate", href: "/donate" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    {/* Use an image or icon here if available, for now text/svg placeholder */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Image
                            src="/images/logo.jpg"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="hidden flex-col md:flex">
                        <span className="text-xl font-bold leading-none text-primary">MKF TRUST</span>
                        <span className="text-[10px] text-muted-foreground">Together we make a Difference</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
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
                            {useStore((state) => state.cart.length) > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                    {useStore((state) => state.cart.reduce((acc, item) => acc + item.quantity, 0))}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {useStore((state) => state.isAuthenticated) ? (
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
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b bg-background md:hidden"
                    >
                        <div className="flex flex-col space-y-4 p-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-foreground hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-2 pt-4 border-t">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <User className="h-4 w-4" /> Login
                                    </Button>
                                </Link>
                                <Link href="/donate" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Donate Now</Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
