"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";
import RiskBadge from "@/components/RiskBadge";
import {
    LayoutGrid,
    ShieldCheck,
    AlertTriangle,
    AlertOctagon,
    ArrowRight
} from "lucide-react";

interface FarmerSummary {
    farm_id: number;
    farm_name: string;
    farmer_email: string;
    crop_type: string;
    acreage: number;
    numeric_score: number;
    risk_category: string;
}

export default function BankDashboard() {
    const [farmers, setFarmers] = useState<FarmerSummary[]>([]);
    const [filteredFarmers, setFilteredFarmers] = useState<FarmerSummary[]>([]);
    const [riskFilter, setRiskFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // v1.0: No auth check needed
        fetchFarmers();
    }, []);

    useEffect(() => {
        if (riskFilter === "all") {
            setFilteredFarmers(farmers);
        } else {
            setFilteredFarmers(farmers.filter((f) => f.risk_category.toLowerCase() === riskFilter));
        }
    }, [riskFilter, farmers]);

    const fetchFarmers = async () => {
        try {
            const response = await api.get("/bank/farmers");
            setFarmers(response.data);
            setFilteredFarmers(response.data);
        } catch (error) {
            console.error("Failed to fetch farmers:", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: farmers.length,
        low: farmers.filter((f) => f.risk_category === "Low").length,
        medium: farmers.filter((f) => f.risk_category === "Medium").length,
        high: farmers.filter((f) => f.risk_category === "High").length,
    };

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth pb-20">

            {/* Breadcrumbs & Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>Platform</span>
                        <i className="w-1 h-1 rounded-full bg-slate-300"></i>
                        <span className="text-slate-900 font-medium">Portfolio Overview</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Bank Dashboard</h1>
                </div>
                <div className="flex gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Active
                    </span>
                </div>
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Farms */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LayoutGrid className="w-16 h-16 text-slate-600" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Total Farms</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2 font-medium">Registered Fields</p>
                </div>

                {/* Low Risk */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck className="w-16 h-16 text-emerald-600" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Low Risk</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-600">{stats.low}</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${stats.total ? (stats.low / stats.total) * 100 : 0}%` }}></div>
                    </div>
                    <p className="text-[10px] text-emerald-600 mt-2 font-medium">Safe Investments</p>
                </div>

                {/* Medium Risk */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle className="w-16 h-16 text-amber-500" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Medium Risk</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-amber-500">{stats.medium}</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${stats.total ? (stats.medium / stats.total) * 100 : 0}%` }}></div>
                    </div>
                    <p className="text-[10px] text-amber-600 mt-2 font-medium">Monitor Closely</p>
                </div>

                {/* High Risk */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertOctagon className="w-16 h-16 text-red-600" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">High Risk</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-red-600">{stats.high}</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${stats.total ? (stats.high / stats.total) * 100 : 0}%` }}></div>
                    </div>
                    <p className="text-[10px] text-red-600 mt-2 font-medium">Action Required</p>
                </div>
            </div>

            {/* Filters & Table Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900">Farmer Portfolio</h3>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setRiskFilter("all")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${riskFilter === "all"
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setRiskFilter("low")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${riskFilter === "low"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            Low Risk
                        </button>
                        <button
                            onClick={() => setRiskFilter("medium")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${riskFilter === "medium"
                                ? "bg-amber-500 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            Medium Risk
                        </button>
                        <button
                            onClick={() => setRiskFilter("high")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${riskFilter === "high"
                                ? "bg-red-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            High Risk
                        </button>
                    </div>
                </div>

                {/* Farmers Table */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        <p className="mt-4 text-sm text-slate-500">Loading portfolio data...</p>
                    </div>
                ) : filteredFarmers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-sm">No farms found matching the selected filter</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Farm Name</th>
                                    <th className="px-6 py-3 font-medium">Farmer</th>
                                    <th className="px-6 py-3 font-medium">Crop</th>
                                    <th className="px-6 py-3 font-medium">Acreage</th>
                                    <th className="px-6 py-3 font-medium">Score</th>
                                    <th className="px-6 py-3 font-medium">Risk</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredFarmers.map((farmer) => (
                                    <tr key={farmer.farm_id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900">{farmer.farm_name}</td>
                                        <td className="px-6 py-4 text-slate-500">{farmer.farmer_email}</td>
                                        <td className="px-6 py-4 capitalize text-slate-700">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
                                                {farmer.crop_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{farmer.acreage} ac</td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-900">{farmer.numeric_score.toFixed(1)}</span>
                                            <span className="text-slate-400 text-xs ml-1">/ 100</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RiskBadge category={farmer.risk_category} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/bank/farms/${farmer.farm_id}`}
                                                className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-xs group-hover:underline"
                                            >
                                                View Analysis <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
