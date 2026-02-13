"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { API_ROUTES } from "@/lib/routes";
import { Loader2, MessageSquare, Phone, Mail, Calendar, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(API_ROUTES.ADMIN.MESSAGES);
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter((msg) =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.phone && msg.phone.includes(searchTerm))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
                    <p className="text-slate-500">View and manage inquiries from the contact form</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search messages..."
                        className="pl-9 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No messages found</h3>
                            <p className="text-slate-500">
                                {searchTerm ? "Try adjusting your search terms" : "New messages will appear here"}
                            </p>
                        </div>
                    ) : (
                        filteredMessages.map((msg) => (
                            <div key={msg.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <span className="text-blue-600 font-bold text-lg">
                                                {msg.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{msg.name}</h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    <a href={`mailto:${msg.email}`} className="hover:text-blue-600 hover:underline">
                                                        {msg.email}
                                                    </a>
                                                </div>
                                                {msg.phone && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        <a href={`tel:${msg.phone}`} className="hover:text-blue-600 hover:underline">
                                                            {msg.phone}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400 whitespace-nowrap md:self-start">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{format(new Date(msg.created_at), "PPP p")}</span>
                                    </div>
                                </div>
                                <div className="pl-14">
                                    <p className="text-slate-700 bg-slate-50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
