"use client";

import {
    DollarSign,
    Cloud,
    AlertTriangle,
    TrendingDown,
    CheckCircle2,
    FileText,
    Clock
} from "lucide-react";

export default function NotificationsPage() {
    const notifications = [
        {
            id: 1,
            type: "payment",
            title: "Скоро оплата",
            message: "Платёж $2,500 по кредиту №1 должен быть внесён до 15 декабря",
            time: "2 часа назад",
            icon: DollarSign,
            color: "bg-blue-50 text-blue-600",
            borderColor: "border-blue-200",
            unread: true
        },
        {
            id: 2,
            type: "weather",
            title: "Погодное предупреждение",
            message: "Ожидается сильный ветер в вашем регионе. Проверьте укрытие полей.",
            time: "5 часов назад",
            icon: Cloud,
            color: "bg-amber-50 text-amber-600",
            borderColor: "border-amber-200",
            unread: true
        },
        {
            id: 3,
            type: "field",
            title: "Проблема на поле",
            message: "Поле №2 (Хлопок): обнаружены признаки засухи. Рекомендуется увеличить полив.",
            time: "1 день назад",
            icon: AlertTriangle,
            color: "bg-red-50 text-red-600",
            borderColor: "border-red-200",
            unread: true
        },
        {
            id: 4,
            type: "yield",
            title: "Прогноз урожая обновлён",
            message: "Ожидаемый урожай пшеницы на Поле №1 увеличен до 4.5 т/га (+8%)",
            time: "1 день назад",
            icon: TrendingDown,
            color: "bg-emerald-50 text-emerald-600",
            borderColor: "border-emerald-200",
            unread: false
        },
        {
            id: 5,
            type: "application",
            title: "Заявка одобрена",
            message: "Ваша заявка на кредит $30,000 одобрена! Средства будут переведены в течение 2 дней.",
            time: "2 дня назад",
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600",
            borderColor: "border-emerald-200",
            unread: false
        },
        {
            id: 6,
            type: "documents",
            title: "Требуются документы",
            message: "Пожалуйста, загрузите подтверждение дохода для заявки №234",
            time: "3 дня назад",
            icon: FileText,
            color: "bg-purple-50 text-purple-600",
            borderColor: "border-purple-200",
            unread: false
        },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Уведомления</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {unreadCount > 0 ? `${unreadCount} новых` : "Все прочитаны"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                        Отметить все как прочитанные
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                        <div
                            key={notification.id}
                            className={`bg-white rounded-xl border-2 shadow-sm p-4 transition-all ${notification.unread
                                    ? `${notification.borderColor} shadow-md`
                                    : "border-slate-200"
                                }`}
                        >
                            <div className="flex gap-3">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${notification.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 text-sm">{notification.title}</h3>
                                        {notification.unread && (
                                            <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-1"></span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-2">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Clock className="w-3 h-3" />
                                        {notification.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {notifications.length === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="text-5xl mb-4">🔔</div>
                    <p className="text-slate-500">Нет уведомлений</p>
                </div>
            )}
        </div>
    );
}
