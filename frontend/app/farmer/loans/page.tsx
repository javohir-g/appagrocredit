"use client";

import { useState } from "react";
import {
    DollarSign,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle2,
    ArrowRight,
    Plus
} from "lucide-react";
import Link from "next/link";

export default function LoansPage() {
    const loans = [
        {
            id: 1,
            amount: 50000,
            remaining: 35000,
            rate: 12,
            dueDate: "15 дек 2024",
            status: "active",
            paid: 15000,
            progress: 30,
            nextPayment: 2500,
            history: [
                { date: "15 ноя 2024", amount: 2500, status: "paid" },
                { date: "15 окт 2024", amount: 2500, status: "paid" },
            ]
        },
        {
            id: 2,
            amount: 30000,
            remaining: 5000,
            rate: 10,
            dueDate: "20 дек 2024",
            status: "active",
            paid: 25000,
            progress: 83,
            nextPayment: 1500,
            history: []
        },
    ];

    const getStatusColor = (status: string) => {
        if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (status === "overdue") return "bg-red-50 text-red-700 border-red-200";
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Мои кредиты</h1>
                <p className="text-sm text-slate-500 mt-1">Управление всеми кредитами</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Общий долг</p>
                        <p className="text-3xl font-bold">${loans.reduce((sum, l) => sum + l.remaining, 0).toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-white/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-blue-100 text-xs mb-1">Активных кредитов</p>
                        <p className="text-xl font-bold">{loans.length}</p>
                    </div>
                    <div>
                        <p className="text-blue-100 text-xs mb-1">Выплачено</p>
                        <p className="text-xl font-bold">${loans.reduce((sum, l) => sum + l.paid, 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Loans List */}
            <div className="space-y-3">
                {loans.map((loan) => (
                    <div key={loan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-900">Кредит #{loan.id}</h3>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(loan.status)}`}>
                                    Активный
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">${loan.amount.toLocaleString()}</div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Осталось</p>
                                    <p className="text-lg font-bold text-slate-900">${loan.remaining.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Следующий платёж</p>
                                    <p className="text-lg font-bold text-blue-600">${loan.nextPayment.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-slate-600">Прогресс</span>
                                    <span className="font-semibold text-slate-900">{loan.progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{ width: `${loan.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="w-4 h-4" />
                                Срок: {loan.dueDate}
                                <span className="ml-auto text-xs">Ставка: {loan.rate}%</span>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                    Оплатить
                                </button>
                                <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                    История
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <Link href="/farmer/applications" className="flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200">
                    <span className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Подать новую заявку
                    </span>
                    <ArrowRight className="w-5 h-5" />
                </Link>

                <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3.5 rounded-xl text-sm font-medium transition-colors">
                    <TrendingUp className="w-4 h-4" />
                    Запросить увеличение лимита
                </button>
            </div>
        </div>
    );
}
