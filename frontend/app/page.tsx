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
    Quote
} from "lucide-react";

export default function HomePage() {
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
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
                        <a href="#technology" className="hover:text-emerald-600 transition-colors">Technology</a>
                        <a href="#testimonials" className="hover:text-emerald-600 transition-colors">Success Stories</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-slate-600 hover:text-slate-900 font-medium text-sm hidden sm:block">Log in</button>
                        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                            Get Started
                        </button>
                    </div>
                </div>
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
                        Revolutionizing Agricultural Finance
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-tight max-w-4xl mx-auto">
                        Bridging the Gap Between <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Farmers & Capital</span>
                    </h1>

                    <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        We use satellite imagery and machine learning to provide instant, data-driven credit assessments, empowering farmers and securing bank portfolios.
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
                                <span>I am a Farmer</span>
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
                                <span>I am a Bank Officer</span>
                            </div>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto">
                        <p className="text-sm text-slate-400 font-medium mb-6 uppercase tracking-wider">Trusted by agricultural leaders</p>
                        <div className="flex justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Mock Logos */}
                            <div className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 rounded-full"></div> AgriBank</div>
                            <div className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 rounded-md"></div> FarmCo</div>
                            <div className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 transform rotate-45"></div> GreenField</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why AgroCredit AI?</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our platform serves the unique needs of both agricultural producers and financial institutions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Farmer Card */}
                        <div className="group p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Sprout className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">For Farmers</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                    <span className="text-slate-600">Get fair credit scores based on field potential, not just history.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                    <span className="text-slate-600">Access capital faster with automated, data-driven approvals.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                    <span className="text-slate-600">Receive actionable insights to improve crop health and yield.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Bank Card */}
                        <div className="group p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Landmark className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">For Banks</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                    <span className="text-slate-600">Reduce NPLs with accurate, AI-powered risk assessment.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                    <span className="text-slate-600">Monitor portfolio health in real-time with satellite updates.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                    <span className="text-slate-600">Expand lending to underserved regions with confidence.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section id="technology" className="py-24 bg-slate-900 text-white overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
                                Powered by Advanced AI
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Seeing the Unseen with <br />
                                <span className="text-emerald-400">Satellite Intelligence</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Our proprietary algorithms analyze multi-spectral satellite imagery to calculate NDVI (Normalized Difference Vegetation Index), assessing crop health, moisture levels, and growth patterns with precision.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                    <Satellite className="w-8 h-8 text-blue-400 mb-3" />
                                    <h4 className="font-semibold text-lg mb-1">Remote Sensing</h4>
                                    <p className="text-sm text-slate-400">Daily field monitoring from space.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                    <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                                    <h4 className="font-semibold text-lg mb-1">Instant Scoring</h4>
                                    <p className="text-sm text-slate-400">Real-time creditworthiness checks.</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 aspect-video group">
                                {/* Abstract Map Visualization */}
                                <div className="absolute inset-0 bg-slate-900">
                                    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/30 rounded-full blur-xl animate-pulse"></div>
                                    <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
                                </div>

                                {/* Floating UI Elements */}
                                <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-xs font-medium text-emerald-400">Live Analysis</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white">Score: 85/100</div>
                                    <div className="text-xs text-slate-400">Low Risk • High Yield Potential</div>
                                </div>

                                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl transform group-hover:translate-y-2 transition-transform duration-500">
                                    <div className="flex gap-4 text-center">
                                        <div>
                                            <div className="text-xs text-slate-400 uppercase">NDVI</div>
                                            <div className="text-lg font-bold text-emerald-400">0.72</div>
                                        </div>
                                        <div className="w-px bg-slate-700"></div>
                                        <div>
                                            <div className="text-xs text-slate-400 uppercase">Moisture</div>
                                            <div className="text-lg font-bold text-blue-400">High</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-emerald-50/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
                        <p className="text-lg text-slate-600">See how AgroCredit AI is transforming lives.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                quote: "I was rejected by three banks because I didn't have paperwork. AgroCredit looked at my field's history and approved me in minutes.",
                                author: "John K.",
                                role: "Wheat Farmer",
                                image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=100"
                            },
                            {
                                quote: "This platform has completely revolutionized our agricultural lending portfolio. We've reduced our risk exposure by 40%.",
                                author: "Sarah M.",
                                role: "Loan Officer",
                                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
                            },
                            {
                                quote: "The field insights help me not just with loans, but with managing my crops better. It's a win-win tool.",
                                author: "David R.",
                                role: "Corn Producer",
                                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <Quote className="w-8 h-8 text-emerald-200 mb-4" />
                                <p className="text-slate-600 mb-6 italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                        {/* Placeholder for avatar if image fails to load */}
                                        <div className="w-full h-full bg-slate-300"></div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{testimonial.author}</div>
                                        <div className="text-xs text-slate-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-emerald-900 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Transform Your Agricultural Finance?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => {
                                localStorage.setItem('userRole', 'farmer');
                                window.location.href = '/farmer/dashboard';
                            }}
                            className="px-8 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Sprout className="w-5 h-5 text-emerald-500" />
                                <span className="text-lg font-bold text-white">AgroCredit AI</span>
                            </div>
                            <p className="text-sm">Empowering agriculture through artificial intelligence and satellite data.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-emerald-400">Features</a></li>
                                <li><a href="#" className="hover:text-emerald-400">Pricing</a></li>
                                <li><a href="#" className="hover:text-emerald-400">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-emerald-400">About Us</a></li>
                                <li><a href="#" className="hover:text-emerald-400">Careers</a></li>
                                <li><a href="#" className="hover:text-emerald-400">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-emerald-400">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-emerald-400">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-sm">
                        © 2024 AgroCredit AI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
