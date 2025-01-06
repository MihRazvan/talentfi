import React from 'react';

export function Home() {
    return (
        <div className="relative">
            {/* Vertical Line */}
            <div className="fixed left-1/2 top-0 h-full -translate-x-1/2 z-10 pointer-events-none opacity-30">
                <img
                    src="/landing/line_vertical.png"
                    alt=""
                    className="h-full w-auto"
                />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen">
                <img
                    src="/landing/background1.png"
                    alt="AI Human Interaction"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />

                {/* Definition text */}
                <div className="absolute top-32 left-32 text-gray-800 max-w-md">
                    <h2 className="text-xl font-medium mb-3">nexon (noun) /'nɛk.sɒn/</h2>
                    <p className="text-base leading-relaxed opacity-80">
                        A coined term combining "Next" (future, progress) and "On" (activation & momentum),
                        symbolizing talent discovery and innovation.
                    </p>
                </div>

                {/* Center Logo and Heading */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
                    <img
                        src="/landing/nexon_logo.png"
                        alt="Nexon"
                        className="w-[600px] mx-auto mb-16"
                    />
                    <div className="relative inline-block">
                        <h1 className="text-7xl italic bg-white/95 px-16 py-8 font-playfair">
                            Where AI meets human potential.
                        </h1>
                    </div>
                    <img
                        src="/landing/arrow1.png"
                        alt="Scroll down"
                        className="mx-auto w-8 mt-16 animate-bounce"
                    />
                </div>
            </section>

            {/* Stairs Element */}
            <div className="relative h-32">
                <img
                    src="/landing/stairs_element.png"
                    alt=""
                    className="absolute left-1/2 -translate-x-1/2 w-full"
                />
            </div>

            {/* Features Section */}
            <section className="relative min-h-screen bg-white py-32">
                <div className="max-w-[1400px] mx-auto grid grid-cols-2 gap-24">
                    {/* Left column - Feature cards */}
                    <div className="space-y-12 pl-32">
                        <div className="bg-white rounded-sm p-8 shadow-lg border-l-4 border-purple-500">
                            <h3 className="text-2xl font-medium flex items-center mb-4">
                                AI-Driven
                                <img src="/landing/3stars_purple.png" alt="" className="h-5 ml-3" />
                            </h3>
                            <p className="italic text-lg text-gray-700">
                                Continuous talent scanning and analysis<br />
                                based on real achievements.
                            </p>
                        </div>

                        <div className="bg-white rounded-sm p-8 shadow-lg border-l-4 border-blue-500">
                            <h3 className="text-2xl font-medium flex items-center mb-4">
                                Blockchain-Powered
                                <img src="/landing/3stars_nobg.png" alt="" className="h-5 ml-3" />
                            </h3>
                            <p className="italic text-lg text-gray-700">
                                Transparent, fair investment mechanisms<br />
                                through creator tokens.
                            </p>
                        </div>

                        <div className="bg-white rounded-sm p-8 shadow-lg border-l-4 border-turquoise-500">
                            <h3 className="text-2xl font-medium flex items-center mb-4">
                                Creator-Centric
                                <img src="/landing/3stars_tourqoise.png" alt="" className="h-5 ml-3" />
                            </h3>
                            <p className="italic text-lg text-gray-700">
                                Designed to empower creators with tools<br />
                                and funding for long-term growth.
                            </p>
                        </div>
                    </div>

                    {/* Right column - Circular images */}
                    <div className="relative pr-32">
                        <div className="sticky top-32">
                            <img
                                src="/landing/circleimage1.png"
                                alt="Circle 1"
                                className="w-[500px] h-[500px] rounded-full object-cover"
                            />
                            <img
                                src="/landing/circleimage2.png"
                                alt="Circle 2"
                                className="w-[250px] h-[250px] rounded-full object-cover absolute -bottom-12 -left-12"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Section */}
            <section className="relative py-32 text-center bg-white">
                <img
                    src="/landing/3stars_purple.png"
                    alt=""
                    className="absolute top-0 left-32 h-24"
                />
                <img
                    src="/landing/3stars_tourqoise.png"
                    alt=""
                    className="absolute top-0 right-32 h-24"
                />

                <p className="text-3xl mb-12">
                    Discover the stars of tomorrow and be part of their journey.
                </p>
                <p className="text-xl mb-8 opacity-80">powered by</p>
                <div className="flex justify-center items-center space-x-16 mb-16">
                    <img src="/landing/zksync_logo.png" alt="ZKSync" className="h-8" />
                    <img src="/landing/lens_logo.png" alt="Lens" className="h-8" />
                    <img src="/landing/avail_logo.png" alt="Avail" className="h-8" />
                    <img src="/landing/openai_logo.png" alt="OpenAI" className="h-8" />
                    <img src="/landing/github_logo.png" alt="GitHub" className="h-8" />
                </div>

                <img
                    src="/landing/arrow_up.png"
                    alt="Back to top"
                    className="mx-auto w-8 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                />
            </section>
        </div>
    );
}