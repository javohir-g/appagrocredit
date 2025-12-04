"use client";

import { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    FileText,
    BarChart3,
    PieChart,
    Activity
} from "lucide-react";

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("30d");

    const stats = {
        totalRevenue: 2450000,
        revenueChange: 12.5,
        totalApplications: 156,
        applicationsChange: 8.3,
        approvalRate: 75.6,
        approvalChange: 3.2,
        avgLoanSize: 52500,
        loanSizeChange: -2.1,
    };

    const loansByRegion = [
        { region: "Ташкентская обл.", count: 45, amount: 825000, percentage: 33.7 },
        { region: "Самаркандская обл.", count: 32, amount: 640000, percentage: 26.1 },
        { region: "Бухарская обл.", count: 28, amount: 490000, percentage: 20.0 },
        { region: "Андижанская обл.", count: 21, amount: 315000, percentage: 12.9 },
        { region: "Ферганская обл.", count: 18, amount: 180000, percentage: 7.3 },
    ];

    const loansByCrop = [
        { crop: "Пшеница", count: 48, percentage: 30.8 },
        { crop: "Хлопок", count: 42, percentage: 26.9 },
        { crop: "Рис", count: 28, percentage: 17.9 },
        { crop: "Овощи", count: 22, percentage: 14.1 },
        { crop: "Фрукты", count: 16, percentage: 10.3 },
    ];

    const monthlyData = [
        { month: "Янв", applications: 18, approved: 14, rejected: 4 },
        { month: "Фев", applications: 22, approved: 16, rejected: 6 },
        { month: "Мар", applications: 25, approved: 19, rejected: 6 },
        { month: "Апр", applications: 28, approved: 21, rejected: 7 },
        { month: "Май", applications: 31, approved: 24, rejected: 7 },
        { month: "Июн", applications: 32, approved: 24, rejected: 8 },
    ];

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Аналитика</h1>
                    <p className="text-sm text-slate-500 mt-1">Детальная статистика и тренды</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                >
                    <option value="7d">Последние 7 дней</option>
                    <option value="30d">Последние 30 дней</option>
                    <option value="90d">Последние 90 дней</option>
                    <option value="1y">Последний год</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-emerald-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-medium ${stats.revenueChange > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {stats.revenueChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(stats.revenueChange)}%
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Общая выдача</p>
                    <p className="text-3xl font-bold text-slate-900">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-slate-400 mt-2">Всего выдано кредитов</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-medium ${stats.applicationsChange > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {stats.applicationsChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(stats.applicationsChange)}%
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Всего заявок</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalApplications}</p>
                    <p className="text-xs text-slate-400 mt-2">За выбранный период</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-purple-50 rounded-lg">
                            <Activity className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-medium ${stats.approvalChange > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {stats.approvalChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(stats.approvalChange)}%
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Процент одобрения</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.approvalRate}%</p>
                    <p className="text-xs text-slate-400 mt-2">Одобренные заявки</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-medium ${stats.loanSizeChange > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {stats.loanSizeChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(stats.loanSizeChange)}%
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Средний кредит</p>
                    <p className="text-3xl font-bold text-slate-900">${(stats.avgLoanSize / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-400 mt-2">На одну заявку</p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trend */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">Динамика заявок</h2>
                        <PieChart className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="space-y-4">
                        {monthlyData.map((data, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-600">{data.month}</span>
                                    <span className="text-sm font-semibold text-slate-900">{data.applications} заявок</span>
                                </div>
                                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
                                    <div
                                        className="bg-emerald-500"
                                        style={{ width: `${(data.approved / data.applications) * 100}%` }}
                                    />
                                    <div
                                        className="bg-red-500"
                                        style={{ width: `${(data.rejected / data.applications) * 100}%` }}
                                    />
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs text-emerald-600">✓ {data.approved} одобрено</span>
                                    <span className="text-xs text-red-600">✗ {data.rejected} отклонено</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Loans by Region */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">Кредиты по регионам</h2>
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="space-y-4">
                        {loansByRegion.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-600">{item.region}</span>
                                    <span className="text-sm font-semibold text-slate-900">${(item.amount / 1000).toFixed(0)}K</span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden bg-slate-100">
                                    <div
                                        className="bg-emerald-500 h-full"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-500">{item.count} кредитов</span>
                                    <span className="text-xs text-slate-500">{item.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loans by Crop Type */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">Распределение по культурам</h2>
                    <PieChart className="w-5 h-5 text-slate-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {loansByCrop.map((item, index) => (
                        <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
                            <div className="text-3xl font-bold text-slate-900 mb-1">{item.count}</div>
                            <div className="text-sm font-medium text-slate-600 mb-2">{item.crop}</div>
                            <div className="text-xs text-slate-500">{item.percentage}% всех кредитов</div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
