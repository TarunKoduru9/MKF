"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

export default function AdminDonationsPage() {
    const [searchTerm, setSearchTerm] = useState("");

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
                                <th className="px-6 py-3">Purpose</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-red-500">
                                        Error loading data
                                    </td>
                                </tr>
                            ) : filteredDonations?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center">No donations found.</td>
                                </tr>
                            ) : (
                                filteredDonations?.map((donation) => (
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
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹ {parseFloat(donation.amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">{donation.purpose}</td>
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
