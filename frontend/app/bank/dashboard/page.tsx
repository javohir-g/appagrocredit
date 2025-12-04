"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";
import {
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    DollarSign,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react";

interface DashboardStats {
    newApplications: number;
    approved: number;
    rejected: number;
    pending: number;
    averageScore: number;
    totalLoans: number;
    overduePayments: number;
    overduePercentage: number;
}

interface RecentApplication {
    id: number;
    farmerName: string;
    amount: number;
    riskScore: number;
    riskCategory: string;
    status: string;
    date: string;
}

export default function BankDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        newApplications: 12,
        approved: 8,
        rejected: 2,
        pending: 15,
        averageScore: 72.5,
        totalLoans: 450000,
        overduePayments: 15000,
        overduePercentage: 3.3
    });
    const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch real dashboard stats from API
            const response = await fetch("http://localhost:8000/bank/dashboard/stats", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats({
                    newApplications: 0, // Not available from API yet
                    approved: 0, // Not available from API yet
                    rejected: 0, // Not available from API yet
                    pending: data.active_credits,
                    averageScore: 75, // Can be calculated from data later
                    totalLoans: data.total_amount_disbursed,
                    overduePayments: Math.max(0, data.total_outstanding * 0.05), //  Estimate
                    overduePercentage: data.overdue_credits > 0 ? parseFloat(((data.overdue_credits / data.total_credits) * 100).toFixed(1)) : 0
                });
            }

            // Mock recent applications - will be replaced when applications API is ready
            setRecentApplications([
                { id: 1, farmerName: "Иван Петров", amount: 50000, riskScore: 85, riskCategory: "Low", status: "pending", date: "2024-12-03" },
                { id: 2, farmerName: "Мария Сидорова", amount: 75000, riskScore: 68, riskCategory: "Medium", status: "pending", date: "2024-12-03" },
                { id: 3, farmerName: "Алексей Козлов", amount: 30000, riskScore: 45, riskCategory: "High", status: "pending", date: "2024-12-02" },
            ]);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            //  Fallback to mock data on error
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "low": return "text-emerald-600 bg-emerald-50";
            case "medium": return "text-amber-600 bg-amber-50";
            case "high": return "text-red-600 bg-red-50";
            default: return "text-slate-600 bg-slate-50";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" />На проверке</span>;
            case "approved":
                return <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" />Одобрено</span>;
            case "rejected":
                return <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3" />Отклонено</span>;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <p className="mt-4 text-slate-600">Загрузка данных...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Обзор ключевых показателей и активности</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* New Applications */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <TrendingUp className="w-3 h-3" />
                            +12%
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Новые заявки</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.newApplications}</p>
                    <p className="text-xs text-slate-400 mt-2">Сегодня</p>
                </div>

                {/* Approved/Rejected */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-emerald-50 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="p-2.5 bg-red-50 rounded-lg ml-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Одобрено / Отклонено</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.approved} <span className="text-lg text-slate-400">/</span> <span className="text-xl font-semibold text-red-600">{stats.rejected}</span></p>
                    <p className="text-xs text-slate-400 mt-2">За сегодня</p>
                </div>

                {/* Average Risk Score */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-purple-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <TrendingUp className="w-3 h-3" />
                            +5.2
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Средний скоринг</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.averageScore}<span className="text-lg text-slate-400">/100</span></p>
                    <p className="text-xs text-slate-400 mt-2">Все активные</p>
                </div>

                {/* Total Loans */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                            <TrendingDown className="w-3 h-3" />
                            {stats.overduePercentage}%
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Выдано кредитов</p>
                    <p className="text-3xl font-bold text-slate-900">${(stats.totalLoans / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-red-500 mt-2">Просрочка: ${(stats.overduePayments / 1000).toFixed(0)}K</p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Applications */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Последние заявки</h2>
                            <p className="text-sm text-slate-500 mt-0.5">Требуют вашего внимания</p>
                        </div>
                        <Link href="/bank/applications" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                            Все заявки <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentApplications.map((app) => (
                            <Link key={app.id} href={`/bank/applications/view?id=${app.id}`} className="p-6 hover:bg-slate-50 transition-colors block">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                                            {app.farmerName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{app.farmerName}</p>
                                            <p className="text-sm text-slate-500">{new Date(app.date).toLocaleDateString('ru-RU')}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(app.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500">Сумма</p>
                                            <p className="text-sm font-semibold text-slate-900">${app.amount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">AI-скоринг</p>
                                            <p className={`text-sm font-semibold ${getRiskColor(app.riskCategory)}`}>{app.riskScore}/100</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getRiskColor(app.riskCategory)}`}>
                                        {app.riskCategory === "Low" ? "Низкий риск" : app.riskCategory === "Medium" ? "Средний риск" : "Высокий риск"}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Быстрые действия</h2>
                        <div className="space-y-3">
                            <Link href="/bank/applications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                    <FileText className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">Новые заявки</p>
                                    <p className="text-xs text-slate-500">{stats.pending} ожидают</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                            </Link>
                            <Link href="/bank/farmers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">Фермеры</p>
                                    <p className="text-xs text-slate-500">Просмотр каталога</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                            </Link>
                            <Link href="/bank/loans" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                                    <DollarSign className="w-4 h-4 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">Кредиты</p>
                                    <p className="text-xs text-slate-500">Управление портфелем</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                            </Link>
                        </div>
                    </div>

                    {/* Pending Count */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-8 h-8 opacity-80" />
                            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Приоритет</span>
                        </div>
                        <p className="text-3xl font-bold mb-1">{stats.pending}</p>
                        <p className="text-sm opacity-90">Заявок на проверке</p>
                        <Link href="/bank/applications" className="mt-4 inline-block text-sm font-medium underline hover:no-underline">
                            Начать проверку →
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
