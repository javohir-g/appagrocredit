"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/utils/api";
import ScoreCard from "@/components/ScoreCard";

const MapField = dynamic(() => import("@/components/MapField"), { ssr: false });

interface Farm {
    id: number;
    name: string;
    crop_type: string;
    acreage: number;
    geometry: any;
    score?: {
        numeric_score: number;
        risk_category: string;
        factors: any;
    };
}

function FarmDetailContent() {
    const [farm, setFarm] = useState<Farm | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const farmId = searchParams.get("id");

    useEffect(() => {
        if (farmId) {
            fetchFarm();
        } else {
            setLoading(false);
        }
    }, [farmId]);

    const fetchFarm = async () => {
        try {
            const response = await api.get(`/farmer/farms/${farmId}`);
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
                    <p className="mt-4 text-gray-600">Loading field details...</p>
                </div>
            </div>
        );
    }

    if (!farmId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="card text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h2>
                    <p className="text-gray-600 mb-4">No field ID provided.</p>
                    <button onClick={() => router.push("/farmer/dashboard")} className="btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!farm) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="card text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Field Not Found</h2>
                    <button onClick={() => router.push("/farmer/dashboard")} className="btn-primary mt-4">
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
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">{farm.name}</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Score Card */}
                    <div className="lg:col-span-1">
                        {farm.score ? (
                            <ScoreCard score={farm.score.numeric_score} riskCategory={farm.score.risk_category} />
                        ) : (
                            <div className="card text-center">
                                <p className="text-gray-600">No score available</p>
                            </div>
                        )}
                    </div>

                    {/* Field Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card">
                            <h3 className="text-xl font-semibold mb-4">Field Information</h3>
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

                        {farm.score && (
                            <div className="card">
                                <h3 className="text-xl font-semibold mb-4">Score Factors</h3>
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
                        )}

                        <div className="card">
                            <h3 className="text-xl font-semibold mb-4">Field Map</h3>
                            <MapField geometry={farm.geometry} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function FarmDetailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <FarmDetailContent />
        </Suspense>
    );
}
