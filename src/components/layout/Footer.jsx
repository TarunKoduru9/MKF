import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-secondary pt-16 pb-8 border-t border-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-xl font-bold text-primary">MKF</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold leading-none text-primary block">MKF TRUST</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            MKF Trust is a registered charitable organization committed to uplifting communities
                            and creating sustainable change through targeted programs.
                        </p>
                        <div className="flex gap-4">
                            <Link href="https://www.facebook.com/p/MKF-TRUST-61555264095906/" className="p-2 rounded-full bg-white text-gray-500 hover:text-primary hover:shadow-md transition-all">
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link href="https://www.youtube.com/@mkftrust" className="p-2 rounded-full bg-white text-gray-500 hover:text-primary hover:shadow-md transition-all">
                                <Youtube className="h-4 w-4" />
                            </Link>
                            <Link href="https://www.instagram.com/mkftrust?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="p-2 rounded-full bg-white text-gray-500 hover:text-primary hover:shadow-md transition-all">
                                <Instagram className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/#programs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Our Programs
                                </Link>
                            </li>
                            <li>
                                <Link href="/#story" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Our Impact
                                </Link>
                            </li>
                            <li>
                                <Link href="/#involved" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Get Involved
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Programs */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Information</h3>
                        <ul className="space-y-2">
                            {[
                                { name: "Education Support", href: "/#education-support" },
                                { name: "Healthcare Initiative", href: "/#healthcare-initiative" },
                                { name: "Food & Nutrition", href: "/#food-nutrition" },
                                { name: "Skill Development", href: "/#skill-development" },
                                { name: "Women Empowerment", href: "/#programs" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Contact Details</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                                <span>Hyderabad, Telangana</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 text-primary shrink-0" />
                                <span>+91 99662 22532</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary shrink-0" />
                                <span>mkfcharitabletrust@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>Copyright © 2026 MKF Trust. All rights reserved.</p>
                    <p>Design & Developed by Arora Tech Solutions Pvt Ltd</p>
                </div>
            </div>
        </footer>
    );
}
