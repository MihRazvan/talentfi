import React, { useState } from 'react';
import { CreatorType, inputConfigs } from '../types/creator';
import { Layout } from '../components/Layout';

const categories: CreatorType[] = ['Developer', 'NFT-Creator', 'Musician', 'Trader'];

export function Register() {
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

                {/* Main Content */}
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl font-playfair mb-2">Join Nexon</h1>
                    <p className="text-xl text-gray-600 mb-12">Become part of the next generation of creators</p>

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

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                        <button disabled className="px-8 py-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed">
                            register
                        </button>
                        <button disabled className="px-8 py-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed">
                            claim
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}