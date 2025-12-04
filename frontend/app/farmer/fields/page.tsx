"use client";

import Link from "next/link";
import {
    MapPin,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Droplets,
    Eye
} from "lucide-react";

export default function FieldsPage() {
    const fields = [
        {
            id: 1,
            name: "Поле №1",
            crop: "Пшеница",
            size: 15,
            status: "healthy",
            healthScore: 92,
            photo: "🌾",
            recommendation: "Отличное состояние. Продолжайте текущий режим полива.",
            location: "Ташкентская обл."
        },
        {
            id: 2,
            name: "Поле №2",
            crop: "Хлопок",
            size: 20,
            status: "warning",
            healthScore: 68,
            photo: "🌱",
            recommendation: "Обнаружены признаки засухи. Увеличьте полив на 20%.",
            location: "Ташкентская обл."
        },
        {
            id: 3,
            name: "Поле №3",
            crop: "Рис",
            size: 10,
            status: "healthy",
            healthScore: 85,
            photo: "🌾",
            recommendation: "Хорошее состояние. Внесите удобрения через 3 дня.",
            location: "Ташкентская обл."
        },
    ];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "healthy":
                return {
                    label: "Здоровое",
                    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    icon: CheckCircle2,
                    iconColor: "text-emerald-600"
                };
            case "warning":
                return {
                    label: "Требует внимания",
                    color: "bg-amber-50 text-amber-700 border-amber-200",
                    icon: AlertTriangle,
                    iconColor: "text-amber-600"
                };
            case "risk":
                return {
                    label: "Есть риск",
                    color: "bg-red-50 text-red-700 border-red-200",
                    icon: AlertTriangle,
                    iconColor: "text-red-600"
                };
            default:
                return {
                    label: "Неизвестно",
                    color: "bg-slate-50 text-slate-700 border-slate-200",
                    icon: CheckCircle2,
                    iconColor: "text-slate-600"
                };
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Мои поля</h1>
                <p className="text-sm text-slate-500 mt-1">Мониторинг и рекомендации AI</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-emerald-100 text-sm mb-1">Всего полей</p>
                        <p className="text-3xl font-bold">{fields.length}</p>
                    </div>
                    <div className="text-5xl opacity-20">🌾</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                        <p className="text-lg font-bold">{fields.reduce((sum, f) => sum + f.size, 0)}</p>
                        <p className="text-xs text-emerald-100">Всего га</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                        <p className="text-lg font-bold">{fields.filter(f => f.status === "healthy").length}</p>
                        <p className="text-xs text-emerald-100">Здоровых</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                        <p className="text-lg font-bold">{Math.round(fields.reduce((sum, f) => sum + f.healthScore, 0) / fields.length)}</p>
                        <p className="text-xs text-emerald-100">Ср. балл</p>
                    </div>
                </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 gap-4">
                {fields.map((field) => {
                    const statusConfig = getStatusConfig(field.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <Link
                            key={field.id}
                            href={`/farmer/fields/view?id=${field.id}`}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 bg-slate-50 border-b border-slate-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">{field.photo}</div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{field.name}</h3>
                                            <p className="text-sm text-slate-600">{field.crop} • {field.size} га</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-900 mb-0.5">{field.healthScore}</div>
                                        <div className="text-xs text-slate-500">Здоровье</div>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-4 space-y-3">
                                {/* Status Badge */}
                                <div className="flex items-center gap-2">
                                    <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${statusConfig.color}`}>
                                        <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
                                        {statusConfig.label}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                        <MapPin className="w-3 h-3" />
                                        {field.location}
                                    </span>
                                </div>

                                {/* AI Recommendation */}
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                                    <div className="flex items-start gap-2">
                                        <div className="p-1.5 bg-purple-100 rounded-md mt-0.5">
                                            <Droplets className="w-3.5 h-3.5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-purple-900 mb-0.5">AI Рекомендация</p>
                                            <p className="text-xs text-slate-700 leading-relaxed">{field.recommendation}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <button className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                    <Eye className="w-4 h-4" />
                                    Детали поля
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
