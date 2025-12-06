"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    MapPin,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Droplets,
    Eye,
    Loader2
} from "lucide-react";

interface Field {
    id: number;
    name: string;
    crop_type: string;
    size_hectares: number;
    location_description: string;
    health_score: number;
    status: string;
    ai_recommendation: string;
}

export default function FieldsPage() {
    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app-agrocredit.onrender.com';
            const response = await fetch(`${API_URL}/farmer/fields`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch fields");
            }

            const data = await response.json();
            setFields(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching fields:", err);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">Ошибка загрузки полей: {error}</p>
                </div>
            </div>
        );
    }

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
                {fields.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                            <p className="text-lg font-bold">
                                {fields.reduce((sum, f) => sum + f.size_hectares, 0).toFixed(1)}
                            </p>
                            <p className="text-xs text-emerald-100">Всего га</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                            <p className="text-lg font-bold">
                                {fields.filter(f => f.status === "healthy").length}
                            </p>
                            <p className="text-xs text-emerald-100">Здоровых</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                            <p className="text-lg font-bold">
                                {fields.length > 0
                                    ? Math.round(fields.reduce((sum, f) => sum + f.health_score, 0) / fields.length)
                                    : 0
                                }
                            </p>
                            <p className="text-xs text-emerald-100">Ср. балл</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {fields.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                    <div className="text-5xl mb-4">🌾</div>
                    <p className="text-slate-600 font-medium mb-1">Нет полей</p>
                    <p className="text-sm text-slate-500">Добавьте поля для мониторинга</p>
                </div>
            )}

            {/* Fields Grid */}
            <div className="grid grid-cols-1 gap-4">
                {fields.map((field) => {
                    const statusConfig = getStatusConfig(field.status);
                    const StatusIcon = statusConfig.icon;

                    // Get crop emoji
                    const getCropEmoji = (crop: string) => {
                        const lowerCrop = crop?.toLowerCase() || "";
                        if (lowerCrop.includes("пшен")) return "🌾";
                        if (lowerCrop.includes("хлопок")) return "🌱";
                        if (lowerCrop.includes("рис")) return "🌾";
                        if (lowerCrop.includes("овощ")) return "🥬";
                        return "🌾";
                    };

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
                                        <div className="text-4xl">{getCropEmoji(field.crop_type)}</div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{field.name}</h3>
                                            <p className="text-sm text-slate-600">
                                                {field.crop_type} • {field.size_hectares} га
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-900 mb-0.5">
                                            {field.health_score}
                                        </div>
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
                                    {field.location_description && (
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <MapPin className="w-3 h-3" />
                                            {field.location_description}
                                        </span>
                                    )}
                                </div>

                                {/* AI Recommendation */}
                                {field.ai_recommendation && (
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                                        <div className="flex items-start gap-2">
                                            <div className="p-1.5 bg-purple-100 rounded-md mt-0.5">
                                                <Droplets className="w-3.5 h-3.5 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-purple-900 mb-0.5">AI Рекомендация</p>
                                                <p className="text-xs text-slate-700 leading-relaxed">
                                                    {field.ai_recommendation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

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

