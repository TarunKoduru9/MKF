"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon, Video, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "@/lib/routes";

export default function GalleryManagementPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Form State
    const [uploadType, setUploadType] = useState("image"); // 'image' | 'video'
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("general");
    const [file, setFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");

    // -- Queries --
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['admin-gallery'],
        queryFn: async () => {
            const res = await axios.get(API_ROUTES.GALLERY.GET);
            return res.data;
        }
    });

    // -- Mutations --
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`${API_ROUTES.ADMIN.GALLERY.DELETE}?id=${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
            toast({ title: "Success", description: "Item deleted successfully." });
        },
        onError: (error) => {
            console.error("Delete failed:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to delete item." });
        }
    });

    const addMutation = useMutation({
        mutationFn: async (formData) => {
            await axios.post(API_ROUTES.ADMIN.GALLERY.ADD, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
            toast({ title: "Success", description: "Gallery item added successfully." });
            setIsModalOpen(false);
            resetForm();
        },
        onError: (error) => {
            console.error("Upload failed:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to add item." });
        }
    });

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        deleteMutation.mutate(id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("type", uploadType);
        formData.append("title", title);
        formData.append("category", category);

        if (uploadType === "image") {
            if (!file) {
                toast({ variant: "destructive", title: "Error", description: "Please select an image." });
                return;
            }
            formData.append("file", file);
        } else {
            if (!videoUrl) {
                toast({ variant: "destructive", title: "Error", description: "Please enter a video URL." });
                return;
            }
            formData.append("src", videoUrl);
        }

        addMutation.mutate(formData);
    };

    const resetForm = () => {
        setTitle("");
        setCategory("general");
        setFile(null);
        setVideoUrl("");
    };

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Gallery Management</h1>
                <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Item
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 group">
                            <div className="aspect-video relative bg-slate-100">
                                {item.type === "image" ? (
                                    <Image
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black">
                                        <Video className="w-12 h-12 text-white/50" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">Video Link</span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(item.id)}
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${item.type === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                        {item.type}
                                    </span>
                                    <span className="text-xs text-slate-500 uppercase font-medium">{item.category}</span>
                                </div>
                                <h3 className="font-semibold text-slate-800 line-clamp-1" title={item.title}>{item.title}</h3>
                                {item.type === 'video' && (
                                    <p className="text-xs text-slate-400 mt-1 truncate">{item.src}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No items found. Add some content to get started.
                        </div>
                    )}
                </div>
            )}

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-bold">Add Gallery Item</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setUploadType("image")}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${uploadType === "image" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:bg-slate-50"}`}
                                >
                                    <ImageIcon className="w-4 h-4" /> Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUploadType("video")}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${uploadType === "video" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 hover:bg-slate-50"}`}
                                >
                                    <Video className="w-4 h-4" /> Video
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title / Caption</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={title || ""}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter a title..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={category || "general"}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="general">General</option>
                                    <option value="distribution">Food Distribution</option>
                                    <option value="education">Education</option>
                                    <option value="health">Health Camp</option>
                                    <option value="events">Events</option>
                                </select>
                            </div>

                            {uploadType === "image" ? (
                                <div key="image-upload" className="space-y-2">
                                    <label className="text-sm font-medium">Image File (JPG, PNG)</label>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            ) : (
                                <div key="video-upload" className="space-y-2">
                                    <label className="text-sm font-medium">Instagram Video URL</label>
                                    <input
                                        type="url"
                                        required
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={videoUrl || ""}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                            )}

                            <div className="pt-2">
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={addMutation.isPending}>
                                    {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {addMutation.isPending ? "Saving..." : "Save Item"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
