import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import useStore from "@/lib/store";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function DonationCard({ id, title, price, description, image, type = "unit" }) {
    const addToCart = useStore((state) => state.addToCart);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            id: `${id}`,
            title,
            price,
            quantity, // Add specific quantity selected
            image,
            description
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white group">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
                    <div className="w-full h-full relative">
                        {/* Using background image for prototype simplicity */}
                        <Image
                            src={image || "/images/placeholder.svg"} // Fallback if needed, though we have images
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-primary">₹{price} <span className="text-sm font-normal text-muted-foreground">/ {type === "unit" ? "Unit" : "Pack"}</span></span>

                    {/* Quantity Control */}
                    <div className="flex items-center border border-slate-200 rounded-md">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-1 hover:bg-slate-50 text-slate-600"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 py-1 text-sm font-medium w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-1 hover:bg-slate-50 text-slate-600"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 flex-1">
                    {description}
                </p>

                <Button
                    variant="outline"
                    className={cn(
                        "w-full border-primary text-primary hover:bg-primary hover:text-white transition-all font-semibold uppercase tracking-wide",
                        added && "bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700"
                    )}
                    onClick={handleAddToCart}
                >
                    {added ? "Added to Cart" : "Add to Cart"} {added ? null : <Heart className="ml-2 h-4 w-4 fill-current" />}
                </Button>
            </div>
        </Card>
    );
}
