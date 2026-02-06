"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Heart, Users, LogOut, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Donations",
        href: "/admin/donations",
        icon: Heart,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Forgot Password",
        href: "/admin/forgot-password",
        icon: KeyRound,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white font-sans">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold text-[#DC2626] font-heading">MKF Admin</span>
            </div>

            <div className="flex h-[calc(100vh-64px)] flex-col justify-between py-6">
                <nav className="space-y-1 px-4">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-red-50 text-[#DC2626]"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4">
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.replace('/admin/login');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#DC2626] hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}
