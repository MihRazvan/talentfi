import React from 'react';
import { Asterisk } from 'lucide-react';

export function Home() {
    return (
        <div className="relative">
            {/* Hero Section */}
            <div className="relative min-h-[80vh] flex items-center">
                <div className="absolute inset-0 nexon-gradient opacity-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-6xl font-bold mb-6">
                            Where AI meets human potential.
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Discover the stars of tomorrow and be part of their journey.
                        </p>
                        <button className="nexon-button text-lg px-8 py-3">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>

            {/* Value Props */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="nexon-card">
                            <div className="flex items-center mb-4">
                                <Asterisk className="h-6 w-6 text-[#FF7E6B] mr-2" />
                                <h3 className="text-xl font-semibold">AI-Driven</h3>
                            </div>
                            <p className="text-gray-600">
                                Continuous talent scanning and analysis based on real achievements.
                            </p>
                        </div>

                        <div className="nexon-card">
                            <div className="flex items-center mb-4">
                                <Asterisk className="h-6 w-6 text-[#FFD700] mr-2" />
                                <h3 className="text-xl font-semibold">Blockchain-Powered</h3>
                            </div>
                            <p className="text-gray-600">
                                Transparent, fair investment mechanisms through creator tokens.
                            </p>
                        </div>

                        <div className="nexon-card">
                            <div className="flex items-center mb-4">
                                <Asterisk className="h-6 w-6 text-[#40E0D0] mr-2" />
                                <h3 className="text-xl font-semibold">Creator-Centric</h3>
                            </div>
                            <p className="text-gray-600">
                                Designed to empower creators with tools and funding for long-term growth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Powered By Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center text-2xl font-semibold mb-12">powered by</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60">
                        <img src="https://raw.githubusercontent.com/matter-labs/zksync-web-v2-docs/main/docs/images/logo.png" alt="ZKSync" className="h-8" />
                        <img src="https://lens.xyz/logo.svg" alt="Lens" className="h-8" />
                        <img src="https://availproject.org/images/logo.svg" alt="Avail" className="h-8" />
                        <img src="https://openai.com/favicon.ico" alt="OpenAI" className="h-8" />
                        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png" alt="GitHub" className="h-8" />
                    </div>
                </div>
            </div>
        </div>
    );
}