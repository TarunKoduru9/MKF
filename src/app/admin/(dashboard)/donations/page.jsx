"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Search, Eye, Download, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const safeParseImages = (jsonString) => {
    if (!jsonString) return [];
    if (Array.isArray(jsonString)) return jsonString; // Handle pre-parsed JSON from DB driver
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'string') return [parsed];
        return [];
    } catch (e) {
        // If simple string/URL
        if (typeof jsonString === 'string' && jsonString.startsWith('http')) {
            return [jsonString];
        }
        return [];
    }
};

export default function AdminDonationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDonation, setSelectedDonation] = useState(null);

    const { data: donations, isLoading, isError } = useQuery({
        queryKey: ["admin-donations"],
        queryFn: async () => {
            const { data } = await axios.get("/api/admin/donations");
            return data;
        },
    });

    // Simple client-side search filtering
    const filteredDonations = donations?.filter((d) =>
        d.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("Donations Data:", donations);
    if (donations && donations.length > 0) {
        console.log("Sample Details:", donations[0].food_details);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search donations..."
                        className="w-full rounded-md border border-gray-300 pl-9 py-2 text-sm focus:border-primary focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Donor</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Images</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-red-500">
                                        Error loading data
                                    </td>
                                </tr>
                            ) : filteredDonations?.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center">No donations found.</td>
                                </tr>
                            ) : (
                                filteredDonations?.map((donation) => {
                                    const details = donation.food_details?.[0] || {};
                                    const images = safeParseImages(details.image_urls);

                                    return (
                                        <tr key={donation.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(donation.created_at).toLocaleDateString()}
                                                <div className="text-xs text-gray-400">{new Date(donation.created_at).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">{donation.order_id || "-"}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {donation.user_name || donation.guest_name || "Anonymous"}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {donation.user_email || donation.guest_email || "-"}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {donation.user_phone || donation.guest_phone || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                ₹ {parseFloat(donation.amount).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {details.category ? (
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        {details.category}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {images.length > 0 ? (
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {images.map((url, i) => (
                                                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white relative overflow-hidden bg-gray-100">
                                                                <Image src={url} alt="Proof" fill className="object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${donation.payment_status === "success"
                                                        ? "bg-green-100 text-green-800"
                                                        : donation.payment_status === "failed"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {donation.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button variant="outline" size="sm" onClick={() => setSelectedDonation(donation)}>
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={!!selectedDonation} onClose={() => setSelectedDonation(null)} title="Donation Details">
                {selectedDonation && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div>
                                <h4 className="font-semibold text-gray-500">Amount</h4>
                                <p className="text-xl font-bold text-green-600">₹{parseFloat(selectedDonation.amount).toLocaleString()}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-500">Status</h4>
                                <p className={`font-medium ${selectedDonation.payment_status === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {selectedDonation.payment_status.toUpperCase()}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-500">Date</h4>
                                <p>{new Date(selectedDonation.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-500">Order ID</h4>
                                <p className="font-mono text-xs">{selectedDonation.order_id}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 border-b pb-2 mb-3">Donor Information</h4>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <p><span className="text-gray-500">Name:</span> {selectedDonation.user_name || selectedDonation.guest_name || "Anonymous"}</p>
                                <p><span className="text-gray-500">Email:</span> {selectedDonation.user_email || selectedDonation.guest_email || "-"}</p>
                                <p><span className="text-gray-500">Phone:</span> {selectedDonation.user_phone || selectedDonation.guest_phone || "-"}</p>
                            </div>
                        </div>

                        {selectedDonation.food_details?.map((detail, idx) => {
                            const detailImages = safeParseImages(detail.image_urls);
                            return (
                                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        Event Details
                                        <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{detail.category}</span>
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        {detail.reason && <p><span className="font-medium text-gray-500">Occasion/Reason:</span> {detail.reason}</p>}
                                        {detail.event_date && <p><span className="font-medium text-gray-500">Event Date:</span> {new Date(detail.event_date).toLocaleDateString()}</p>}

                                        {detailImages.length > 0 && (
                                            <div className="mt-3">
                                                <p className="font-medium text-gray-500 mb-2">Uploaded Images:</p>
                                                <div className="flex gap-2 bg-white p-2 rounded-md border border-slate-100">
                                                    {detailImages.map((url, i) => (
                                                        <div key={i} className="group relative w-20 h-20 rounded-md overflow-hidden border border-slate-200">
                                                            <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                                                <Image src={url} alt={`Upload ${i + 1}`} fill className="object-cover transition-transform group-hover:scale-105" />
                                                            </a>
                                                            <a
                                                                href={url}
                                                                download={`donation-proof-${i + 1}.jpg`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="absolute bottom-1 right-1 bg-white/90 p-1 rounded-full text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600"
                                                                title="Download"
                                                            >
                                                                <Download className="h-3 w-3" />
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        <div>
                            <h4 className="font-semibold text-gray-900 border-b pb-2 mb-3">Items / Purpose</h4>
                            <div className="bg-slate-50 p-3 rounded-md border border-slate-100 text-sm whitespace-pre-wrap">
                                {selectedDonation.purpose}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setSelectedDonation(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
