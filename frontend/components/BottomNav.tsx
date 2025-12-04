"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    DollarSign,
    Sprout,
    MessageCircle,
    User
} from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Главная", href: "/farmer/home", icon: Home },
        { name: "Кредиты", href: "/farmer/loans", icon: DollarSign },
        { name: "Поля", href: "/farmer/fields", icon: Sprout },
        { name: "AI Чат", href: "/farmer/chat", icon: MessageCircle },
        { name: "Профиль", href: "/farmer/profile", icon: User },
    ];

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px] ${active
                                    ? "text-emerald-600"
                                    : "text-slate-500"
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${active ? "text-emerald-600" : "text-slate-400"}`} />
                            <span className={`text-xs font-medium ${active ? "text-emerald-600" : "text-slate-600"}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
