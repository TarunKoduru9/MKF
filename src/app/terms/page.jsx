"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-slate-100">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
                    <p className="text-sm text-muted-foreground mb-8">Optionally effective as of January 1, 2024</p>

                    <div className="space-y-8 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the website of MKF Trust ("we," "us," or "our"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Services</h2>
                            <p>
                                MKF Trust is a charitable organization dedicated to community development through education, healthcare, and livelihood support. Our website allows users to donate, volunteer, and learn about our initiatives.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">3. User Conduct</h2>
                            <p>
                                You agree to use our website for lawful purposes only. You must not:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                <li>Use the site in any way that violates applicable local, national, or international law.</li>
                                <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
                                <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">4. Donations and Refunds</h2>
                            <p>
                                All donations are voluntary and non-refundable, except in cases of technical error or as required by law. We take great care to ensure transparency in how funds are utilized for our programs.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">5. Intellectual Property</h2>
                            <p>
                                The content on this website, including text, graphics, logos, and images, is the property of MKF Trust and is protected by copyright laws. You may not reproduce or distribute any content without our prior written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">6. Limitation of Liability</h2>
                            <p>
                                MKF Trust shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">7. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. Your continued use of the website following any changes indicates your acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-foreground mb-3">8. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at: <br />
                                <strong>Email:</strong> mkfcharitabletrust@gmail.com <br />
                                <strong>Address:</strong> Hyderabad, Telangana
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
