"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, Users, Calendar, TrendingUp, Loader2 } from "lucide-react";
import axios from "axios";

export default function AdminDashboardPage() {

    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const { data } = await axios.get("/api/admin/stats");
            return data;
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
                <p className="text-gray-500">Donations table coming next...</p>
            </div>
        </div>
    );
}
