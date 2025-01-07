import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpDown, Heart } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useTalentRegistry } from '../hooks/useContract';
import { Contract } from 'zksync-ethers';
import { Log } from 'ethers';

const categories = ['Featured', 'Developers', 'NFT-Creators', 'Musicians', 'Traders'];

interface Developer {
    walletAddress: string;
    githubUsername: string;
    isVerified: boolean;
    tokenAddress: string;
    createdAt: number;
}

export function Dashboard() {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [loading, setLoading] = useState(true);
    const contract = useTalentRegistry();

    useEffect(() => {
        async function fetchDevelopers() {
            if (!contract) return;

            try {
                const filter = contract.filters.DeveloperRegistered();
                const events = await contract.queryFilter(filter);

                const uniqueDevelopers = new Set(
                    events
                        .filter((event): event is Log & { args: any[] } => 'args' in event)
                        .map(event => event.args[0])
                );

                const devs = await Promise.all(
                    Array.from(uniqueDevelopers).map(async (address) => {
                        if (!address) return null;

                        try {
                            const dev = await contract.developers(address);
                            return {
                                walletAddress: dev.walletAddress,
                                githubUsername: dev.githubUsername,
                                isVerified: dev.isVerified,
                                tokenAddress: dev.tokenAddress,
                                createdAt: Number(dev.createdAt)
                            };
                        } catch (error) {
                            console.error(`Error fetching developer ${address}:`, error);
                            return null;
                        }
                    })
                );

                const validDevs = devs
                    .filter((dev): dev is Developer => dev !== null)
                    .sort((a, b) => b.createdAt - a.createdAt);

                setDevelopers(validDevs);
            } catch (error) {
                console.error('Error fetching developers:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDevelopers();
    }, [contract]);

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* Categories */}
                <div className="border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-8 h-16 items-center">
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
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Developers"
                                className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm"
                            />
                        </div>
                    </div>

                    {/* Developer Cards */}
                    {loading ? (
                        <div className="text-center py-12">Loading developers...</div>
                    ) : developers.length === 0 ? (
                        <div className="text-center py-12">No developers found</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            {developers.map((dev) => (
                                <div
                                    key={dev.walletAddress}
                                    className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <img
                                                src={`https://github.com/${dev.githubUsername}.png`}
                                                alt={dev.githubUsername}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className="ml-3">
                                                <div className="flex items-center">
                                                    <span className="font-medium">@{dev.githubUsername}</span>
                                                    {dev.isVerified && (
                                                        <span className="ml-1 text-blue-500">✓</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {dev.walletAddress.slice(0, 6)}...{dev.walletAddress.slice(-4)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <ArrowUpDown className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Token Address:</span>
                                            <span className="font-mono text-sm">
                                                {dev.tokenAddress !== '0x0000000000000000000000000000000000000000'
                                                    ? `${dev.tokenAddress.slice(0, 6)}...${dev.tokenAddress.slice(-4)}`
                                                    : 'Not set'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Registered:</span>
                                            <span className="text-sm">
                                                {new Date(dev.createdAt * 1000).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}