"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Users,
    Sprout,
    ShieldAlert,
    BarChart3,
    Settings,
    LogOut
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const menuItems = [
        { name: "Dashboard", href: "/bank/dashboard", icon: LayoutGrid },
        { name: "Farmers", href: "/bank/farmers", icon: Users },
        { name: "Field Analysis", href: "/bank/analysis", icon: Sprout },
        { name: "Risk Scoring", href: "/bank/risk", icon: ShieldAlert },
        { name: "Analytics", href: "/bank/analytics", icon: BarChart3 },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen z-20 shadow-sm">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-emerald-200 shadow-lg">
                        <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight">AgroCredit <span className="text-emerald-600">AI</span></span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-2">Main Menu</div>

                {menuItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${active
                                    ? "text-emerald-700 bg-emerald-50 shadow-sm ring-1 ring-emerald-100"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <Icon className={`w-4 h-4 transition-colors ${active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                                }`} />
                            {item.name}
                        </Link>
                    );
                })}

                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-8">System</div>

                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors group">
                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    Settings
                </Link>
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                        BO
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">Bank Officer</p>
                        <p className="text-xs text-slate-500 truncate">officer@bank.com</p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('userRole');
                            window.location.href = '/';
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
