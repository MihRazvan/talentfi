import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Share2, Heart, Globe, Github } from 'lucide-react';
import { useCreatorData } from '../hooks/useCreatorData';
import { useTrading } from '../hooks/useTrading';

const Profile = () => {
    const { username } = useParams();
    const { creators, loading, error } = useCreatorData();
    const { buyTokens, sellTokens, isLoading: tradingLoading, error: tradingError } = useTrading();
    const [amount, setAmount] = useState('');

    const creator = creators.find(c => c.username === username);

    const handleBuy = async () => {
        if (!amount || !creator?.token_address) return;
        await buyTokens(creator.token_address, amount);
        setAmount('');
    };

    const handleSell = async () => {
        if (!amount || !creator?.token_address) return;
        await sellTokens(creator.token_address, amount);
        setAmount('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !creator) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {error || 'Creator not found'}
                </div>
            </div>
        );
    }

    const metrics = [
        { label: 'github metrics', value: 8 },
        { label: 'technical expertise', value: 9 },
        { label: 'web3 expertise', value: 9 },
        { label: 'community influence', value: 7 },
        { label: 'growth potential', value: 8 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-cyan-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <img
                                src={`https://avatars.githubusercontent.com/${creator.username}`}
                                alt={creator.username}
                                className="w-16 h-16 rounded-full border-2 border-slate-100"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://github.com/identicons/icon.png';
                                }}
                            />
                            <div>
                                <h1 className="text-2xl font-medium text-slate-900">@{creator.username}</h1>
                                <div className="flex items-center space-x-2 mt-1">
                                    <a href={creator.analysis.github_url} className="text-sm text-slate-500 hover:text-slate-700 flex items-center">
                                        <Github className="w-4 h-4 mr-1" />
                                        GitHub
                                    </a>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-sm text-slate-500 flex items-center">
                                        <Globe className="w-4 h-4 mr-1" />
                                        Web3 Developer
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 rounded-full hover:bg-slate-100">
                                <Share2 className="w-5 h-5 text-slate-600" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-slate-100">
                                <Heart className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {/* Token Purchase */}
                    <div className="px-6 py-4 border-y border-slate-100 bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-900">Purchase Creator Tokens</h3>
                                <p className="text-sm text-slate-500">
                                    ${creator.tokenData?.symbol} (${creator.tokenData?.price.toFixed(2)})
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Amount"
                                    className="w-32 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                <button
                                    onClick={handleBuy}
                                    disabled={tradingLoading}
                                    className="px-4 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 disabled:opacity-50"
                                >
                                    {tradingLoading ? 'Processing...' : 'Buy'}
                                </button>
                                <button
                                    onClick={handleSell}
                                    disabled={tradingLoading}
                                    className="px-4 py-1.5 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 disabled:opacity-50"
                                >
                                    {tradingLoading ? 'Processing...' : 'Sell'}
                                </button>
                            </div>
                        </div>
                        {tradingError && (
                            <p className="mt-2 text-sm text-red-600">{tradingError}</p>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-slate-900 mb-3">BIO</h2>
                        <div className="space-y-4 text-slate-600">
                            {creator.analysis.investment_thesis.map((thesis, i) => (
                                <p key={i} className="text-sm">{thesis}</p>
                            ))}
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="p-6 border-t border-slate-100">
                        <div className="grid grid-cols-5 gap-4">
                            {metrics.map((metric, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-black text-white flex items-center justify-center text-xl font-medium">
                                        {metric.value}
                                    </div>
                                    <p className="text-xs text-slate-500">{metric.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Chart */}
                    <div className="p-6 border-t border-slate-100">
                        <h2 className="text-lg font-medium text-slate-900 mb-4">Price History</h2>
                        <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                            Chart coming soon
                        </div>
                    </div>

                    {/* Token Holders */}
                    <div className="p-6 border-t border-slate-100">
                        <h2 className="text-lg font-medium text-slate-900 mb-4">Token Holders</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-slate-500">
                                        <th className="pb-3 font-medium">USERNAME</th>
                                        <th className="pb-3 font-medium">AVG PRICE</th>
                                        <th className="pb-3 font-medium">VALUE</th>
                                        <th className="pb-3 font-medium">TICKER</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr>
                                        <td className="py-2">@{creator.username}</td>
                                        <td>${creator.tokenData?.price.toFixed(2)}</td>
                                        <td>${(creator.tokenData?.price || 0 * 1000).toFixed(2)}</td>
                                        <td>{creator.tokenData?.symbol}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
