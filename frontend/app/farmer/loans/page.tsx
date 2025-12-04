"use client";

import { useState } from "react";
import {
    DollarSign,
    Calendar,
    X,
    CreditCard as CreditCardIcon,
    ArrowRight,
    Plus,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

// Типы для данных
interface Credit {
    id: number;
    amount: number;
    remaining: number;
    rate: number;
    dueDate: string;
    status: string;
    paid: number;
    progress: number;
    nextPayment: number;
}

interface Card {
    id: number;
    number: string;
    holder: string;
    type: string;
    balance: number;
}

export default function LoansPage() {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [paymentAmount, setPaymentAmount] = useState("");

    // Mock данные - в будущем подключить к API
    const loans: Credit[] = [
        {
            id: 1,
            amount: 50000,
            remaining: 35000,
            rate: 12,
            dueDate: "15 дек 2024",
            status: "active",
            paid: 15000,
            progress: 30,
            nextPayment: 2500,
        },
        {
            id: 2,
            amount: 30000,
            remaining: 5000,
            rate: 10,
            dueDate: "20 дек 2024",
            status: "active",
            paid: 25000,
            progress: 83,
            nextPayment: 1500,
        },
    ];

    const cards: Card[] = [
        { id: 1, number: "**** 4532", holder: "IVAN PETROV", type: "Visa", balance: 15000 },
        { id: 2, number: "**** 8765", holder: "IVAN PETROV", type: "MasterCard", balance: 8000 },
    ];

    const handleShowDetails = (credit: Credit) => {
        setSelectedCredit(credit);
        setShowDetailsModal(true);
    };

    const handleShowPayment = (credit: Credit) => {
        setSelectedCredit(credit);
        setShowPaymentModal(true);
        setPaymentAmount(credit.nextPayment.toString());
    };

    const handlePay = () => {
        if (!selectedCard || !paymentAmount || !selectedCredit) return;

        const card = cards.find(c => c.id === selectedCard);
        const amount = parseFloat(paymentAmount);

        if (card && card.balance >= amount) {
            alert(`Оплата $${amount} прошла успешно! Новый баланс карты: $${(card.balance - amount).toLocaleString()}`);
            setShowPaymentModal(false);
            setPaymentAmount("");
            setSelectedCard(null);
        } else {
            alert("Недостаточно средств на карте!");
        }
    };

    const getStatusColor = (status: string) => {
        if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (status === "overdue") return "bg-red-50 text-red-700 border-red-200";
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    return (
        <div className="p-4 space-y-4">
            {/* Loans List - отображает только активные кредиты */}
            <div className="space-y-3">
                {loans.map((loan) => (
                    <div key={loan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-slate-900">Кредит #{loan.id}</h3>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(loan.status)}`}>
                                    Активный
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-slate-900">${loan.amount.toLocaleString()}</div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Осталось</p>
                                    <p className="text-lg font-bold text-slate-900">${loan.remaining.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Следующий платёж</p>
                                    <p className="text-lg font-bold text-blue-600">${loan.nextPayment.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-slate-600">Прогресс</span>
                                    <span className="font-semibold text-slate-900">{loan.progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{ width: `${loan.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="w-4 h-4" />
                                Срок: {loan.dueDate}
                                <span className="ml-auto text-xs">Ставка: {loan.rate}%</span>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <button
                                    onClick={() => handleShowPayment(loan)}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Оплатить
                                </button>
                                <button
                                    onClick={() => handleShowDetails(loan)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Детали
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <Link href="/farmer/applications" className="flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200">
                    <span className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Подать новую заявку
                    </span>
                    <ArrowRight className="w-5 h-5" />
                </Link>

                <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3.5 rounded-xl text-sm font-medium transition-colors">
                    <TrendingUp className="w-4 h-4" />
                    Запросить увеличение лимита
                </button>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedCredit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Детали кредита #{selectedCredit.id}</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                                <p className="text-blue-100 text-sm mb-1">Общая сумма</p>
                                <p className="text-3xl font-bold">${selectedCredit.amount.toLocaleString()}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">Выплачено</p>
                                    <p className="text-lg font-bold text-emerald-600">${selectedCredit.paid.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">Осталось</p>
                                    <p className="text-lg font-bold text-orange-600">${selectedCredit.remaining.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-600">Процентная ставка</span>
                                    <span className="font-semibold">{selectedCredit.rate}%</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-600">Срок погашения</span>
                                    <span className="font-semibold">{selectedCredit.dueDate}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-600">Следующий платеж</span>
                                    <span className="font-semibold text-blue-600">${selectedCredit.nextPayment.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-slate-600">Прогресс</span>
                                    <span className="font-semibold">{selectedCredit.progress}%</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    handleShowPayment(selectedCredit);
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Оплатить кредит
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedCredit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full">
                        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold text-slate-900">Оплата кредита</h2>
                            <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-blue-700 mb-1">Кредит #{selectedCredit.id}</p>
                                <p className="text-2xl font-bold text-blue-900">${selectedCredit.remaining.toLocaleString()}</p>
                                <p className="text-xs text-blue-600 mt-1">Осталось к погашению</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Выберите карту
                                </label>
                                {cards.map((card) => (
                                    <button
                                        key={card.id}
                                        onClick={() => setSelectedCard(card.id)}
                                        className={`w-full text-left p-3 rounded-lg border-2 mb-2 transition-all ${selectedCard === card.id
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-slate-900">{card.type} {card.number}</p>
                                                <p className="text-xs text-slate-500">{card.holder}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-slate-900">${card.balance.toLocaleString()}</p>
                                                <p className="text-xs text-slate-500">Баланс</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Сумма оплаты ($)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Рекомендуемый платеж: ${selectedCredit.nextPayment.toLocaleString()}
                                </p>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={!selectedCard || !paymentAmount}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Оплатить ${paymentAmount || "0"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
