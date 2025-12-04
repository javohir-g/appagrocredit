"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    Mic,
    MicOff,
    Bot,
    User,
    Sparkles,
    TrendingUp,
    Droplets,
    DollarSign
} from "lucide-react";

export default function ChatPage() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Ассалому алейкум! Я ваш AI помощник. Могу помочь с вопросами о кредитах, полях, прогнозах урожая и агрономических рекомендациях. Чем могу помочь?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickActions = [
        { label: "Прогноз урожая", icon: TrendingUp, query: "Какой прогноз урожая на моих полях?" },
        { label: "Состояние поля", icon: Sparkles, query: "Какое состояние моих полей сейчас?" },
        { label: "Следующий платёж", icon: DollarSign, query: "Когда мой следующий платёж по кредиту?" },
        { label: "Рекомендация по поливу", icon: Droplets, query: "Когда нужно следующий раз поливать?" },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            role: "user" as const,
            content: input,
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                role: "assistant" as const,
                content: getAIResponse(input),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const handleQuickAction = (query: string) => {
        setInput(query);
    };

    const toggleVoiceMode = () => {
        setIsVoiceMode(!isVoiceMode);
        if (!isVoiceMode) {
            handleVoiceInput();
        }
    };

    const handleVoiceInput = () => {
        setIsListening(true);
        // Simulate voice recognition
        setTimeout(() => {
            setIsListening(false);
            setInput("Qachon sug'orish kerak?"); // Example voice command in Uzbek
        }, 2000);
    };

    const getAIResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes("урож") || lowerQuery.includes("прогноз")) {
            return "На основе спутниковых данных и ML-анал за, ожидается хороший урожай пшеницы - примерно 4.2 тонны с гектара. Это на 12% выше среднего показателя региона. Рекомендую продолжать текущий режим ухода.";
        }
        if (lowerQuery.includes("пол") || lowerQuery.includes("sug'orish")) {
            return "Рекомендую следующий полив через 2 дня. Прогноз погоды показывает сухую неделю. Оптимальное время для полива - раннее утро (5-7 часов) для минимизации испарения.";
        }
        if (lowerQuery.includes("кредит") || lowerQuery.includes("платёж")) {
            return "Ваш следующий платёж по активному кредиту: $2,500. Срок: 15 декабря 2024. Вы можете оплатить досрочно в разделе \"Мои кредиты\".";
        }
        if (lowerQuery.includes("состояние") || lowerQuery.includes("поле")) {
            return "Все ваши поля в хорошем состоянии. Поле №1 (пшеница): отлично - 92 балла. Поле №2 (хлопок): требует внимания - 68 баллов, рекомендую увеличить полив. Поле №3 (рис): хорошо - 85 баллов.";
        }

        return "Понял ваш вопрос. Для более точного ответа, пожалуйста, уточните детали. Вы можете спросить о кредитах, полях, прогнозе урожая, поливе или удобрениях.";
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px-56px)]">
            {/* Mode Toggle */}
            <div className="bg-white border-b border-slate-200 p-3">
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setIsVoiceMode(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${!isVoiceMode
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                    >
                        <Send className="w-4 h-4" />
                        Текст
                    </button>
                    <button
                        onClick={() => setIsVoiceMode(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isVoiceMode
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                    >
                        <Mic className="w-4 h-4" />
                        Голос
                    </button>
                </div>
            </div>

            {/* Messages */}
            {!isVoiceMode ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "assistant" ? "bg-emerald-100" : "bg-blue-100"
                                }`}>
                                {msg.role === "assistant" ? (
                                    <Bot className="w-5 h-5 text-emerald-600" />
                                ) : (
                                    <User className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                            <div className={`flex-1 ${msg.role === "user" ? "flex justify-end" : ""}`}>
                                <div className={`inline-block max-w-[85%] px-4 py-3 rounded-2xl ${msg.role === "assistant"
                                        ? "bg-slate-100 text-slate-900"
                                        : "bg-emerald-600 text-white"
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <p className={`text-xs mt-1 ${msg.role === "assistant" ? "text-slate-500" : "text-emerald-100"
                                        }`}>
                                        {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all ${isListening ? "bg-red-100 animate-pulse" : "bg-emerald-100"
                        }`}>
                        {isListening ? (
                            <Mic className="w-16 h-16 text-red-600" />
                        ) : (
                            <MicOff className="w-16 h-16 text-emerald-600" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        {isListening ? "Слушаю..." : "Нажмите, чтобы говорить"}
                    </h2>
                    <p className="text-sm text-slate-500 text-center mb-8">
                        {isListening ? "Говорите ваш вопрос..." : "Задайте вопрос голосом"}
                    </p>
                    <button
                        onClick={handleVoiceInput}
                        disabled={isListening}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${isListening
                                ? "bg-red-500 scale-110"
                                : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                            }`}
                    >
                        <Mic className="w-12 h-12 text-white" />
                    </button>
                    <p className="text-xs text-slate-400 mt-8 text-center max-w-xs">
                        Примеры команд: "Qachon sug'orish kerak?", "Когда следующий платёж?", "Состояние полей"
                    </p>
                </div>
            )}

            {/* Input Area (Text Mode Only) */}
            {!isVoiceMode && (
                <div className="bg-white border-t border-slate-200 p-4">
                    {/* Quick Actions */}
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleQuickAction(action.query)}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Введите ваш вопрос..."
                            className="flex-1 bg-slate-100 border-none rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-3 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
