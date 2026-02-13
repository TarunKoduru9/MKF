"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Search, User } from "lucide-react";
import { useState } from "react";
import { API_ROUTES } from "@/lib/routes";

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: users, isLoading, isError } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const { data } = await axios.get(API_ROUTES.ADMIN.USERS);
            return data;
        },
    });

    const filteredUsers = users?.filter((u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
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
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-red-500">
                                        Error loading data
                                    </td>
                                </tr>
                            ) : filteredUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers?.map((user) => (
                                    <tr key={user.uid} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{user.email}</div>
                                            <div className="text-xs text-gray-400">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.district}, {user.state}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "admin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(user.created_at).toLocaleDateString()}
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
