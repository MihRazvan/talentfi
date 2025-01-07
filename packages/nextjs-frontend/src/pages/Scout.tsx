import React, { useState } from 'react';
import { CreatorType, inputConfigs } from '../types/creator';
import { Layout } from '../components/Layout';

const categories: CreatorType[] = ['Developer', 'NFT-Creator', 'Musician', 'Trader'];

export function Scout() {
    const [selectedCategory, setSelectedCategory] = useState<CreatorType>('Developer');
    const [inputValue, setInputValue] = useState('');

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Gradient Banner */}
                <div className="h-32">
                    <img
                        src="/footer_background.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info Section */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl font-playfair mb-8">Discover Talent, Earn Rewards</h1>
                    <p className="text-xl text-gray-600 mb-12">
                        Become a talent scout and shape the future of creativity. By manually adding rising stars -
                        whether developers, NFT-Creators, musicians or traders - you help them shine on the discover page.
                    </p>

                    <div className="mb-16">
                        <h2 className="text-2xl font-medium mb-6">How It Works</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium">1. Spot Talent:</h3>
                                <p>Add promising creators to the platform.</p>
                            </div>
                            <div>
                                <h3 className="font-medium">2. AI Review:</h3>
                                <p>Our system validates their profile.</p>
                            </div>
                            <div>
                                <h3 className="font-medium">3. Earn Rewards:</h3>
                                <p>When they claim their profile via nexon, you earn a Scout Reward (SR) - 2% of trading revenue.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-16">
                        <h2 className="text-2xl font-medium mb-6">Win-Win for Everyone</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-medium mb-2">Scouts:</h3>
                                <p>Share in the success of the creators you discover.</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Creators:</h3>
                                <p>Keep 10% of trading revenue with the Creator Rewards (CR).</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-playfair mb-8">
                        Start scouting today and turn your eye for talent into tangible rewards!
                    </h2>

                    <img src="/scout/arrow1.png" alt="" className="w-8 mx-auto mb-16" />
                </div>

                {/* Colored Stairs Divider */}
                <div className="relative h-32 mb-16">
                    <img
                        src="/scout/coloredstairs_upsidedown.png"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Scout Form */}
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
                    {/* Category Selection */}
                    <div className="mb-12">
                        <h2 className="text-xl font-medium mb-6">Select category</h2>
                        <div className="flex justify-center space-x-6">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-3 rounded-full ${selectedCategory === category
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="mb-12">
                        <h2 className="text-xl font-medium mb-6">{inputConfigs[selectedCategory].label}</h2>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={inputConfigs[selectedCategory].placeholder}
                            className="w-full px-4 py-3 border rounded-lg text-center"
                        />
                    </div>

                    {/* Verify Button */}
                    <button className="w-48 py-3 nexon-gradient text-white rounded-lg mb-8">
                        verify
                    </button>

                    <p className="text-gray-500 mb-8">Waiting for verification...</p>

                    {/* Submit Button */}
                    <button disabled className="px-8 py-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed">
                        add creator
                    </button>
                </div>
            </div>
        </Layout>
    );
}