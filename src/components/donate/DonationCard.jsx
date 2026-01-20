import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import useStore from "@/lib/store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function DonationCard({ id, title, price, description, image, type = "unit", variants }) {
    const addToCart = useStore((state) => state.addToCart);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const router = useRouter();

    // Variant Logic
    const [variant, setVariant] = useState(variants ? "veg" : null);

    const currentPrice = variants ? variants[variant] : price;
    const currentTitle = variants ? `${title} (${variant === 'veg' ? 'Veg' : 'Non-Veg'})` : title;

    const handleAddToCart = () => {
        addToCart({
            id: variants ? `${id}-${variant}` : `${id}`,
            title: currentTitle,
            price: currentPrice,
            quantity,
            image,
            description
        });
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            router.push('/cart');
        }, 500);
    };

    return (
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white group">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
                    <div className="w-full h-full relative">
                        <Image
                            src={image || "/images/placeholder.svg"}
                            alt={currentTitle}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                <div className="flex flex-col gap-4 mb-4">
                    <span className="text-xl font-bold text-primary">₹{currentPrice} <span className="text-sm font-normal text-muted-foreground">/ {type === "unit" ? "Unit" : "Pack"}</span></span>

                    {/* Variant Toggle */}
                    {variants && (
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setVariant("veg")}
                                className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-all", variant === "veg" ? "bg-white text-green-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                            >
                                Veg
                            </button>
                            <button
                                onClick={() => setVariant("nonveg")}
                                className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-all", variant === "nonveg" ? "bg-white text-red-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                            >
                                Non-Veg
                            </button>
                        </div>
                    )}

                    {/* Quantity Control */}
                    <div className="flex items-center justify-between border border-slate-200 rounded-md p-1">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 hover:bg-slate-50 text-slate-600 rounded-md"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-base font-semibold w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-2 hover:bg-slate-50 text-slate-600 rounded-md"
                        >
                            <Plus className="h-4 w-4" />
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
                    {added ? "Redirecting..." : "Add to Cart"} {added ? null : <Heart className="ml-2 h-4 w-4 fill-current" />}
                </Button>
            </div>
        </Card>
    );
}
