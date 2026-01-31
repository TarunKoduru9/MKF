"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
    {
        question: "How can I become a volunteer?",
        answer: "You can become a volunteer by filling out our online application form. Once submitted, our team will review your application and get in touch with you for a brief orientation session."
    },
    {
        question: "What are the volunteer roles available?",
        answer: "We have various roles including event coordination, teaching, content writing, social media management, and fieldwork support. We match your skills and interests with our current needs."
    },
    {
        question: "Is there any specific experience required?",
        answer: "No specific experience is required for most roles. We believe that passion and dedication are the most important qualifications. Training is provided for specialized tasks."
    },
    {
        question: "How much time do I need to commit?",
        answer: "Time commitment is flexible. You can choose to volunteer weekly, monthly, or for specific events. We appreciate any amount of time you can dedicate to the cause."
    },
    {
        question: "Can I volunteer remotely?",
        answer: "Yes, we have several remote volunteering opportunities such as content creation, graphic design, and checking in on beneficiaries via phone or video calls."
    },
    {
        question: "Will I receive any training?",
        answer: "Yes, all volunteers receive an orientation and specific training related to their assigned roles to ensure they feel confident and prepared."
    },
    {
        question: "Do volunteers get reimbursed for expenses?",
        answer: "While we generally do not reimburse for travel or personal expenses, any direct costs incurred for authorized project activities will be reimbursed upon submission of receipts."
    }
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-2">
                    <span className="text-blue-600 font-bold text-sm tracking-wide uppercase">
                        FAQ
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#DC2626] leading-tight">
                        Frequently Asked Questions About <br className="hidden md:block" />
                        Volunteering With Us
                    </h2>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md bg-white"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-white"
                            >
                                <span className="text-lg font-bold text-slate-800">
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-slate-500 transition-transform" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-500 transition-transform" />
                                )}
                            </button>

                            <div
                                className={`
                                    overflow-hidden transition-all duration-300 ease-in-out
                                    ${openIndex === index ? "max-h-48 opacity-100 p-6 pt-0" : "max-h-0 opacity-0 p-0"}
                                `}
                            >
                                <p className="text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
