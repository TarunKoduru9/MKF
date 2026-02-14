"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Search, Eye, Download, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DonationModal } from "./DonationModal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { API_ROUTES } from "@/lib/routes";

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
            const { data } = await axios.get(API_ROUTES.ADMIN.DONATIONS);
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



    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
                <div className="relative w-full sm:w-64">
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

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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

            <DonationModal isOpen={!!selectedDonation} onClose={() => setSelectedDonation(null)} title="Donation Details">
                {selectedDonation && (
                    <div className="space-y-8">
                        {/* Top Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <div className="space-y-1">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</h4>
                                <p className="text-2xl font-bold text-gray-900">₹{parseFloat(selectedDonation.amount).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</h4>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${selectedDonation.payment_status === 'success'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {selectedDonation.payment_status.toUpperCase()}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</h4>
                                <p className="font-medium text-gray-900">{new Date(selectedDonation.created_at).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-500">{new Date(selectedDonation.created_at).toLocaleTimeString()}</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</h4>
                                <p className="font-mono text-sm text-gray-600 truncate" title={selectedDonation.order_id}>{selectedDonation.order_id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Donor Info Column */}
                            <div className="md:col-span-1 space-y-4">
                                <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Donor Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Name</p>
                                        <p className="font-medium text-gray-900">{selectedDonation.user_name || selectedDonation.guest_name || "Anonymous"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                        <p className="text-sm text-gray-700 break-all">{selectedDonation.user_email || selectedDonation.guest_email || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                                        <p className="text-sm text-gray-700">{selectedDonation.user_phone || selectedDonation.guest_phone || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Event Details & Purpose Column - Spans 2 columns on desktop */}
                            <div className="md:col-span-2 space-y-6">
                                {selectedDonation.food_details?.map((detail, idx) => {
                                    const detailImages = safeParseImages(detail.image_urls);
                                    return (
                                        <div key={idx} className="space-y-4">
                                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                                <h4 className="text-sm font-semibold text-gray-900">Event Details</h4>
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                    {detail.category}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {detail.reason && (
                                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        <span className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Occasion</span>
                                                        <span className="font-medium text-gray-900">{detail.reason}</span>
                                                    </div>
                                                )}
                                                {detail.event_date && (
                                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                        <span className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Event Date</span>
                                                        <span className="font-medium text-gray-900">{new Date(detail.event_date).toLocaleDateString(undefined, {
                                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                        })}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Names and Wishes */}
                                            {(detail.name_1 || detail.wishes) && (
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2 space-y-2">
                                                    {detail.name_1 && (
                                                        <div>
                                                            <span className="block text-xs text-gray-500 mb-0.5 uppercase tracking-wider font-semibold">
                                                                {detail.category === 'Marriage Anniversary' ? "Husband's Name" : "Name"}
                                                            </span>
                                                            <span className="font-medium text-gray-900">{detail.name_1}</span>
                                                        </div>
                                                    )}
                                                    {detail.name_2 && detail.category === 'Marriage Anniversary' && (
                                                        <div>
                                                            <span className="block text-xs text-gray-500 mb-0.5 uppercase tracking-wider font-semibold">Wife's Name</span>
                                                            <span className="font-medium text-gray-900">{detail.name_2}</span>
                                                        </div>
                                                    )}
                                                    {detail.wishes && (
                                                        <div className="pt-2 border-t border-slate-200 mt-2">
                                                            <span className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Wishes</span>
                                                            <p className="text-sm text-slate-700 italic">"{detail.wishes}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {detailImages.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Uploaded Images</p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                        {detailImages.map((url, i) => (
                                                            <div key={i} className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-gray-100 shadow-sm">
                                                                <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                                                    <Image src={url} alt={`Upload ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                                </a>
                                                                <a
                                                                    href={url}
                                                                    download={`donation-proof-${i + 1}.jpg`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full text-slate-700 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:text-blue-600 hover:scale-110"
                                                                    title="Download"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-3">Purpose / Items</h4>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm whitespace-pre-wrap text-slate-700 leading-relaxed">
                                    {selectedDonation.purpose}
                                </div>


                                {/* Certificate Details Section */}
                                {selectedDonation.certificate_details && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-3">80G Certificate Details</h4>
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Name</p>
                                                    <p className="font-medium text-gray-900">
                                                        {selectedDonation.certificate_details.title} {selectedDonation.certificate_details.first_name} {selectedDonation.certificate_details.last_name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">WhatsApp</p>
                                                    <p className="font-medium text-gray-900">{selectedDonation.certificate_details.whatsapp}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Address</p>
                                                <p className="font-medium text-gray-900">{selectedDonation.certificate_details.address}</p>
                                            </div>
                                            {(selectedDonation.certificate_details.doc_type || selectedDonation.certificate_details.doc_number) && (
                                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-0.5">Document Type</p>
                                                        <p className="font-medium text-gray-900">{selectedDonation.certificate_details.doc_type || "-"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-0.5">Document Number</p>
                                                        <p className="font-medium text-gray-900">{selectedDonation.certificate_details.doc_number || "-"}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button variant="outline" onClick={() => setSelectedDonation(null)}>Close Details</Button>
                        </div>
                    </div>
                )
                }
            </DonationModal >
        </div >
    );
}
