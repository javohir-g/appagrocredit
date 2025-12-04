"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CreditCard,
    Send,
    FileText,
    TrendingUp,
    Droplets,
    Sun,
    AlertCircle,
    ArrowRight,
    Calendar,
    Sprout,
    MessageCircle
} from "lucide-react";

export default function FarmerHome() {
    const farmerName = "Иван";

    const currentLoan = {
        nextPayment: 2500,
        nextPaymentDate: "15 декабря 2024",
        totalAmount: 50000,
        paid: 15000,
        remaining: 35000,
        progress: 30,
    };

    const aiRecommendation = {
        type: "irrigation",
        title: "Рекомендация по поливу",
        message: "На основе прогноза погоды, рекомендуем полив через 2 дня. Ожидается сухая погода в течение недели.",
        icon: Droplets,
        color: "blue",
    };

    const quickStats = [
        { label: "Активных полей", value: "3", icon: "🌾" },
        { label: "Здоровье", value: "Хорошее", icon: "✅" },
        { label: "Прогноз", value: "+12%", icon: "📈" },
    ];

    return (
        <div className="p-4 space-y-4">
            {/* Greeting Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-1">Ассалому алейкум, {farmerName}! 👋</h1>
                <p className="text-emerald-100 text-sm">Добро пожаловать в вашу агропанель</p>

                <div className="grid grid-cols-3 gap-3 mt-4">
                    {quickStats.map((stat, index) => (
                        <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <div className="text-lg font-bold">{stat.value}</div>
                            <div className="text-xs text-emerald-100">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Loan Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-slate-900">Текущий кредит</h2>
                        <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-900 mb-1">${currentLoan.nextPayment}</div>
                    <div className="flex items-center gap-1 text-sm text-blue-700">
                        <Calendar className="w-4 h-4" />
                        Следующий платёж: {currentLoan.nextPaymentDate}
                    </div>
                </div>

                <div className="p-4">
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">Прогресс погашения</span>
                            <span className="font-semibold text-slate-900">{currentLoan.progress}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                                style={{ width: `${currentLoan.progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>Выплачено: ${currentLoan.paid.toLocaleString()}</span>
                            <span>Осталось: ${currentLoan.remaining.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-2">
                        <button className="flex flex-col items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl p-4 transition-colors">
                            <CreditCard className="w-6 h-6" />
                            <span className="text-xs font-medium">Оплатить</span>
                        </button>
                        <Link href="/farmer/loans" className="flex flex-col items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl p-4 transition-colors">
                            <FileText className="w-6 h-6" />
                            <span className="text-xs font-medium">Детали</span>
                        </Link>
                        <Link href="/farmer/fields" className="flex flex-col items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl p-4 transition-colors">
                            <Send className="w-6 h-6" />
                            <span className="text-xs font-medium">Отчёт</span>
                        </Link>
                    </div>
                </div>
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
