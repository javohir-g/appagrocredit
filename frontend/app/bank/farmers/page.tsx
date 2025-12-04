"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    MapPin,
    Star,
    TrendingUp,
    AlertCircle,
    Eye,
    Mail,
    Phone
} from "lucide-react";

interface Farmer {
    id: number;
    name: string;
    email: string;
    phone: string;
    region: string;
    farmSize: number;
    crops: string;
    rating: number;
    activeLoans: number;
    totalDebt: number;
    riskScore: number;
    riskCategory: string;
}

export default function FarmersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [regionFilter, setRegionFilter] = useState("all");
    const [riskFilter, setRiskFilter] = useState("all");

    const farmers: Farmer[] = [
        { id: 1, name: "Иван Петров", email: "ivan.petrov@example.com", phone: "+998 90 123 45 67", region: "Ташкентская обл.", farmSize: 45, crops: "Пшеница, ячмень", rating: 4.5, activeLoans: 1, totalDebt: 35000, riskScore: 85, riskCategory: "Low" },
        { id: 2, name: "Мария Сидорова", email: "maria.sidorova@example.com", phone: "+998 91 234 56 78", region: "Самаркандская обл.", farmSize: 60, crops: "Хлопок", rating: 4.0, activeLoans: 2, totalDebt: 45000, riskScore: 68, riskCategory: "Medium" },
        { id: 3, name: "Алексей Козлов", email: "alex.kozlov@example.com", phone: "+998 93 345 67 89", region: "Бухарская обл.", farmSize: 25, crops: "Овощи", rating: 3.5, activeLoans: 1, totalDebt: 15000, riskScore: 45, riskCategory: "High" },
        { id: 4, name: "Ольга Новикова", email: "olga.novikova@example.com", phone: "+998 94 456 78 90", region: "Андижанская обл.", farmSize: 80, crops: "Рис, пшеница", rating: 4.8, activeLoans: 0, totalDebt: 0, riskScore: 92, riskCategory: "Low" },
        { id: 5, name: "Дмитрий Волков", email: "dmitry.volkov@example.com", phone: "+998 95 567 89 01", region: "Ташкентская обл.", farmSize: 55, crops: "Фрукты", rating: 4.3, activeLoans: 1, totalDebt: 28000, riskScore: 78, riskCategory: "Low" },
        { id: 6, name: "Анна Смирнова", email: "anna.smirnova@example.com", phone: "+998 97 678 90 12", region: "Наманганская обл.", farmSize: 35, crops: "Виноград", rating: 3.2, activeLoans: 2, totalDebt: 42000, riskScore: 38, riskCategory: "High" },
        { id: 7, name: "Сергей Морозов", email: "sergey.morozov@example.com", phone: "+998 98 789 01 23", region: "Ферганская обл.", farmSize: 70, crops: "Пшеница, кукуруза", rating: 4.6, activeLoans: 1, totalDebt: 31000, riskScore: 88, riskCategory: "Low" },
        { id: 8, name: "Елена Кузнецова", email: "elena.kuznetsova@example.com", phone: "+998 99 890 12 34", region: "Самаркандская обл.", farmSize: 40, crops: "Бахчевые", rating: 3.8, activeLoans: 1, totalDebt: 22000, riskScore: 62, riskCategory: "Medium" },
    ];

    const filteredFarmers = farmers.filter(farmer => {
        const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.region.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = regionFilter === "all" || farmer.region === regionFilter;
        const matchesRisk = riskFilter === "all" || farmer.riskCategory.toLowerCase() === riskFilter;
        return matchesSearch && matchesRegion && matchesRisk;
    });

    const regions = Array.from(new Set(farmers.map(f => f.region)));

    const getRiskColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "low": return "text-emerald-600 bg-emerald-50";
            case "medium": return "text-amber-600 bg-amber-50";
            case "high": return "text-red-600 bg-red-50";
            default: return "text-slate-600 bg-slate-50";
        }
    };

    const stats = {
        total: farmers.length,
        lowRisk: farmers.filter(f => f.riskCategory === "Low").length,
        mediumRisk: farmers.filter(f => f.riskCategory === "Medium").length,
        highRisk: farmers.filter(f => f.riskCategory === "High").length,
        avgRating: (farmers.reduce((sum, f) => sum + f.rating, 0) / farmers.length).toFixed(1),
    };

    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Фермеры</h1>
                    <p className="text-sm text-slate-500 mt-1">Каталог всех клиентов-фермеров</p>
                </div>
                <div className="text-sm text-slate-500">
                    Всего: <span className="font-semibold text-slate-900">{filteredFarmers.length}</span> фермеров
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Всего</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Низкий риск</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.lowRisk}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Средний риск</p>
                    <p className="text-2xl font-bold text-amber-600">{stats.mediumRisk}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Высокий риск</p>
                    <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Средний рейтинг</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.avgRating}<span className="text-sm text-slate-400">/5</span></p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Поиск по имени или региону..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="bg-slate-50 border-none rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none"
                    >
                        <option value="all">Все регионы</option>
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                    <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="bg-slate-50 border-none rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none"
                    >
                        <option value="all">Все риски</option>
                        <option value="low">Низкий</option>
                        <option value="medium">Средний</option>
                        <option value="high">Высокий</option>
                    </select>
                </div>
            </div>

            {/* Farmers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFarmers.map((farmer) => (
                    <div key={farmer.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                                        {farmer.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{farmer.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                            <MapPin className="w-3 h-3" />
                                            {farmer.region}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getRiskColor(farmer.riskCategory)}`}>
                                    {farmer.riskScore}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Размер хозяйства</span>
                                    <span className="font-medium text-slate-900">{farmer.farmSize} га</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Культуры</span>
                                    <span className="font-medium text-slate-900 text-right truncate ml-2">{farmer.crops}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Рейтинг</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="font-medium text-slate-900">{farmer.rating}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Активных кредитов</span>
                                    <span className="font-medium text-slate-900">{farmer.activeLoans}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Общий долг</span>
                                    <span className="font-semibold text-slate-900">${farmer.totalDebt.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate">{farmer.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Phone className="w-3 h-3" />
                                    <span>{farmer.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                            <button className="w-full text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1">
                                <Eye className="w-4 h-4" />
                                Просмотр профиля
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredFarmers.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                    <p className="text-slate-500">Фермеры не найдены</p>
                </div>
            )}
        </main>
    );
}
