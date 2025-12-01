"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/utils/api";
import ScoreCard from "@/components/ScoreCard";

const MapField = dynamic(() => import("@/components/MapField"), { ssr: false });

interface FarmDetail {
    id: number;
    name: string;
    crop_type: string;
    acreage: number;
    geometry: any;
    farmer_email: string;
    score: {
        numeric_score: number;
        risk_category: string;
        factors: any;
    };
    indicators: {
        field_health: string;
        drought_risk: string;
        soil_condition: string;
        weather_summary: {
            avg_temperature: number;
            rainfall_30d: number;
            drought_index: number;
        };
    };
}

export default function BankFarmDetailPage() {
    const [farm, setFarm] = useState<FarmDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const farmId = params.id;

    useEffect(() => {
        if (farmId) {
            fetchFarm();
        }
    }, [farmId]);

    const fetchFarm = async () => {
        try {
            const response = await api.get(`/bank/farms/${farmId}`);
            setFarm(response.data);
        } catch (error) {
            console.error("Failed to fetch farm:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600">Loading farm details...</p>
                </div>
            </div>
        );
    }

    if (!farm) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="card text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Farm Not Found</h2>
                    <button onClick={() => router.push("/bank/dashboard")} className="btn-primary mt-4">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <button onClick={() => router.back()} className="text-primary-600 hover:text-primary-700 mb-2">
                        ← Back to Portfolio
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">{farm.name}</h1>
                    <p className="text-gray-600">Farmer: {farm.farmer_email}</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Score and Indicators */}
                    <div className="lg:col-span-1 space-y-6">
                        <ScoreCard score={farm.score.numeric_score} riskCategory={farm.score.risk_category} />

                        <div className="card">
                            <h3 className="text-xl font-semibold mb-4">Key Indicators</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Field Health</p>
                                    <p className="text-lg font-semibold">{farm.indicators.field_health}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Drought Risk</p>
                                    <p className="text-lg font-semibold">{farm.indicators.drought_risk}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Soil Condition</p>
                                    <p className="text-lg font-semibold">{farm.indicators.soil_condition}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-xl font-semibold mb-4">Weather Summary</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Temperature</p>
                                    <p className="text-lg font-semibold">
                                        {farm.indicators.weather_summary.avg_temperature}°C
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Rainfall (30d)</p>
                                    <p className="text-lg font-semibold">
                                        {farm.indicators.weather_summary.rainfall_30d} mm
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Drought Index</p>
                                    <p className="text-lg font-semibold">
                                        {farm.indicators.weather_summary.drought_index.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card">
                            <h3 className="text-xl font-semibold mb-4">Farm Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Crop Type</p>
                                    <p className="text-lg font-semibold capitalize">{farm.crop_type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Acreage</p>
                                    <p className="text-lg font-semibold">{farm.acreage} acres</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-xl font-semibold mb-4">Score Breakdown</h3>
                            <div className="space-y-3">
                                {Object.entries(farm.score.factors).map(([key, value]: [string, any]) => (
                                    <div key={key} className="border-b border-gray-200 pb-3 last:border-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium capitalize">
                                                {key.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-primary-600 font-semibold">
                                                +{value.contribution}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{value.description}</p>
                                        <p className="text-sm text-gray-500">Value: {value.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-xl font-semibold mb-4">Field Map with NDVI Overlay</h3>
                            <MapField geometry={farm.geometry} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
