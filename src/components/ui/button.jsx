import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Note: You need to install class-variance-authority: npm install class-variance-authority
// Or I can implement a simpler version without it if preferred, but cva is standard for shadcn-like setups.
// Since I didn't install cva, I'll use a standard switch/map approach for now or install it.
// Actually, for a premium feel, cva is great. I'll stick to manual cn for now to avoid extra deps if not installed.
// Wait, I didn't install cva. I'll use `cn` manually.

const buttonVariants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
};

const buttonSizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
};

export function Button({ className, variant = "default", size = "default", ...props }) {
    const variantClass = buttonVariants[variant] || buttonVariants.default;
    const sizeClass = buttonSizes[size] || buttonSizes.default;

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variantClass,
                sizeClass,
                className
            )}
            {...props}
        />
    );
}
