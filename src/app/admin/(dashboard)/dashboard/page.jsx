"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, Users, Calendar, TrendingUp, Loader2 } from "lucide-react";
import axios from "axios";
import { API_ROUTES } from "@/lib/routes";

export default function AdminDashboardPage() {

    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const { data } = await axios.get(API_ROUTES.ADMIN.STATS);
            return data;
        },
    });

    const { data: recentDonations, isLoading: isLoadingDonations } = useQuery({
        queryKey: ["admin-recent-donations"],
        queryFn: async () => {
            const { data } = await axios.get(API_ROUTES.ADMIN.DONATIONS);
            return data.slice(0, 5);
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500">Failed to load dashboard statistics.</div>;
    }

    const statCards = [
        {
            title: "Today's Donations",
            value: `₹ ${stats?.today?.toLocaleString() || 0}`,
            icon: DollarSign,
        },
        {
            title: "Weekly Donations",
            value: `₹ ${stats?.weekly?.toLocaleString() || 0}`,
            icon: TrendingUp,
        },
        {
            title: "Monthly Donations",
            value: `₹ ${stats?.monthly?.toLocaleString() || 0}`,
            icon: Calendar,
        },
        {
            title: "Total Users",
            value: stats?.users?.toLocaleString() || 0,
            icon: Users,
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="rounded-xl border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    <h3 className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</h3>
                                </div>
                                <div className="rounded-full bg-primary/10 p-3 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Recent Activity</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Donor</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoadingDonations ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center">
                                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
                                    </td>
                                </tr>
                            ) : recentDonations?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center">No recent activity.</td>
                                </tr>
                            ) : (
                                recentDonations?.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(donation.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {donation.user_name || donation.guest_name || "Anonymous"}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹ {parseFloat(donation.amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${donation.payment_status === "success" ? "bg-green-100 text-green-800" :
                                                donation.payment_status === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                                }`}>
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
