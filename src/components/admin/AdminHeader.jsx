export function AdminHeader() {
    return (
        <header className="fixed right-0 top-0 z-30 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b bg-white px-6 font-sans">
            <div>
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
