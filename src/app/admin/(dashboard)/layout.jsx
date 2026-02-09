"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import axios from "@/lib/axios";
import { API_ROUTES } from "@/lib/routes";

export default function AdminDashboardLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        // Handle BFcache (Back/Forward Cache) restore
        const handlePageShow = (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        };
        window.addEventListener("pageshow", handlePageShow);

        // Double-check session on client-side
        const verifySession = async () => {
            try {
                await axios.get(API_ROUTES.ADMIN.STATS);
            } catch (e) {
                window.location.href = "/admin/login"; // Force full reload to login
            }
        };
        verifySession();

        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <AdminSidebar />
            <AdminHeader />

            <main className="ml-64 pt-16">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
