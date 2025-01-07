import React from 'react';
import { Link } from 'react-router-dom';
import { Asterisk, ArrowRight, Sparkles, Target, Users, Zap, Shield, Coins, BarChart } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-8">
                        <Asterisk className="w-24 h-24 text-indigo-500 animate-pulse" />
                    </div>

                    <h1 className="text-6xl md:text-8xl font-light text-white mb-8 tracking-tight">
                        nexon
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-6 font-serif italic max-w-2xl mx-auto">
                        nexon (noun) /ˈnɛk.sɒn/ A coined term combining "Next" (future, progress) and "On" (activation, momentum),
                        symbolizing talent discovery and innovation.
                    </p>

                    <Link
                        to="/discover"
                        className="inline-flex items-center px-8 py-3 rounded-full bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-all"
                    >
                        Discover Talent - Futures Market
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent" />
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-medium text-slate-900 mb-4">Revolutionizing Talent Discovery</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A decentralized marketplace where talent meets opportunity through innovative tokenization and AI-driven analytics.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-medium mb-4 text-slate-900">AI-Powered Analysis</h3>
                            <p className="text-slate-600">
                                Advanced algorithms analyze creator potential, market fit, and growth trajectory for informed investment decisions.
                            </p>
                        </div>

                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-6">
                                <Coins className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-medium mb-4 text-slate-900">Creator Tokens</h3>
                            <p className="text-slate-600">
                                Invest early in promising talent through our innovative creator token system backed by smart contracts.
                            </p>
                        </div>

                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-6">
                                <BarChart className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-medium mb-4 text-slate-900">Market Analytics</h3>
                            <p className="text-slate-600">
                                Real-time market data, performance metrics, and trend analysis for optimal portfolio management.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-light text-indigo-500 mb-2">$2.4M</div>
                            <div className="text-sm text-slate-600">Total Volume</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-light text-indigo-500 mb-2">12.5K</div>
                            <div className="text-sm text-slate-600">Active Investors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-light text-indigo-500 mb-2">850+</div>
                            <div className="text-sm text-slate-600">Creator Tokens</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-light text-indigo-500 mb-2">94%</div>
                            <div className="text-sm text-slate-600">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-medium mb-8">Ready to Join the Future of Talent Discovery?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/discover"
                            className="px-8 py-3 rounded-full bg-white text-indigo-600 font-medium hover:bg-indigo-50 transition-all"
                        >
                            Discover Talent - Futures Market
                        </Link>
                        <Link
                            to="/discover"
                            className="px-8 py-3 rounded-full bg-indigo-400 text-white font-medium hover:bg-indigo-300 transition-all"
                        >
                            Browse Creators
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;