"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    MapPin,
    TrendingUp,
    Droplets,
    Sprout,
    AlertTriangle,
    Camera,
    Sun,
    Cloud
} from "lucide-react";

function FieldDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fieldId = searchParams.get("id");

    const [field, setField] = useState({
        id: 1,
        name: "Поле №1",
        crop: "Пшеница",
        size: 15,
        location: "Ташкентская обл., Чирчикский район",
        status: "healthy",
        healthScore: 92,
        photo: "🌾",
        yieldForecast: "4.2 т/га (+12% от среднего)",
        weatherRisks: "Низкий",
        soilMoisture: 68,
        temperature: 24,
        ndviHistory: [65, 70, 75, 78, 82, 85],
        recommendations: {
            irrigation: "Следующий полив через 2 дня. Утренний полив (5-7 часов) оптимален.",
            fertilizer: "Внесите азотные удобрения через 5 дней. Рекомендуемая доза: 50 кг/га",
            treatment: "Профилактическая обработка от вредителей не требуется. Состояние отличное."
        }
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-slate-900">{field.name}</h1>
                        <p className="text-sm text-slate-500">{field.crop} • {field.size} га</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{field.healthScore}</div>
                        <div className="text-xs text-slate-500">Здоровье</div>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4 pb-20">
                {/* Satellite Image Placeholder */}
                <div className="bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                    <div className="text-center z-10">
                        <div className="text-6xl mb-2">🛰️</div>
                        <p className="text-sm font-medium text-emerald-800">Спутниковый снимок</p>
                        <p className="text-xs text-emerald-700">Последнее обновление: Сегодня</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-slate-900">{field.soilMoisture}%</div>
                        <div className="text-xs text-slate-500">Влажность</div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <Sun className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-slate-900">{field.temperature}°C</div>
                        <div className="text-xs text-slate-500">Температура</div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <Cloud className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-slate-900">{field.weatherRisks}</div>
                        <div className="text-xs text-slate-500">Риск</div>
                    </div>
                </div>

                {/* NDVI Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        История NDVI (Индекс здоровья)
                    </h2>
                    <div className="flex items-end justify-between h-32 gap-2">
                        {field.ndviHistory.map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600"
                                    style={{ height: `${value}%` }}
                                />
                                <span className="text-xs text-slate-500">{index + 1}м</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-4">Тренд: Улучшение +8% за месяц</p>
                </div>

                {/* ML Forecast */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Sprout className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">ML-Прогноз урожайности</h3>
                            <div className="text-3xl font-bold mb-2">{field.yieldForecast}</div>
                            <p className="text-sm text-purple-100">
                                На основе анализа спутниковых данных, погоды и исторических показателей
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                    <h2 className="font-bold text-slate-900">Рекомендации AI</h2>

                    <div className="space-y-3">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-start gap-3">
                                <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-blue-900 mb-1">Полив</h4>
                                    <p className="text-sm text-slate-700">{field.recommendations.irrigation}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                            <div className="flex items-start gap-3">
                                <Sprout className="w-5 h-5 text-emerald-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-emerald-900 mb-1">Удобрения</h4>
                                    <p className="text-sm text-slate-700">{field.recommendations.fertilizer}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-amber-900 mb-1">Обработка</h4>
                                    <p className="text-sm text-slate-700">{field.recommendations.treatment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photo Upload */}
                <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200">
                    <Camera className="w-5 h-5" />
                    Отправить фото-проверку
                </button>
            </div>
        </div>
    );
}

export default function FieldDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                    <p className="text-slate-600">Загрузка...</p>
                </div>
            </div>
        }>
            <FieldDetailContent />
        </Suspense>
    );
}
