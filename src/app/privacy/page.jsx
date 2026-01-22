"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-100">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground mb-8">Last updated: January 2024</p>

                    <div className="space-y-8 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">1. Introduction</h2>
                            <p>
                                MKF Trust ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
                            <p>
                                We may collect personal information that you voluntarily provide to us when you:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li>Register for an account.</li>
                                <li>Make a donation.</li>
                                <li>Sign up for our newsletter or volunteer programs.</li>
                                <li>Contact us via our forms.</li>
                            </ul>
                            <p className="mt-2">
                                This information may include your name, email address, phone number, and address. We do <strong>not</strong> store your credit card or sensitive payment information on our servers; payments are processed securely by our third-party payment processors (e.g., Razorpay).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
                            <p>
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li>Process your donations and send receipts.</li>
                                <li>Send you updates about our programs and impact (if opted in).</li>
                                <li>Respond to your inquiries and support requests.</li>
                                <li>Improve the functionality and security of our website.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">4. Sharing of Information</h2>
                            <p>
                                We do not sell, trade, or rent your personal information to third parties. We may share information with trusted third-party service providers who assist us in operating our website and conducting our business, so long as those parties agree to keep this information confidential.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">5. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">6. Your Rights</h2>
                            <p>
                                You have the right to request access to the personal information we hold about you and to ask for your data to be corrected or deleted. Please contact us if you wish to exercise these rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">7. Contact Us</h2>
                            <p>
                                If you have any questions or concerns about our Privacy Policy, please contact us at: <br />
                                <strong>Email:</strong> mkfcharitabletrust@gmail.com
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
