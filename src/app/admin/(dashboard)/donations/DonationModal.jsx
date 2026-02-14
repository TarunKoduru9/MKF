"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DonationModal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
            <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 p-0 max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10 w-full">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export { DonationModal };
