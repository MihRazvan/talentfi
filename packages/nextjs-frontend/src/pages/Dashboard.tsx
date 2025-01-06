import React from 'react';
import { Link } from 'react-router-dom';
import { Search, LogIn, ArrowUpDown, Heart } from 'lucide-react';
import { CreatorType, inputConfigs } from '../types/creator';

const categories = ['Featured', 'Developers', 'NFT-Creators', 'Musicians', 'Traders'];

interface CreatorCard {
    id: string;
    handle: string;
    name: string;
    avatar: string;
    price: number;
    skills: string[];
    verified?: boolean;
    tokenSymbol: string;
}

const mockCreators: CreatorCard[] = [
    {
        id: '1',
        handle: '@arachnid',
        name: 'Nick Johnson',
        avatar: '/dashboard/creator1.png',
        price: 400.81,
        tokenSymbol: '$ARCH',
        skills: ['Solidity development', 'EVM expertise', 'Deterministic Contracts', 'DAO leadership'],
        verified: true
    },
    {
        id: '2',
        handle: '@gkakon1',
        name: 'Georgios Konstantopoulos',
        avatar: '/dashboard/creator2.png',
        price: 210.50,
        tokenSymbol: '$GAKO',
        skills: ['MEV expertise', 'Layer 2 solutions', 'Protocol knowledge'],
        verified: true
    },
    {
        id: '3',
        handle: '@pcaversaccio',
        name: 'Pascal Caversaccio',
        avatar: '/dashboard/creator3.png',
        price: 325.62,
        tokenSymbol: '$PCAV',
        skills: ['Security Research', 'DeFi Tooling', 'Educational Content'],
        verified: true
    },
    {
        id: '4',
        handle: '@frangio',
        name: 'Francisco Giordano',
        avatar: '/dashboard/creator4.png',
        price: 180.50,
        tokenSymbol: '$FRAG',
        skills: ['OS Collaboration', 'Testing Infrastructure', 'Protocol Design'],
        verified: true
    }
];

const recentActivity = [
    {
        id: '1',
        type: 'Support',
        creator: '@gakonst',
        buyer: 'Anon',
        token: '$GAKO',
        price: 89.6,
        time: '20s ago',
        avatar: '/dashboard/creator2.png'
    },
    {
        id: '2',
        type: 'Support',
        creator: '@arachnid',
        buyer: 'Anon',
        token: '$ARCH',
        price: 4.81,
        time: '35s ago',
        avatar: '/dashboard/creator1.png'
    },
    {
        id: '3',
        type: 'Support',
        creator: '@pcaversaccio',
        buyer: 'Anon',
        token: '$PCAV',
        price: 3.78,
        time: '35s ago',
        avatar: '/dashboard/creator3.png'
    },
    {
        id: '4',
        type: 'Sell',
        creator: '@frangio',
        buyer: 'Anon',
        token: '$FRAG',
        price: 1.08,
        time: '1m ago',
        avatar: '/dashboard/creator4.png'
    },
    {
        id: '5',
        type: 'Support',
        creator: '@gakonst',
        buyer: 'Anon',
        token: '$GAKO',
        price: 10.00,
        time: '2m ago',
        avatar: '/dashboard/creator2.png'
    }
];

const topVolume = [
    { id: '1', volume: 6411511, rank: 1 },
    { id: '2', volume: 4527199, rank: 2 },
    { id: '3', volume: 4466024, rank: 3 },
    { id: '4', volume: 4188682, rank: 4 },
    { id: '5', volume: 2659910, rank: 5 },
    { id: '6', volume: 2464080, rank: 6 },
    { id: '7', volume: 2176097, rank: 7 },
    { id: '8', volume: 2151881, rank: 8 },
    { id: '9', volume: 1952912, rank: 9 },
    { id: '10', volume: 1807869, rank: 10 }
];

