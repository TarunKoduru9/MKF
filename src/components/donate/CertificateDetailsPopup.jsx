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

    return (
        <Modal isOpen={isOpen} onClose={() => { }} title="Complete Your Profile for 80G Certificate">
            <div className="space-y-4 py-2">
                <p className="text-sm text-slate-500 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    Thank you for your donation! Please provide the following details to generate your 80G tax exemption certificate.
                </p>

                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 space-y-2">
                        <Label>Title *</Label>
                        <select
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                        >
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Dr">Dr</option>
                        </select>
                    </div>
                    <div className="col-span-3 space-y-2">
                        <Label>First Name *</Label>
                        <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
                    </div>
                    <div className="space-y-2">
                        <Label>WhatsApp Number *</Label>
                        <Input name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Address *</Label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Full Address"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-2">
                        <Label>Document Type (Optional)</Label>
                        <select
                            name="docType"
                            value={formData.docType}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                        >
                            <option value="">Select Document</option>
                            <option value="PAN Card">PAN Card</option>
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Voter ID">Voter ID</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Document Number (Optional)</Label>
                        <Input name="docNumber" value={formData.docNumber} onChange={handleChange} placeholder="ABCD1234F" />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleSubmit} disabled={loading} className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Submit Details"}
                </Button>
            </div>
        </Modal>
    );
}
