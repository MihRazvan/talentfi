import React from 'react';
import { Link } from 'react-router-dom';
import { Asterisk } from 'lucide-react';

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

                    <p className="text-xl md:text-2xl text-slate-300 mb-12 font-serif italic">
                        Where AI meets human potential.
                    </p>

                    <Link
                        to="/discover"
                        className="inline-flex items-center px-8 py-3 rounded-full bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-all"
                    >
                        Start Discovering
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent" />
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100">
                            <h3 className="text-xl font-medium mb-4 flex items-center space-x-2">
                                <Asterisk className="w-5 h-5 text-indigo-500" />
                                <span>AI-Driven</span>
                            </h3>
                            <p className="text-slate-600 font-serif italic">
                                Continuous talent scanning and analysis based on real achievements.
                            </p>
                        </div>

                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100">
                            <h3 className="text-xl font-medium mb-4 flex items-center space-x-2">
                                <Asterisk className="w-5 h-5 text-indigo-500" />
                                <span>Blockchain-Powered</span>
                            </h3>
                            <p className="text-slate-600 font-serif italic">
                                Transparent, fair investment mechanisms through creator tokens.
                            </p>
                        </div>

                        <div className="p-8 rounded-xl bg-slate-50 border border-slate-100">
                            <h3 className="text-xl font-medium mb-4 flex items-center space-x-2">
                                <Asterisk className="w-5 h-5 text-indigo-500" />
                                <span>Creator-Centric</span>
                            </h3>
                            <p className="text-slate-600 font-serif italic">
                                Designed to empower creators with tools and funding for long-term growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Powered By Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-light mb-12 text-slate-600">powered by</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60">
                        <img src="https://zksync.io/images/logo.svg" alt="ZKSync" className="h-8" />
                        <img src="https://lens.xyz/logo.svg" alt="Lens" className="h-8" />
                        <img src="https://avail.global/logo.svg" alt="Avail" className="h-8" />
                        <img src="https://openai.com/logo.svg" alt="OpenAI" className="h-8" />
                        <img src="https://github.com/logo.svg" alt="GitHub" className="h-8" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;