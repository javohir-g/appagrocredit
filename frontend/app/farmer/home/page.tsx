"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CreditCard,
    FileText,
    TrendingUp,
    Droplets,
    AlertCircle,
    ArrowRight,
    Sprout,
    MessageCircle,
    Zap,
    Flame
} from "lucide-react";

export default function FarmerHome() {
    interface FarmerSummary {
        total_debt: number;
        active_credits: number;
        total_paid: number;
        credit_score: number;
    }

    const [summary, setSummary] = useState<FarmerSummary>({
        total_debt: 0,
        active_credits: 0,
        total_paid: 0,
        credit_score: 0
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app-agrocredit.onrender.com';
                const token = localStorage.getItem('token');

                if (!token) return;

                const response = await fetch(`${API_URL}/api/farmer/summary`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSummary(data);
                }
            } catch (error) {
                console.error("Failed to fetch summary:", error);
            }
        };

        fetchSummary();
    }, []);

    // Helper to format currency
    const formatMoney = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    };

    return (
        <div className="p-4 space-y-4">
            {/* Total Credits Summary */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Общий долг</p>
                        <p className="text-3xl font-bold">{formatMoney(summary.total_debt)}</p>
                    </div>
                    <CreditCard className="w-12 h-12 text-white/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-blue-100 text-xs mb-1">Активных кредитов</p>
                        <p className="text-xl font-bold">{summary.active_credits}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-xs mb-1">Кредитный рейтинг</p>
                        <p className="text-xl font-bold">{summary.credit_score}</p>
                    </div>
                </div>
                <Link href="/farmer/loans" className="mt-4 inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full">
                    Управление кредитами <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* AI Recommendation of the Day */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Droplets className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">AI РЕКОМЕНДАЦИЯ</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{aiRecommendation.title}</h3>
                        <p className="text-sm text-white/90 leading-relaxed">{aiRecommendation.message}</p>
                    </div>
                </div>
                <Link href="/farmer/chat" className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors mt-2">
                    Спросить AI <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Utility Meters */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Счётчики хозяйства</h2>
                    <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                        Внести показания
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Electricity */}
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Zap className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-amber-700 font-medium mb-0.5">Электроэнергия</p>
                            <p className="text-lg font-bold text-slate-900">12,450 кВт·ч</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">За месяц</p>
                            <p className="text-sm font-semibold text-slate-900">+340 кВт·ч</p>
                        </div>
                    </div>

                    {/* Gas */}
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Flame className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-orange-700 font-medium mb-0.5">Газ</p>
                            <p className="text-lg font-bold text-slate-900">8,230 м³</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">За месяц</p>
                            <p className="text-sm font-semibold text-slate-900">+180 м³</p>
                        </div>
                    </div>

                    {/* Water */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Droplets className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-blue-700 font-medium mb-0.5">Вода</p>
                            <p className="text-lg font-bold text-slate-900">3,560 м³</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500">За месяц</p>
                            <p className="text-sm font-semibold text-slate-900">+95 м³</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
                <Link href="/farmer/fields" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Sprout className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Мои поля</h3>
                    </div>
                    <p className="text-xs text-slate-500">Состояние и рекомендации</p>
                </Link>

                <Link href="/farmer/applications" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Заявки</h3>
                    </div>
                    <p className="text-xs text-slate-500">Подать новую заявку</p>
                </Link>

                <Link href="/farmer/notifications" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Уведомления</h3>
                    </div>
                    <p className="text-xs text-slate-500">3 новых сообщения</p>
                </Link>

                <Link href="/farmer/chat" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">AI Помощник</h3>
                    </div>
                    <p className="text-xs text-slate-500">Задайте вопрос</p>
                </Link>
            </div>
        </div>
    );
}
