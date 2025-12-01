"use client";

import FarmerSidebar from "@/components/FarmerSidebar";
import Header from "@/components/Header";

export default function FarmerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <FarmerSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Header />
                {children}
            </div>
        </div>
    );
}
