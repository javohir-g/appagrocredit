"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    ArrowUpDown,
    Eye,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    RefreshCw,
    Loader2
} from "lucide-react";
import { bankService } from "@/services/bank-service";
import type { ApplicationSummary } from "@/services/bank-service";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<ApplicationSummary[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<ApplicationSummary[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [riskFilter, setRiskFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchApplications();

        // Auto-refresh каждые 30 секунд
        const interval = setInterval(() => {
            fetchApplications(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        filterApplications();
    }, [statusFilter, riskFilter, searchQuery, applications]);

    const fetchApplications = async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);

        try {
            const data = await bankService.getAllApplications(
                statusFilter !== "all" ? statusFilter : undefined
            );
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filterApplications = () => {
        let filtered = [...applications];

        if (statusFilter !== "all") {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        if (riskFilter !== "all") {
            filtered = filtered.filter(app => app.risk_category?.toLowerCase() === riskFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(app =>
                app.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.farmer_id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredApplications(filtered);
    };

    const getRiskColor = (category: string | null) => {
        if (!category) return "text-slate-600 bg-slate-50";

        switch (category.toLowerCase()) {
            case "low": return "text-emerald-600 bg-emerald-50";
            case "medium": return "text-amber-600 bg-amber-50";
            case "high": return "text-red-600 bg-red-50";
            default: return "text-slate-600 bg-slate-50";
        }
    };

    const getRiskLabel = (category: string | null) => {
        if (!category) return "Не оценено";

        switch (category.toLowerCase()) {
            case "low": return "Низкий";
            case "medium": return "Средний";
            case "high": return "Высокий";
            default: return category;
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
            case "in_review":
                return <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full"><AlertCircle className="w-3 h-3" />Доп. проверка</span>;
            default:
                return <span className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-full">{status}</span>;
        }
    };

    if (loading) {
        return (
            <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="inline-block animate-spin h-12 w-12 text-emerald-600" />
                    <p className="mt-4 text-slate-600">Загрузка заявок...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Заявки</h1>
                    <p className="text-sm text-slate-500 mt-1">Управление кредитными заявками фермеров</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500">
                        Всего: <span className="font-semibold text-slate-900">{filteredApplications.length}</span> заявок
                    </div>
                    <button
                        onClick={() => fetchApplications()}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-medium">Обновить</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Поиск по имени или ID фермера..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 border-none rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none"
                    >
                        <option value="all">Все статусы</option>
                        <option value="pending">На проверке</option>
                        <option value="approved">Одобрено</option>
                        <option value="rejected">Отклонено</option>
                        <option value="in_review">Доп. проверка</option>
                    </select>

                    {/* Risk Filter */}
                    <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="bg-slate-50 border-none rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none"
                    >
                        <option value="all">Все риски</option>
                        <option value="low">Низкий</option>
                        <option value="medium">Средний</option>
                        <option value="high">Высокий</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Фермер</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Сумма</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Цель</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">AI-скоринг</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                                                {app.farmer_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{app.farmer_name}</div>
                                                <div className="text-xs text-slate-500">{app.farmer_id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900">${app.loan_amount.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500">{app.loan_term_months} мес</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{app.purpose}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(app.date_submitted).toLocaleDateString('ru-RU')}</td>
                                    <td className="px-6 py-4">
                                        {app.ai_score !== null ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-slate-900">{app.ai_score}/100</span>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${getRiskColor(app.risk_category)}`}>
                                                    {getRiskLabel(app.risk_category)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">Не рассчитан</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(app.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/bank/applications/view?id=${app.id}`}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Открыть
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredApplications.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">Заявки не найдены</p>
                    </div>
                )}
            </div>
        </main>
    );
}

