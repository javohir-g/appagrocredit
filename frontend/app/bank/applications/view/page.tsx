"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calculator,
    CheckCircle2,
    XCircle,
    Loader2,
    User,
    DollarSign,
    Calendar,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { bankService } from "@/services/bank-service";
import type { ApplicationDetail, ScoringDetail } from "@/services/bank-service";

export default function ApplicationDetailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const applicationId = searchParams.get('id');

    const [application, setApplication] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (applicationId) {
            fetchApplicationDetail();
        }
    }, [applicationId]);

    const fetchApplicationDetail = async () => {
        if (!applicationId) return;

        setLoading(true);
        try {
            const data = await bankService.getApplicationDetail(parseInt(applicationId));
            setApplication(data);
        } catch (error) {
            showToast("Ошибка загрузки данных", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateScoring = async () => {
        if (!applicationId) return;

        setCalculating(true);
        try {
            const scoring = await bankService.calculateScoring(parseInt(applicationId));

            // Обновляем application с новым скорингом
            setApplication(prev => prev ? { ...prev, scoring } : null);

            showToast("Скоринг успешно рассчитан!", "success");
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Ошибка расчета скоринга", "error");
        } finally {
            setCalculating(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!applicationId) return;

        setUpdating(true);
        try {
            await bankService.updateStatus(parseInt(applicationId), newStatus);

            // Обновляем локальный статус
            setApplication(prev => prev ? { ...prev, status: newStatus } : null);

            showToast(`Статус изменен на "${getStatusText(newStatus)}"`, "success");
        } catch (error) {
            showToast("Ошибка обновления статуса", "error");
        } finally {
            setUpdating(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "approved": return "Одобрено";
            case "rejected": return "Отклонено";
            case "in_review": return "На доп. проверке";
            default: return status;
        }
    };

    const getRiskColor = (score: number) => {
        if (score >= 70) return "text-emerald-600 bg-emerald-50";
        if (score >= 50) return "text-amber-600 bg-amber-50";
        return "text-red-600 bg-red-50";
    };

    if (loading) {
        return (
            <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </main>
        );
    }

    if (!application) {
        return (
            <main className="flex-1 overflow-y-auto p-6">
                <div className="text-center py-12">
                    <p className="text-slate-500">Заявка не найдена</p>
                    <button
                        onClick={() => router.push('/bank/applications')}
                        className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Вернуться к списку
                    </button>
                </div>
            </main>
        );
    }

    const scoring = application.scoring;

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    } text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right flex items-center gap-3`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/bank/applications')}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Заявка #{application.id}</h1>
                        <p className="text-sm text-slate-500 mt-1">Детальная информация и управление</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {application.status === "pending" && (
                        <>
                            <button
                                onClick={() => handleUpdateStatus("approved")}
                                disabled={updating}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Одобрить
                            </button>
                            <button
                                onClick={() => handleUpdateStatus("rejected")}
                                disabled={updating}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                                Отклонить
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Application Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Loan Details */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Детали кредита</h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Сумма кредита</p>
                                <p className="text-2xl font-bold text-slate-900">${application.loan_amount.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Срок</p>
                                <p className="text-xl font-semibold text-slate-900">{application.loan_term_months} месяцев</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Цель кредита</p>
                                <p className="text-base font-medium text-slate-900">{application.purpose}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Дата подачи</p>
                                <p className="text-base font-medium text-slate-900">
                                    {new Date(application.date_submitted).toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                        </div>

                        {application.expected_cash_flow && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500 mb-1">Ожидаемый годовой доход</p>
                                <p className="text-lg font-semibold text-emerald-600">
                                    ${application.expected_cash_flow.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Scoring Results */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">AI Скоринг</h2>

                            {!scoring && (
                                <button
                                    onClick={handleCalculateScoring}
                                    disabled={calculating}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
                                >
                                    {calculating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Расчет...
                                        </>
                                    ) : (
                                        <>
                                            <Calculator className="w-4 h-4" />
                                            Рассчитать скоринг
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {scoring ? (
                            <div className="space-y-6">
                                {/* Total Score */}
                                <div className="text-center p-6 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-500 mb-2">Итоговый балл</p>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="text-5xl font-bold text-emerald-600">
                                            {scoring.total_score}
                                        </div>
                                        <div className="text-2xl text-slate-400">/100</div>
                                    </div>
                                    <div className="mt-4 w-full bg-slate-200 rounded-full h-3">
                                        <div
                                            className="bg-emerald-500 h-3 rounded-full transition-all"
                                            style={{ width: `${scoring.total_score}%` }}
                                        />
                                    </div>
                                    <span className={`inline-block mt-3 text-sm font-medium px-3 py-1 rounded-full ${getRiskColor(scoring.total_score)}`}>
                                        {scoring.total_score >= 70 ? "Низкий риск" : scoring.total_score >= 50 ? "Средний риск" : "Высокий риск"}
                                    </span>
                                </div>

                                {/* Component Scores */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-700">Детализация баллов</h3>
                                    {[
                                        { label: 'Земля', value: scoring.land_score, max: 25 },
                                        { label: 'Техника', value: scoring.tech_score, max: 25 },
                                        { label: 'Культуры', value: scoring.crop_score, max: 20 },
                                        { label: 'Кредитная история', value: scoring.ban_score, max: 15 },
                                        { label: 'Инфраструктура', value: scoring.infra_score, max: 15 },
                                        { label: 'Геометрия', value: scoring.geo_score, max: 10 },
                                        { label: 'Диверсификация', value: scoring.diversification_score, max: 10 },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="w-32 text-sm text-slate-600">{item.label}</span>
                                            <div className="flex-1 bg-slate-100 rounded-full h-2">
                                                <div
                                                    className="bg-emerald-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${(item.value / item.max) * 100}%` }}
                                                />
                                            </div>
                                            <span className="w-16 text-sm font-medium text-right">
                                                {item.value}/{item.max}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Financial Metrics */}
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-600 mb-1">Процентная ставка</p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {(scoring.interest_rate * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <p className="text-xs text-purple-600 mb-1">Ежемесячный платеж</p>
                                        <p className="text-2xl font-bold text-purple-700">
                                            ${scoring.monthly_payment.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                                        <p className="text-xs text-amber-600 mb-1">DTI Ratio</p>
                                        <p className="text-2xl font-bold text-amber-700">
                                            {(scoring.debt_to_income_ratio * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">Скоринг еще не рассчитан</p>
                                <p className="text-sm text-slate-400 mt-1">Нажмите кнопку выше для расчета</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Farmer Info */}
                <div className="space-y-6">
                    {/* Farmer Profile */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Профиль фермера</h2>

                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">{application.farmer_id}</p>
                                <p className="text-sm text-slate-500">ID Фермера</p>
                            </div>
                        </div>

                        {application.farmer_profile && (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Опыт</p>
                                    <p className="font-medium">{application.farmer_profile.farming_experience_years || 0} лет</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Образование</p>
                                    <p className="font-medium">{application.farmer_profile.education_level || 'Не указано'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Кредитов ранее</p>
                                    <p className="font-medium">{application.farmer_profile.number_of_loans || 0}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-semibold text-slate-900 mb-3">Статус заявки</h3>
                        <div className={`p-4 rounded-lg text-center ${application.status === 'approved' ? 'bg-emerald-50' :
                                application.status === 'rejected' ? 'bg-red-50' :
                                    'bg-amber-50'
                            }`}>
                            <p className={`text-lg font-bold ${application.status === 'approved' ? 'text-emerald-700' :
                                    application.status === 'rejected' ? 'text-red-700' :
                                        'text-amber-700'
                                }`}>
                                {getStatusText(application.status)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
