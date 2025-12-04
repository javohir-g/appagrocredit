"use client";

import { useState } from "react";
import {
    DollarSign,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";

export default function LoansPage() {
    const [activeTab, setActiveTab] = useState("all");

    const stats = {
        active: 45,
        overdue: 3,
        closed: 120,
        total: 168,
        totalAmount: 2450000,
        overdueAmount: 75000,
        avgTerm: 18
    };

    const loans = [
        { id: 1, farmer: "Иван Петров", amount: 50000, status: "active", dueDate: "2025-06-15", remaining: 35000 },
        { id: 2, farmer: "Мария Сидорова", amount: 75000, status: "overdue", dueDate: "2024-12-01", remaining: 25000 },
        { id: 3, farmer: "Алексей Козлов", amount: 30000, status: "active", dueDate: "2025-03-20", remaining: 15000 },
        { id: 4, farmer: "Ольга Новикова", amount: 60000, status: "closed", dueDate: "2024-11-30", remaining: 0 },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" />Активный</span>;
            case "overdue":
                return <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full"><AlertCircle className="w-3 h-3" />Просрочен</span>;
            case "closed":
                return <span className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" />Закрыт</span>;
            default:
                return null;
        }
    };

    const filteredLoans = activeTab === "all" ? loans : loans.filter(l => l.status === activeTab);

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Кредиты</h1>
                <p className="text-sm text-slate-500 mt-1">Управление кредитным портфелем</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm text-slate-500">Всего кредитов</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                    <p className="text-xs text-slate-400 mt-1">${(stats.totalAmount / 1000).toFixed(0)}K выдано</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm text-slate-500">Активные</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-slate-500">Просроченные</p>
                    </div>
                    <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                    <p className="text-xs text-red-500 mt-1">${(stats.overdueAmount / 1000).toFixed(0)}K долга</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-slate-600" />
                        <p className="text-sm text-slate-500">Закрытые</p>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.closed}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 px-4 flex gap-2">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "all" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-600 hover:text-slate-900"}`}
                    >
                        Все ({stats.total})
                    </button>
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "active" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-600 hover:text-slate-900"}`}
                    >
                        Активные ({stats.active})
                    </button>
                    <button
                        onClick={() => setActiveTab("overdue")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "overdue" ? "border-red-600 text-red-600" : "border-transparent text-slate-600 hover:text-slate-900"}`}
                    >
                        Просроченные ({stats.overdue})
                    </button>
                    <button
                        onClick={() => setActiveTab("closed")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "closed" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-600 hover:text-slate-900"}`}
                    >
                        Закрытые ({stats.closed})
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Фермер</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Сумма</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Осталось</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Срок</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLoans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{loan.farmer}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">${loan.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">${loan.remaining.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(loan.dueDate).toLocaleDateString('ru-RU')}</td>
                                    <td className="px-6 py-4">{getStatusBadge(loan.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
