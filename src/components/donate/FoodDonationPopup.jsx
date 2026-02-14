
"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { API_ROUTES } from "@/lib/routes";

export function FoodDonationPopup({ isOpen, onClose, onSubmit, packageName }) {
    const [category, setCategory] = useState("Birthday");
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [reason, setReason] = useState("");
    const [wishes, setWishes] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    // ... (keep handleImageUpload and removeImage as is)

    // Re-declare them here since I can't easily skip lines in this specific tool without replacing the whole block or making multiple calls for small chunks.
    // Actually, I can just replace the top part and the submit part.

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 3) {
            alert("You can only upload up to 3 images.");
            return;
        }

        setUploading(true);
        try {
            const uploadedUrls = [];
            for (const file of files) {
                if (!file.type.startsWith("image/")) {
                    alert(`Skipping ${file.name}: Only images are allowed.`);
                    continue;
                }

                const formData = new FormData();
                formData.append("file", file);

                const res = await axios.post(API_ROUTES.UPLOAD, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                if (res.data.success) {
                    uploadedUrls.push(res.data.url);
                }
            }
            setImages(prev => [...prev, ...uploadedUrls]);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload images. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!eventDate) {
            alert("Please select an event date.");
            return;
        }
        if (category === "Marriage Anniversary" && (!name1 || !name2)) {
            alert("Please enter both names.");
            return;
        }
        if (category !== "Marriage Anniversary" && !name1) {
            alert("Please enter the name.");
            return;
        }
        if (category === "Other" && !reason.trim()) {
            alert("Please specify the reason.");
            return;
        }

        onSubmit({
            category,
            name1,
            name2: category === "Marriage Anniversary" ? name2 : null,
            reason: category === "Other" ? reason : null,
            wishes,
            eventDate,
            images
        });
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white md:rounded-2xl shadow-2xl w-full max-w-2xl h-[100dvh] md:h-auto md:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex-none sticky top-0 z-10 bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 text-red-600 p-2.5 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Donate: {packageName}</h2>
                            <p className="text-xs text-slate-500 font-medium">Make their special day memorable</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-1">
                            <Label className="text-xs uppercase font-bold text-slate-500">Occasion</Label>
                            <select
                                className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all font-medium"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Birthday">Birthday</option>
                                <option value="Marriage Anniversary">Marriage Anniversary</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-1">
                            <Label className="text-xs uppercase font-bold text-slate-500">Event Date</Label>
                            <Input
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                            />
                        </div>

                        {/* Dynamic Name Inputs */}
                        {category === "Marriage Anniversary" ? (
                            <>
                                <div className="space-y-2 md:col-span-1">
                                    <Label className="text-xs uppercase font-bold text-slate-500">Husband's Name</Label>
                                    <Input
                                        placeholder="Husband's Name"
                                        value={name1}
                                        onChange={(e) => setName1(e.target.value)}
                                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label className="text-xs uppercase font-bold text-slate-500">Wife's Name</Label>
                                    <Input
                                        placeholder="Wife's Name"
                                        value={name2}
                                        onChange={(e) => setName2(e.target.value)}
                                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs uppercase font-bold text-slate-500">Name</Label>
                                <Input
                                    placeholder="Enter Name"
                                    value={name1}
                                    onChange={(e) => setName1(e.target.value)}
                                    className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                />
                            </div>
                        )}

                        {category === "Other" && (
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-xs uppercase font-bold text-slate-500">Reason / Occasion</Label>
                                <Input
                                    placeholder="e.g. In Memory of, Promotion"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                />
                            </div>
                        )}

                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs uppercase font-bold text-slate-500">Wishes / Message</Label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus:bg-white resize-none transition-all"
                                placeholder="Write your heartfelt wishes here (optional)..."
                                value={wishes}
                                onChange={(e) => setWishes(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3 pt-2 md:col-span-2">
                            <Label className="text-xs uppercase font-bold text-slate-500 flex justify-between">
                                Upload Images
                                <span className="text-xs font-normal text-slate-400">Max 3 photos</span>
                            </Label>

                            <div className="flex flex-wrap gap-4">
                                {images.map((url, index) => (
                                    <div key={index} className="relative w-24 h-24 border border-slate-200 rounded-lg overflow-hidden group shadow-sm">
                                        <Image src={url} alt="Preview" fill className="object-cover" />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {images.length < 3 && (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all group overflow-hidden relative bg-slate-50">
                                        {uploading ? (
                                            <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                                        ) : (
                                            <>
                                                <Upload className="h-6 w-6 mb-1 text-slate-400 group-hover:text-red-500 transition-colors" />
                                                <span className="text-[10px] text-slate-500 font-medium group-hover:text-red-600">Add Photo</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                )}
                            </div>
                            <p className="text-xs text-slate-400">Supported formats: JPG, PNG. Help us verify the event.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-none sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex flex-col-reverse md:flex-row justify-end gap-3 rounded-b-2xl">
                    <Button variant="ghost" onClick={onClose} disabled={uploading} className="w-full md:w-auto text-slate-500 hover:text-slate-700 h-11 rounded-xl">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={uploading} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-8 h-11 shadow-lg shadow-red-100 rounded-xl">
                        {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Add to Cart"}
                    </Button>
                </div>
            </div>
        </div>
    );

}
