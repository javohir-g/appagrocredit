"use client";

import {
    Sprout,
    Landmark,
    Satellite,
    Zap,
    ArrowRight
} from "lucide-react";

export default function HomePage() {
    return (
        <div className="h-screen w-full bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex items-center justify-center relative overflow-hidden">

            {/* Background Blobs */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-8 animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    ИИ-решения для агробизнеса
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-tight max-w-5xl mx-auto">
                    AgroCredit AI – Умные кредитные решения для <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">сельского хозяйства</span>
                </h1>

                <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Помогаем фермерам и агробизнесу принимать решения по финансированию с помощью ИИ.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => {
                            localStorage.setItem('userRole', 'farmer');
                            window.location.href = '/farmer/dashboard';
                        }}
                        className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <Sprout className="w-5 h-5" />
                            <span>Для фермера</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            localStorage.setItem('userRole', 'bank_officer');
                            window.location.href = '/bank/dashboard';
                        }}
                        className="group relative px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-semibold text-lg shadow-sm hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <Landmark className="w-5 h-5 text-slate-500" />
                            <span>Для работника банка</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

