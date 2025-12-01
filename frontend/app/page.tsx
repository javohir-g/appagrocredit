"use client";

import Link from "next/link";
import {
    Sprout,
    Landmark,
    Satellite,
    BarChart3,
    ShieldCheck,
    Zap,
    ArrowRight,
    CheckCircle2,
    Quote,
    Linkedin,
    Send,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">AgroCredit <span className="text-emerald-600">AI</span></span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">Как это работает</a>
                        <a href="#why-us" className="hover:text-emerald-600 transition-colors">Почему мы</a>
                        <a href="#contacts" className="hover:text-emerald-600 transition-colors">Контакты</a>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => {
                                localStorage.setItem('userRole', 'bank_officer');
                                window.location.href = '/bank/dashboard';
                            }}
                            className="text-slate-600 hover:text-slate-900 font-medium text-sm"
                        >
                            Вход для банков
                        </button>
                        <button
                            onClick={() => {
                                localStorage.setItem('userRole', 'farmer');
                                window.location.href = '/farmer/dashboard';
                            }}
                            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                        >
                            Подать заявку
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-lg">
                        <a href="#how-it-works" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Как это работает</a>
                        <a href="#why-us" className="text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Почему мы</a>
                        <button
                            onClick={() => {
                                localStorage.setItem('userRole', 'farmer');
                                window.location.href = '/farmer/dashboard';
                            }}
                            className="bg-emerald-600 text-white px-5 py-3 rounded-lg text-center font-medium"
                        >
                            Подать заявку
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
                </div>

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

                    {/* Hero Image / Illustration Placeholder */}
                    <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video group">
                        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1625246333195-58197bd47d26?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        
                        {/* Floating UI Elements (Mockup) */}
                        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-left max-w-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <Satellite className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm font-medium text-blue-200">Спутниковый анализ</span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">Поле №4: Пшеница</div>
                                <div className="text-emerald-400 font-medium">Прогноз урожайности: Высокий</div>
                            </div>

                            <div className="bg-emerald-600/90 backdrop-blur-md p-6 rounded-xl border border-emerald-500/50 text-left shadow-lg shadow-emerald-900/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="w-5 h-5 text-yellow-300" />
                                    <span className="text-sm font-medium text-emerald-100">Кредитный рейтинг</span>
                                </div>
                                <div className="text-4xl font-bold text-white">92/100</div>
                                <div className="text-emerald-100 text-sm mt-1">Одобрено ИИ</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Как это работает</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Простой путь к финансированию вашего агробизнеса
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Быстрый и точный скоринг</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Наш ИИ анализирует множество данных: урожайность, погодные условия и рыночные тенденции для расчета надежного рейтинга.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Индивидуальные решения</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Получите персонализированные предложения кредитов с учетом потребностей вашей фермы и платежеспособности.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Прозрачность и честность</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Решения на основе ИИ минимизируют человеческий фактор и обеспечивают равный доступ к финансам.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Send className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Простая подача заявки</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Отправьте данные о ферме и финансовые сведения онлайн и получите мгновенное предварительное одобрение.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why AgroCredit AI Section */}
            <section id="why-us" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему AgroCredit AI?</h2>
                        <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="flex gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                <Sprout className="w-7 h-7 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-white">Оптимизировано для сельского хозяйства</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Создано специально для фермеров и агробизнеса, учитывая специфику сезонности и рисков.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-white">Снижение рисков для кредиторов</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    ИИ прогнозирует вероятность возврата кредита с высокой точностью, защищая капитал.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                                <Landmark className="w-7 h-7 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-white">Помощь фермерам</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Быстрый доступ к финансам для развития бизнеса без лишней бюрократии.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-7 h-7 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-white">Аналитика на основе данных</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    ИИ рекомендует лучшие финансовые решения, основываясь на объективных показателях вашей фермы.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-emerald-50">
                <div className="container mx-auto px-6">
                    <div className="bg-emerald-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        {/* Background blobs */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Начните сегодня</h2>
                            <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
                                Подайте заявку за считанные минуты и позвольте AgroCredit AI помочь вашей ферме расти.
                            </p>
                            <button
                                onClick={() => {
                                    localStorage.setItem('userRole', 'farmer');
                                    window.location.href = '/farmer/dashboard';
                                }}
                                className="px-10 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all hover:scale-105 shadow-xl"
                            >
                                Подать заявку
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                    <Sprout className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">AgroCredit <span className="text-emerald-600">AI</span></span>
                            </div>
                            <p className="text-slate-500 max-w-sm">
                                Умные финансовые решения для современного сельского хозяйства. Объединяем технологии и капитал для роста вашего бизнеса.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Компания</h4>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">О компании</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Контакты</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Правовая информация</h4>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Политика конфиденциальности</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Условия использования</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-slate-500">
                            © 2024 AgroCredit AI. Все права защищены.
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                                <Send className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
