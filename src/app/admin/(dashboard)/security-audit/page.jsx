"use client";

import { useState, useEffect } from "react";
import { Shield, Search, Calendar, AlertCircle, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SecurityAuditPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { toast } = useToast();

    // Filters
    const [emailFilter, setEmailFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFromFilter, setDateFromFilter] = useState("");
    const [dateToFilter, setDateToFilter] = useState("");

    // Fetch logs
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "50"
            });

            if (emailFilter) params.append("email", emailFilter);
            if (statusFilter !== "all") params.append("status", statusFilter);
            if (dateFromFilter) params.append("dateFrom", dateFromFilter);
            if (dateToFilter) params.append("dateTo", dateToFilter);

            const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch logs");
            }

            setLogs(data.logs);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const handleFilterApply = () => {
        setPage(1);
        fetchLogs();
    };

    const handleFilterReset = () => {
        setEmailFilter("");
        setStatusFilter("all");
        setDateFromFilter("");
        setDateToFilter("");
        setPage(1);
        setTimeout(fetchLogs, 100);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return "N/A";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-slate-800">Security Audit Logs</h1>
                </div>
                <p className="text-slate-600">Track all admin login attempts, IP addresses, and security events</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Email Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    {/* Date From */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                        <input
                            type="date"
                            value={dateFromFilter}
                            onChange={(e) => setDateFromFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                        <input
                            type="date"
                            value={dateToFilter}
                            onChange={(e) => setDateToFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleFilterApply}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={handleFilterReset}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Total Logs</p>
                    <p className="text-2xl font-bold text-slate-800">{total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Current Page</p>
                    <p className="text-2xl font-bold text-slate-800">{page} / {totalPages || 1}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 mb-1">Showing</p>
                    <p className="text-2xl font-bold text-slate-800">{logs.length} logs</p>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <AlertCircle className="w-12 h-12 mb-3" />
                        <p>No audit logs found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Timestamp</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">User Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">IP Address</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Failure Reason</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">User Agent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            {log.email}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            {log.user_name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {log.login_status === "success" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Success
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-700 font-mono">
                                            {log.ip_address}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            {log.failure_reason || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600" title={log.user_agent}>
                                            {truncateText(log.user_agent, 40)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                        Showing page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