export function Dashboard() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/">
                            <img src="/nexon_black_logo.png" alt="Nexon" className="h-8" />
                        </Link>

                        {/* Categories */}
                        <div className="flex space-x-8">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`px-4 py-2 text-sm font-medium ${category === 'Featured'
                                        ? 'text-black border-b-2 border-black'
                                        : 'text-gray-500 hover:text-black'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Search and Actions */}
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search Creators"
                                    className="pl-10 pr-4 py-2 w-64 border rounded-lg text-sm"
                                />
                            </div>
                            <div className="flex items-center space-x-6">
                                <Link to="/scout" className="text-sm font-medium hover:text-gray-900">scout</Link>
                                <Link to="/register" className="text-sm font-medium hover:text-gray-900">register</Link>
                                <Link to="/login" className="flex items-center space-x-1 text-sm font-medium hover:text-gray-900">
                                    <span>login</span>
                                    <LogIn className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with Background */}
            <div className="relative">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/dashboard/background2.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-3 gap-6 mb-16">
                        {/* Creator Cards */}
                        <div className="col-span-2 grid grid-cols-2 gap-6">
                            {mockCreators.map((creator) => (
                                <Link
                                    to={`/profile/${creator.handle.replace('@', '')}`}
                                    key={creator.id}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg p-4 hover:shadow-lg transition-shadow border border-gray-100"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <img
                                                src={creator.avatar}
                                                alt={creator.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className="ml-3">
                                                <div className="flex items-center">
                                                    <span className="font-medium">{creator.handle}</span>
                                                    {creator.verified && (
                                                        <span className="ml-1 text-blue-500">✓</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{creator.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ArrowUpDown className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-500">{creator.tokenSymbol}</span>
                                        <span className="font-medium">${creator.price.toFixed(2)}</span>
                                    </div>
                                    <div className="space-y-1">
                                        {creator.skills.map((skill, index) => (
                                            <div key={index} className="flex items-center text-sm">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Activity Feed */}
                        <div className="space-y-8">
                            {/* Recent Activity */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-gray-100">
                                <h2 className="font-medium mb-4">Recent activity</h2>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center text-sm">
                                            <img src={activity.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="text-gray-500">Support:</span>
                                                    <span className="ml-1 font-medium">{activity.creator}</span>
                                                    <span className="ml-1">{activity.buyer} bought</span>
                                                    <span className="ml-1 text-green-500">{activity.token}</span>
                                                    <span className="ml-1">at ${activity.price}</span>
                                                </p>
                                                <p className="text-xs text-gray-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Volume */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-gray-100">
                                <h2 className="font-medium mb-4">TOP volume this week</h2>
                                <div className="space-y-3">
                                    {topVolume.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                                    <span className="text-xs font-medium">{item.rank}</span>
                                                </div>
                                                <span>Anon</span>
                                            </div>
                                            <span className="text-sm">${(item.volume / 1000).toFixed(1)}k</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colored Stairs Divider
                    <div className="relative h-32 -mx-8">
                        <img
                            src="/dashboard/coloredstairs_upsidedown.png"
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    </div> */}

                    {/* Profile Section */}
                    <div className="bg-white rounded-lg p-8">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center">
                                    <img src="/dashboard/anon_icon.png" alt="" className="w-16 h-16 rounded-full" />
                                    <div className="ml-4">
                                        <div className="flex items-center">
                                            <h2 className="text-xl font-medium">@anon</h2>
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded">verified...best</span>
                                        </div>
                                        <p className="text-sm text-gray-500 italic">Anonymous</p>
                                        <p className="text-xs text-gray-400">Joined Jan 2023</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">my profile</p>
                                    <img src="/nexon_black_logo.png" alt="Nexon" className="h-6 ml-auto" />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-8">
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Position Value</span>
                                    </div>
                                    <p className="text-lg font-medium">$0.00</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Profit/Loss</span>
                                    </div>
                                    <p className="text-lg font-medium">$0.00</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Volume Traded</span>
                                    </div>
                                    <p className="text-lg font-medium">$0.00</p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Markets Traded</span>
                                    </div>
                                    <p className="text-lg font-medium">0</p>
                                </div>
                            </div>

                            <div className="border-t pt-8">
                                <div className="flex space-x-8 mb-6">
                                    <button className="text-sm font-medium border-b-2 border-black">Positions</button>
                                    <button className="text-sm font-medium text-gray-500 hover:text-black">Activity</button>
                                </div>

                                <div className="bg-white rounded-lg">
                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <span className="flex-1">MARKET</span>
                                        <span className="w-24 text-right">AVG</span>
                                        <span className="w-24 text-right">CURRENT</span>
                                        <span className="w-24 text-right">VALUE</span>
                                    </div>
                                    <p className="text-sm text-gray-500">No positions found</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}