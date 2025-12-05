"use client";

import { useState, useEffect } from "react";
import {
    DollarSign,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Send,
    Loader2
} from "lucide-react";
import { loanService } from "@/services/loan-service";
import type { LoanApplication } from "@/services/loan-service";

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<"new" | "status">("new");
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState({
        amount: "",
        purpose: "",
        term_months: "",
        expected_cash_flow: ""
    });

    // Загрузка заявок
    useEffect(() => {
        if (activeTab === "status") {
            fetchApplications();
        }
    }, [activeTab]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await loanService.getMyApplications();
            setApplications(data);
        } catch (error) {
            showToast("Ошибка загрузки заявок", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await loanService.submitApplication({
                requested_loan_amount: parseFloat(formData.amount),
                loan_term_months: parseInt(formData.term_months),
                loan_purpose: formData.purpose,
                expected_cash_flow_after_loan: formData.expected_cash_flow
                    ? parseFloat(formData.expected_cash_flow)
                    : undefined
            });

            showToast("Заявка успешно отправлена!", "success");

            // Очистка формы
            setFormData({
                amount: "",
                purpose: "",
                term_months: "",
                expected_cash_flow: ""
            });

            // Переключение на вкладку со статусом
            setTimeout(() => {
                setActiveTab("status");
            }, 1500);

        } catch (error) {
            showToast(error instanceof Error ? error.message : "Ошибка отправки заявки", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "pending":
                return { icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200", text: "На рассмотрении" };
            case "approved":
                return { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "Одобрено" };
            case "rejected":
                return { icon: XCircle, color: "bg-red-50 text-red-700 border-red-200", text: "Отклонено" };
            case "in_review":
                return { icon: AlertCircle, color: "bg-blue-50 text-blue-700 border-blue-200", text: "Доп. проверка" };
            default:
                return { icon: Clock, color: "bg-slate-50 text-slate-700 border-slate-200", text: status };
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    } text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right flex items-center gap-3`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}

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
                                Сумма кредита ($) *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="100000"
                                    min="1000"
                                    step="1000"
                                    className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Цель кредита *
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
                                Срок кредита *
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
                                <option value="48">48 месяцев</option>
                                <option value="60">60 месяцев</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Ожидаемый годовой доход ($)
                            </label>
                            <input
                                type="number"
                                value={formData.expected_cash_flow}
                                onChange={(e) => setFormData({ ...formData, expected_cash_flow: e.target.value })}
                                placeholder="180000"
                                min="0"
                                step="1000"
                                className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-1">Опционально, но помогает в оценке</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white px-5 py-4 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200 disabled:shadow-none"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Отправка...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Отправить заявку
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Application Status */}
            {activeTab === "status" && (
                <div className="space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                            <p className="text-slate-500">Заявок пока нет</p>
                            <button
                                onClick={() => setActiveTab("new")}
                                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Подать первую заявку
                            </button>
                        </div>
                    ) : (
                        applications.map((app) => {
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
                                            {statusConfig.text}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Сумма</p>
                                            <p className="text-lg font-bold text-slate-900">${app.loan_amount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Срок</p>
                                            <p className="text-sm font-medium text-slate-900">{app.loan_term_months} мес</p>
                                        </div>
                                    </div>

                                    {app.ai_score !== null && (
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-slate-500">AI Скоринг</span>
                                                <span className="text-lg font-bold text-emerald-600">{app.ai_score}/100</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div
                                                    className="bg-emerald-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${app.ai_score}%` }}
                                                />
                                            </div>
                                            {app.interest_rate && (
                                                <div className="mt-2 flex items-center justify-between text-sm">
                                                    <span className="text-slate-600">Ставка:</span>
                                                    <span className="font-semibold">{(app.interest_rate * 100).toFixed(1)}%</span>
                                                </div>
                                            )}
                                            {app.monthly_payment && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600">Ежемесячный платеж:</span>
                                                    <span className="font-semibold">${app.monthly_payment.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
