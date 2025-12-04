"use client";

import { useState } from "react";
import {
    DollarSign,
    FileText,
    Camera,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Send
} from "lucide-react";

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<"new" | "status">("new");

    const [formData, setFormData] = useState({
        amount: "",
        purpose: "",
        term_months: ""  // Срок кредита в месяцах
    });

    const applications = [
        {
            id: 1,
            amount: 50000,
            purpose: "Покупка семян и удобрений",
            date: "2024-12-01",
            status: "pending",
            statusText: "На рассмотрении"
        },
        {
            id: 2,
            amount: 30000,
            purpose: "Покупка техники",
            date: "2024-11-28",
            status: "approved",
            statusText: "Одобрено"
        },
        {
            id: 3,
            amount: 25000,
            purpose: "Покупка оборудования",
            date: "2024-11-20",
            status: "documents",
            statusText: "Требуются документы"
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Заявка отправлена на рассмотрение!");
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "pending":
                return { icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200" };
            case "approved":
                return { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
            case "rejected":
                return { icon: XCircle, color: "bg-red-50 text-red-700 border-red-200" };
            case "documents":
                return { icon: AlertCircle, color: "bg-blue-50 text-blue-700 border-blue-200" };
            default:
                return { icon: Clock, color: "bg-slate-50 text-slate-700 border-slate-200" };
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Заявки на кредит</h1>
                <p className="text-sm text-slate-500 mt-1">Подача и отслеживание заявок</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1 flex gap-1">
                <button
                    onClick={() => setActiveTab("new")}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === "new"
                        ? "bg-emerald-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    Новая заявка
                </button>
                <button
                    onClick={() => setActiveTab("status")}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === "status"
                        ? "bg-emerald-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    Мои заявки ({applications.length})
                </button>
            </div>

            {/* New Application Form */}
            {activeTab === "new" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Сумма кредита ($)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="50000"
                                    className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Цель кредита
                            </label>
                            <select
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                                required
                            >
                                <option value="">Выберите цель</option>
                                <option>Покупка семян</option>
                                <option>Покупка удобрений</option>
                                <option>Покупка техники</option>
                                <option>Расширение поля</option>
                                <option>Орошение</option>
                                <option>Другое</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Срок кредита (месяцев)
                            </label>
                            <select
                                value={formData.term_months}
                                onChange={(e) => setFormData({ ...formData, term_months: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                                required
                            >
                                <option value="">Выберите срок</option>
                                <option value="6">6 месяцев</option>
                                <option value="12">12 месяцев</option>
                                <option value="18">18 месяцев</option>
                                <option value="24">24 месяца</option>
                                <option value="36">36 месяцев</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200"
                    >
                        <Send className="w-5 h-5" />
                        Отправить заявку
                    </button>
                </form>
            )}

            {/* Application Status */}
            {activeTab === "status" && (
                <div className="space-y-3">
                    {applications.map((app) => {
                        const statusConfig = getStatusConfig(app.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">Заявка #{app.id}</h3>
                                        <p className="text-sm text-slate-600">{app.purpose}</p>
                                    </div>
                                    <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${statusConfig.color}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {app.statusText}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Сумма</p>
                                        <p className="text-lg font-bold text-slate-900">${app.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Дата подачи</p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {new Date(app.date).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
