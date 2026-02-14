import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";

export function AdminHeader() {
    return (
        <header className="fixed right-0 top-0 z-30 flex h-16 w-full lg:w-[calc(100%-16rem)] items-center justify-between shadow-sm border border-slate-200 bg-white px-6 font-sans">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md">
                            <Menu className="h-6 w-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 border-r shadow-lg">
                        <AdminSidebar className="flex static w-full h-full" />
                    </SheetContent>
                </Sheet>
                <h2 className="text-lg font-semibold text-slate-800 font-heading">Overview</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-[#DC2626] font-bold">
                    A
                </div>
            </div>
        </header>
    );
}
