"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";
import RiskBadge from "@/components/RiskBadge";
import {
    Plus,
    Sprout,
    ArrowRight,
    MapPin,
    Calendar
} from "lucide-react";

interface Farm {
    id: number;
    name: string;
    crop_type: string;
    acreage: number;
    score?: {
        numeric_score: number;
        risk_category: string;
    };
}

export default function FarmerDashboard() {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // v1.0: No auth check needed
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        try {
            const response = await api.get("/farmer/farms");
            setFarms(response.data);
        } catch (error) {
            console.error("Failed to fetch farms:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>Farmer Portal</span>
                        <i className="w-1 h-1 rounded-full bg-slate-300"></i>
                        <span className="text-slate-900 font-medium">Overview</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My Fields</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your registered fields and view credit scores</p>
                </div>
                <Link
                    href="/farmer/farms/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Add New Field
                </Link>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm text-slate-500 font-medium">Loading your fields...</p>
                </div>
            ) : farms.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6">
                        <Sprout className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No fields registered yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Get started by adding your first field to receive an AI-generated credit score and detailed analysis.
                    </p>
                    <Link
                        href="/farmer/farms/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Register Your First Field
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farms.map((farm) => (
                        <Link
                            key={farm.id}
                            href={`/farmer/farms/${farm.id}`}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col"
                        >
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                            <Sprout className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{farm.name}</h3>
                                            <p className="text-xs text-slate-500 capitalize flex items-center gap-1 mt-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                {farm.crop_type}
                                            </p>
                                        </div>
                                    </div>
                                    {farm.score && <RiskBadge category={farm.score.risk_category} />}
                                </div>

                                <div className="space-y-3 mt-6">
                                    <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            Acreage
                                        </span>
                                        <span className="font-medium text-slate-900">{farm.acreage} acres</span>
                                    </div>
                                    {farm.score && (
                                        <div className="flex justify-between items-center text-sm py-2">
                                            <span className="text-slate-500 flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Credit Score
                                            </span>
                                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                {farm.score.numeric_score.toFixed(1)}/100
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">View Analysis</span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors transform group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
