import React from 'react';
import { useParams } from 'react-router-dom';
import { Share2, Heart } from 'lucide-react';
import { mockCreators } from '../data/creators';
import { Layout } from '../components/Layout';

export function Profile() {
    const { handle } = useParams();
    const creator = mockCreators.find(c => c.handle.replace('@', '') === handle);

    if (!creator) {
        return <div>Creator not found</div>;
    }

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Gradient Background */}
                <div className="h-32 nexon-gradient" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {/* Profile Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center">
                                <img
                                    src={creator.avatar}
                                    alt={creator.name}
                                    className="w-24 h-24 rounded-full"
                                />
                                <div className="ml-6">
                                    <div className="flex items-center">
                                        <h1 className="text-2xl font-medium">{creator.handle}</h1>
                                        {creator.verified && (
                                            <span className="ml-2 text-blue-500">✓</span>
                                        )}
                                    </div>
                                    <p className="text-lg text-gray-600">{creator.name}</p>
                                    <p className="text-sm text-gray-500">${creator.price.toFixed(2)} balance</p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Token Purchase */}
                        <div className="border rounded-lg p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium">Purchase Creator Tokens</h2>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">{creator.tokenSymbol}</span>
                                    <span className="text-sm font-medium">(${creator.price.toFixed(2)})</span>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    placeholder="Amount"
                                    className="flex-1 border rounded-lg px-4 py-2"
                                />
                                <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    BUY
                                </button>
                                <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                    SELL
                                </button>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-12">
                            <h2 className="text-lg font-medium mb-4">BIO</h2>
                            <p className="text-gray-600 italic leading-relaxed">
                                {creator.bio || `${creator.name} has demonstrated strong expertise in blockchain
                development with a focus on Solidity and Rust, suitable for
                various web3 projects. Their experience in MEV, Layer 2
                solutions, and Proof of Stake can add substantial value to
                decentralized applications and protocols.`}
                            </p>
                        </div>

                        {/* Metrics */}
                        <div className="border-t pt-8">
                            <div className="grid grid-cols-5 gap-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl mx-auto">
                                        {creator.metrics?.github || 8}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">github<br />metrics</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl mx-auto">
                                        {creator.metrics?.technical || 9}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">technical<br />expertise</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl mx-auto">
                                        {creator.metrics?.web3 || 9}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">web3<br />expertise</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl mx-auto">
                                        {creator.metrics?.community || 7}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">community<br />influence</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl mx-auto">
                                        {creator.metrics?.growth || 8}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">growth<br />potential</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}