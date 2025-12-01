"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function BankLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Header />
                {children}
            </div>
        </div>
    );
}
