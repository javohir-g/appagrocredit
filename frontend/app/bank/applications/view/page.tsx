"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    Sprout,
    TrendingUp,
    AlertTriangle,
    FileText,
    CheckCircle2,
    XCircle,
    Send
} from "lucide-react";

interface ApplicationDetail {
    id: number;
    farmer: {
        name: string;
        email: string;
        phone: string;
        region: string;
        experience: number;
        rating: number;
        totalLoans: number;
        activeLoans: number;
    };
    farm: {
        size: number;
        location: string;
        cropType: string;
        yieldForecast: string;
        weatherRisks: string;
    };
    loan: {
        amount: number;
        purpose: string;
        term: number;
        dateSubmitted: string;
    };
    aiAnalysis: {
        score: number;
        riskCategory: string;
        factors: Array<{ name: string; value: string; impact: string }>;
    };
    status: string;
}

function ApplicationDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const applicationId = searchParams.get("id");
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<ApplicationDetail | null>(null);

    useEffect(() => {
        if (applicationId) {
            fetchApplication();
        } else {
            setLoading(false);
        }
    }, [applicationId]);

    const fetchApplication = async () => {
        try {
            // Mock data - replace with API call
            const mockData: ApplicationDetail = {
                id: parseInt(applicationId || "1"),
                farmer: {
                    name: "Иван Петров",
                    email: "ivan.petrov@example.com",
                    phone: "+998 90 123 45 67",
                    region: "Ташкентская область",
                    experience: 12,
                    rating: 4.5,
                    totalLoans: 3,
                    activeLoans: 1
                },
                farm: {
                    size: 45,
                    location: "Ташкентская обл., Чирчикский район",
                    cropType: "Пшеница, ячмень",
                    yieldForecast: "Хороший (прогноз: 4.2 т/га)",
                    weatherRisks: "Низкий риск засухи"
                },
                loan: {
                    amount: 50000,
                    purpose: "Покупка семян и удобрений для посевной кампании 2025",
                    term: 12,
                    dateSubmitted: "2024-12-03"
                },
                aiAnalysis: {
                    score: 85,
                    riskCategory: "Low",
                    factors: [
                        { name: "Платежная история", value: "Отлично", impact: "+25" },
                        { name: "Состояние почвы", value: "Хорошее", impact: "+20" },
                        { name: "Погодные условия", value: "Благоприятные", impact: "+15" },
                        { name: "Опыт фермера", value: "12 лет", impact: "+15" },
                        { name: "Размер хозяйства", value: "45 га", impact: "+10" }
                    ]
                },
                status: "pending"
            };
            setApplication(mockData);
        } catch (error) {
            console.error("Failed to fetch application:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = () => {
        alert("Заявка одобрена");
    };

    const handleReject = () => {
        alert("Заявка отклонена");
    };

    const handleRequestDocuments = () => {
        alert("Запрос на дополнительные документы отправлен");
    };

    if (loading) {
        return (
            <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <p className="mt-4 text-slate-600">Загрузка заявки...</p>
                </div>
            </main>
        );
    }

    if (!applicationId || !application) {
        return (
            <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600">Заявка не найдена</p>
                    <button onClick={() => router.back()} className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
                        ← Назад
                    </button>
                </div>
            </main>
        );
    }

    const getRiskColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "low": return "text-emerald-600 bg-emerald-50";
            case "medium": return "text-amber-600 bg-amber-50";
            case "high": return "text-red-600 bg-red-50";
            default: return "text-slate-600 bg-slate-50";
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Заявка #{application.id}</h1>
                        <p className="text-sm text-slate-500 mt-1">{application.farmer.name} • Подана {new Date(application.loan.dateSubmitted).toLocaleDateString('ru-RU')}</p>
                    </div>
                </div>

                {/* AI Score Badge */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-slate-900 mb-1">{application.aiAnalysis.score}<span className="text-lg text-slate-400">/100</span></div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getRiskColor(application.aiAnalysis.riskCategory)}`}>
                        {application.aiAnalysis.riskCategory === "Low" ? "Низкий риск" : application.aiAnalysis.riskCategory === "Medium" ? "Средний риск" : "Высокий риск"}
                    </span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Farmer Info */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-600" />
                            Информация о фермере
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Имя</p>
                                <p className="font-medium text-slate-900">{application.farmer.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Email</p>
                                <p className="font-medium text-slate-900">{application.farmer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Телефон</p>
                                <p className="font-medium text-slate-900">{application.farmer.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Регион</p>
                                <p className="font-medium text-slate-900">{application.farmer.region}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Опыт</p>
                                <p className="font-medium text-slate-900">{application.farmer.experience} лет</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Рейтинг</p>
                                <p className="font-medium text-slate-900">{application.farmer.rating}/5.0</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Всего кредитов</p>
                                <p className="font-medium text-slate-900">{application.farmer.totalLoans}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Активных кредитов</p>
                                <p className="font-medium text-slate-900">{application.farmer.activeLoans}</p>
                            </div>
                        </div>
                    </div>

                    {/* Farm Analytics */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Sprout className="w-5 h-5 text-emerald-600" />
                            Аналитика хозяйства
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Размер поля</p>
                                <p className="font-medium text-slate-900">{application.farm.size} га</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Местоположение</p>
                                <p className="font-medium text-slate-900">{application.farm.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Выращиваемые культуры</p>
                                <p className="font-medium text-slate-900">{application.farm.cropType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Прогноз урожайности</p>
                                <p className="font-medium text-emerald-600">{application.farm.yieldForecast}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Погодные риски</p>
                                <p className="font-medium text-emerald-600">{application.farm.weatherRisks}</p>
                            </div>
                        </div>
                    </div>

                    {/* Loan Details */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                            Детали кредита
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Запрашиваемая сумма</p>
                                <p className="text-2xl font-bold text-slate-900">${application.loan.amount.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Цель кредита</p>
                                <p className="font-medium text-slate-900">{application.loan.purpose}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Срок кредита</p>
                                <p className="font-medium text-slate-900">{application.loan.term} месяцев</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - 1/3 */}
                <div className="space-y-6">
                    {/* AI Analysis */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-emerald-600" />
                            AI-анализ
                        </h2>
                        <div className="space-y-3">
                            {application.aiAnalysis.factors.map((factor, index) => (
                                <div key={index} className="pb-3 border-b border-slate-100 last:border-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-slate-900">{factor.name}</span>
                                        <span className="text-sm font-semibold text-emerald-600">{factor.impact}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{factor.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Действия</h2>
                        <div className="space-y-3">
                            <button
                                onClick={handleApprove}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Одобрить
                            </button>
                            <button
                                onClick={handleReject}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                <XCircle className="w-4 h-4" />
                                Отклонить
                            </button>
                            <button
                                onClick={handleRequestDocuments}
                                className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                            >
                                <Send className="w-4 h-4" />
                                Запросить документы
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                                <FileText className="w-4 h-4" />
                                На доп. проверку
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ApplicationDetailPage() {
    return (
        <Suspense fallback={
            <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <p className="mt-4 text-slate-600">Загрузка...</p>
                </div>
            </main>
        }>
            <ApplicationDetailContent />
        </Suspense>
    );
}
