
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Donate: ${packageName}`}>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Birthday">Birthday</option>
                        <option value="Marriage Anniversary">Marriage Anniversary</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Dynamic Name Inputs */}
                {category === "Marriage Anniversary" ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Husband's Name</Label>
                            <Input
                                placeholder="Name"
                                value={name1}
                                onChange={(e) => setName1(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Wife's Name</Label>
                            <Input
                                placeholder="Name"
                                value={name2}
                                onChange={(e) => setName2(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            placeholder="Full Name"
                            value={name1}
                            onChange={(e) => setName1(e.target.value)}
                        />
                    </div>
                )}

                {category === "Other" && (
                    <div className="space-y-2">
                        <Label>Reason / Occasion</Label>
                        <Input
                            placeholder="Enter the occasion"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Wishes / Message</Label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write your best wishes here..."
                        value={wishes}
                        onChange={(e) => setWishes(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Event Date</Label>
                    <Input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Upload Images (Max 3)</Label>
                    <div className="flex items-center gap-4">
                        <label className="cursor-pointer flex items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 relative">
                            {uploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                            ) : (
                                <div className="flex flex-col items-center text-slate-500 text-xs">
                                    <Upload className="h-6 w-6 mb-1" />
                                    <span>Upload</span>
                                </div>
                            )}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={uploading || images.length >= 3}
                            />
                        </label>

                        {/* Image Previews */}
                        {images.map((url, index) => (
                            <div key={index} className="relative w-24 h-24 border border-slate-200 rounded-lg overflow-hidden group">
                                <Image src={url} alt="Preview" fill className="object-cover" />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500">Supported formats: JPG, PNG. Max 3 images.</p>
                </div>
            </div>

            <div className="mt-6 flex flex-row gap-2 justify-end">
                <Button variant="outline" onClick={onClose} disabled={uploading}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={uploading} className="bg-red-600 hover:bg-red-700">
                    {uploading ? "Uploading..." : "Add to Cart"}
                </Button>
            </div>
        </Modal>
    );
}
