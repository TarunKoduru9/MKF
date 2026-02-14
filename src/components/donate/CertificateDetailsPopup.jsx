"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this, otherwise Input
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";
import { Loader2 } from "lucide-react";

export function CertificateDetailsPopup({ isOpen, onClose, orderId, onComplete }) {
    const [formData, setFormData] = useState({
        title: "Mr",
        firstName: "",
        lastName: "",
        email: "",
        whatsapp: "",
        address: "",
        docType: "",
        docNumber: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.whatsapp || !formData.address) {
            alert("Please fill in all mandatory fields (marked with *).");
            return;
        }

        setLoading(true);
        try {
            await axios.post(API_ROUTES.DONATION.CERTIFICATE || "/api/donations/certificate", {
                ...formData,
                orderId
            });
            alert("Certificate details saved successfully!");
            onComplete?.();
            onClose();
        } catch (error) {
            console.error("Failed to save details", error);
            alert("Failed to save details. Please try again or contact support.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white md:rounded-2xl shadow-2xl w-full max-w-2xl h-[100dvh] md:h-auto md:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex-none sticky top-0 z-10 bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-50 text-green-600 p-2.5 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Donation Successful!</h2>
                            <p className="text-xs text-slate-500 font-medium">Complete your profile for 80G Certificate</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex gap-3 items-start mb-6">
                        <svg className="shrink-0 w-5 h-5 mt-0.5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        <p>Thank you for your generous contribution. Please fill in the details below to receive your tax exemption certificate via email/WhatsApp.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1 space-y-2">
                            <Label className="text-xs uppercase font-bold text-slate-500">Title <span className="text-red-500">*</span></Label>
                            <select
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                            >
                                <option value="Mr">Mr.</option>
                                <option value="Mrs">Mrs.</option>
                                <option value="Ms">Ms.</option>
                                <option value="Dr">Dr.</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <Label className="text-xs uppercase font-bold text-slate-500">First Name <span className="text-red-500">*</span></Label>
                            <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. John" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white" />
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <Label className="text-xs uppercase font-bold text-slate-500">Last Name <span className="text-red-500">*</span></Label>
                        <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white" />
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-slate-500">Email <span className="text-red-500">*</span></Label>
                            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase font-bold text-slate-500">WhatsApp <span className="text-red-500">*</span></Label>
                            <Input name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} placeholder="+91 98765 43210" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white" />
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <Label className="text-xs uppercase font-bold text-slate-500">Permanent Address <span className="text-red-500">*</span></Label>
                        <Textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="min-h-[100px] resize-none rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-600"
                            placeholder="Enter your full address with pincode"
                        />
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            Optional Details
                            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">For Tax Filing</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-slate-500">Document Type</Label>
                                <select
                                    name="docType"
                                    value={formData.docType}
                                    onChange={handleChange}
                                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                                >
                                    <option value="">Select Document</option>
                                    <option value="PAN Card">PAN Card</option>
                                    <option value="Aadhaar Card">Aadhaar Card</option>
                                    <option value="Voter ID">Voter ID</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-slate-500">Document Number</Label>
                                <Input name="docNumber" value={formData.docNumber} onChange={handleChange} placeholder="e.g. ABCDE1234F" className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-none sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex flex-col-reverse md:flex-row justify-end gap-3 rounded-b-2xl">
                    <Button variant="ghost" onClick={onClose} className="w-full md:w-auto text-slate-500 hover:text-slate-700 h-11 rounded-xl">Skip for Now</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 h-11 shadow-lg shadow-slate-200 rounded-xl">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
