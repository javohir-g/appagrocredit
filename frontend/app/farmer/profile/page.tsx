"use client";

import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    FileText,
    Settings,
    MessageCircle,
    Video,
    LogOut,
    ChevronRight
} from "lucide-react";

export default function ProfilePage() {
    const user = {
        name: "Иван Петров",
        email: "ivan.petrov@example.com",
        phone: "+998 90 123 45 67",
        region: "Ташкентская область",
        farmSize: 45,
        experience: 12,
        crops: "Пшеница, ячмень, овощи"
    };

    const menuItems = [
        { label: "Личные данные", icon: UserIcon, href: "#" },
        { label: "Данные хозяйства", icon: FileText, href: "#" },
        { label: "Документы", icon: FileText, href: "#" },
        { label: "Настройки", icon: Settings, href: "#" },
    ];

    const supportItems = [
        { label: "Чат с банком", icon: MessageCircle },
        { label: "Видеозвонок", icon: Video },
    ];

    return (
        <div className="p-4 space-y-4">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                        <p className="text-emerald-100 text-sm">Фермер • {user.experience} лет опыта</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-emerald-100 text-xs mb-1">Размер хозяйства</p>
                        <p className="text-lg font-bold">{user.farmSize} га</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-emerald-100 text-xs mb-1">Культуры</p>
                        <p className="text-xs font-medium leading-tight">{user.crops}</p>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                <h2 className="font-bold text-slate-900 mb-3">Контактная информация</h2>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-900">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Телефон</p>
                        <p className="text-sm font-medium text-slate-900">{user.phone}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Регион</p>
                        <p className="text-sm font-medium text-slate-900">{user.region}</p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <h2 className="font-bold text-slate-900 p-4 border-b border-slate-200">Настройки</h2>
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={index}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-slate-400" />
                                <span className="font-medium text-slate-900">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                    );
                })}
            </div>

            {/* Support */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <h2 className="font-bold text-slate-900 p-4 border-b border-slate-200">Поддержка</h2>
                {supportItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={index}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-emerald-600" />
                                <span className="font-medium text-slate-900">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                    );
                })}
            </div>

            {/* Logout */}
            <button
                onClick={() => {
                    localStorage.removeItem('userRole');
                    window.location.href = '/';
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-4 rounded-xl font-medium transition-colors"
            >
                <LogOut className="w-5 h-5" />
                Выйти
            </button>
        </div>
    );
}
