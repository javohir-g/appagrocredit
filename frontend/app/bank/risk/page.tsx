"use client";

export default function RiskPage() {
    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>Platform</span>
                        <i className="w-1 h-1 rounded-full bg-slate-300"></i>
                        <span className="text-slate-900 font-medium">Risk</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Risk Scoring</h1>
                </div>
            </div>
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
                    <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Risk Assessment Engine</h3>
                <p className="text-slate-500 max-w-md mx-auto">Configure risk parameters, view aggregate risk reports, and manage credit scoring models.</p>
            </div>
        </main>
    );
}
