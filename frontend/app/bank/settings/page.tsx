"use client";

import { Settings as SettingsIcon, Users, Shield, DollarSign, FileText } from "lucide-react";

export default function SettingsPage() {
    return (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500 mt-1">Управление настройками и доступами</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-emerald-50 rounded-lg">
                            <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Управление пользователями</h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Добавление, редактирование и удаление сотрудников банка</p>
                    <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                        Управление пользователями
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Управление доступами</h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Настройка ролей и прав доступа</p>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Настройки доступа
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Лимиты одобрения</h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Настройка лимитов для одобрения кредитов</p>
                    <button className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                        Управление лимитами
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-purple-50 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Экспорт и отчёты</h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Настройка автоматических отчётов и экспорта данных</p>
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                        Настройки отчётов
                    </button>
                </div>
            </div>
        </main>
    );
}
