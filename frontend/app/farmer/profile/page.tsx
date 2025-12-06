"use client";

import { useEffect, useState } from "react";
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
    ChevronRight,
    CreditCard,
    Loader2
} from "lucide-react";

interface Card {
    id: number;
    card_number: string;
    card_holder: string;
    card_type: string;
    balance: number;
    is_primary: boolean;
}

interface FarmerProfile {
    id: number;
    full_name: string;
    farming_experience: number;
    crop_type: string;
    land_size: number;
    location: string;
    ownership: string;
    soil_type: string;
    income: number;
    expenses: number;
    existing_credit: number;
    cards: Card[];
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<FarmerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app-agrocredit.onrender.com';
            const response = await fetch(`${API_URL}/farmer/profile`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }

            const data = await response.json();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">Ошибка загрузки профиля: {error}</p>
                </div>
            </div>
        );
    }

    const getOwnershipLabel = (ownership: string) => {
        const labels: Record<string, string> = {
            own: "Собственность",
            rent: "Аренда",
            lease: "Лизинг",
            other: "Другое"
        };
        return labels[ownership] || ownership;
    };

    return (
        <div className="p-4 space-y-4">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                        {profile.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-1">{profile.full_name}</h1>
                        <p className="text-emerald-100 text-sm">
                            Фермер • {profile.farming_experience} лет опыта
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-emerald-100 text-xs mb-1">Размер хозяйства</p>
                        <p className="text-lg font-bold">{profile.land_size} га</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-emerald-100 text-xs mb-1">Культуры</p>
                        <p className="text-xs font-medium leading-tight">{profile.crop_type}</p>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                <h2 className="font-bold text-slate-900 mb-3">Контактная информация</h2>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Регион</p>
                        <p className="text-sm font-medium text-slate-900">{profile.location}</p>
                    </div>
                </div>
            </div>

            {/* Farm Details */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                <h2 className="font-bold text-slate-900 mb-3">Данные хозяйства</h2>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Тип владения</p>
                        <p className="text-sm font-medium text-slate-900">
                            {getOwnershipLabel(profile.ownership)}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Тип почвы</p>
                        <p className="text-sm font-medium text-slate-900">{profile.soil_type || "Не указано"}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Доход (мес.)</p>
                        <p className="text-sm font-medium text-slate-900">
                            ${profile.income?.toLocaleString() || "0"}
                        </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Расходы (мес.)</p>
                        <p className="text-sm font-medium text-slate-900">
                            ${profile.expenses?.toLocaleString() || "0"}
                        </p>
                    </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-xs text-emerald-600 mb-1">Текущий кредит</p>
                    <p className="text-lg font-bold text-emerald-700">
                        ${profile.existing_credit.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* My Cards */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h2 className="font-bold text-slate-900 mb-3">Мои карты</h2>

                {profile.cards.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                        Нет привязанных карт
                    </p>
                ) : (
                    <div className="space-y-3">
                        {profile.cards.map((card) => (
                            <div
                                key={card.id}
                                className="p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl text-white relative overflow-hidden"
                            >
                                {card.is_primary && (
                                    <div className="absolute top-2 right-2">
                                        <span className="text-xs bg-emerald-500 px-2 py-1 rounded-full font-medium">
                                            Основная
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-4">
                                    <CreditCard className="w-8 h-8 text-white/60" />
                                    <span className="text-xs text-white/80 uppercase font-medium">
                                        {card.card_type}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <p className="text-lg font-mono tracking-wider">
                                        {card.card_number}
                                    </p>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-white/60 mb-1">Держатель карты</p>
                                        <p className="text-sm font-medium">{card.card_holder}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-white/60 mb-1">Баланс</p>
                                        <p className="text-lg font-bold">
                                            ${card.balance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                    localStorage.removeItem('token');
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

