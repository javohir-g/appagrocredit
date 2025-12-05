"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Mock authentication - replace with real API call
        const testUsers = {
            "farmer1@agrocredit.uz": { password: "farmer123", role: "farmer" },
            "farmer2@agrocredit.uz": { password: "farmer123", role: "farmer" },
            "farmer3@agrocredit.uz": { password: "farmer123", role: "farmer" },
            "bank@agrocredit.uz": { password: "bank123", role: "bank" },
        };

        setTimeout(() => {
            const user = testUsers[email as keyof typeof testUsers];

            if (user && user.password === password) {
                // Store user info
                localStorage.setItem("user", JSON.stringify({ email, role: user.role }));

                // Redirect based on role
                if (user.role === "farmer") {
                    router.push("/farmer/applications");
                } else {
                    router.push("/bank/applications");
                }
            } else {
                setError("Неверный email или пароль");
            }
            setLoading(false);
        }, 1000);
    };

    const quickLogin = (email: string, password: string) => {
        setEmail(email);
        setPassword(password);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
                        <span className="text-3xl">🌾</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">AgroCredit AI</h1>
                    <p className="text-slate-600">Умные кредитные решения для агробизнеса</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-slate-50 border-none rounded-lg pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Пароль
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border-none rounded-lg pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-200 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Вход...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Войти
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Test Credentials */}
                <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Тестовые аккаунты:</h3>

                    <div className="space-y-3">
                        {/* Farmer 1 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-900">Фермер 1 (Успешный)</span>
                                <button
                                    onClick={() => quickLogin("farmer1@agrocredit.uz", "farmer123")}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Быстрый вход →
                                </button>
                            </div>
                            <p className="text-xs text-slate-600">Email: farmer1@agrocredit.uz</p>
                            <p className="text-xs text-slate-600">Пароль: farmer123</p>
                        </div>

                        {/* Farmer 2 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-900">Фермер 2 (Средний)</span>
                                <button
                                    onClick={() => quickLogin("farmer2@agrocredit.uz", "farmer123")}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Быстрый вход →
                                </button>
                            </div>
                            <p className="text-xs text-slate-600">Email: farmer2@agrocredit.uz</p>
                            <p className="text-xs text-slate-600">Пароль: farmer123</p>
                        </div>

                        {/* Farmer 3 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-900">Фермер 3 (Начинающий)</span>
                                <button
                                    onClick={() => quickLogin("farmer3@agrocredit.uz", "farmer123")}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Быстрый вход →
                                </button>
                            </div>
                            <p className="text-xs text-slate-600">Email: farmer3@agrocredit.uz</p>
                            <p className="text-xs text-slate-600">Пароль: farmer123</p>
                        </div>

                        {/* Bank */}
                        <div className="bg-white rounded-lg p-4 border border-emerald-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-900">Банк</span>
                                <button
                                    onClick={() => quickLogin("bank@agrocredit.uz", "bank123")}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Быстрый вход →
                                </button>
                            </div>
                            <p className="text-xs text-slate-600">Email: bank@agrocredit.uz</p>
                            <p className="text-xs text-slate-600">Пароль: bank123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
