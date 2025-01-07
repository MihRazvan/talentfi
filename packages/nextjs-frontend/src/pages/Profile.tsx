import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Github, Globe, Heart, ArrowUpDown, Shield } from 'lucide-react';
import { TokenTrading } from '../components/TokenTrading';
import { useTalentRegistry } from '../hooks/useContract';

interface DeveloperProfile {
    walletAddress: string;
    githubUsername: string;
    isVerified: boolean;
    isClaimed: boolean;
    tokenAddress: string;
    createdAt: number;
}

export function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState<DeveloperProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const contract = useTalentRegistry();

    useEffect(() => {
        async function fetchProfile() {
            if (!contract || !username) return;

            try {
                const events = await contract.queryFilter(contract.filters.DeveloperRegistered());
                const dev = events.find(event => {
                    // Access the developer data directly from the event args
                    const developerData = event.args;
                    return developerData && developerData[1].toLowerCase() === username.toLowerCase(); // Compare githubUsername
                });

                if (dev && dev.args) {
                    // Get the wallet address from the event args
                    const walletAddress = dev.args[0];
                    // Fetch additional developer data from the contract
                    const developerData = await contract.developers(walletAddress);

                    setProfile({
                        walletAddress: walletAddress,
                        githubUsername: developerData.githubUsername,
                        isVerified: developerData.isVerified,
                        isClaimed: false, // For now, all profiles are unclaimed
                        tokenAddress: developerData.tokenAddress,
                        createdAt: Number(developerData.createdAt)
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [contract, username]);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p>Loading profile...</p>
                </div>
            </Layout>
        );
    }

    if (!profile) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p>Profile not found</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header with gradient background */}
                    <div className="relative h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        <div className="absolute -bottom-16 left-8">
                            <img
                                src={`https://github.com/${profile.githubUsername}.png`}
                                alt={profile.githubUsername}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-20 px-8 pb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold">@{profile.githubUsername}</h1>
                                    {profile.isVerified && <Shield className="h-5 w-5 text-blue-500" />}
                                </div>
                                <div className="flex space-x-4 text-gray-600 mt-2">
                                    <a
                                        href={`https://github.com/${profile.githubUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center hover:text-gray-900"
                                    >
                                        <Github className="h-4 w-4 mr-1" />
                                        GitHub
                                    </a>
                                    <span className="flex items-center">
                                        <Globe className="h-4 w-4 mr-1" />
                                        Developer
                                    </span>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Follow
                                </button>
                                {!profile.isClaimed && (
                                    <button
                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        onClick={() => {
                                            // TODO: Implement claim functionality
                                            console.log('Claim profile:', profile.githubUsername);
                                        }}
                                    >
                                        <Github className="h-4 w-4 mr-2" />
                                        Claim Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Token Trading Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <TokenTrading
                                tokenAddress={profile.tokenAddress}
                                symbol={`$${profile.githubUsername.toUpperCase()}`}
                            />

                            <div className="bg-gray-50 rounded-lg p-6">
                                <h2 className="text-lg font-semibold mb-4">Developer Stats</h2>
                                <div className="grid grid-cols-5 gap-4">
                                    <div className="text-center">
                                        <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                                            <span className="text-xl font-bold">8</span>
                                        </div>
                                        <span className="text-sm text-gray-600">GitHub<br />Metrics</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                                            <span className="text-xl font-bold">9</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Technical<br />Expertise</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                                            <span className="text-xl font-bold">9</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Web3<br />Expertise</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                                            <span className="text-xl font-bold">7</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Community<br />Influence</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                                            <span className="text-xl font-bold">8</span>
                                        </div>
                                        <span className="text-sm text-gray-600">Growth<br />Potential</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Token Holders Table */}
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold mb-4">Token Holders</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Username
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Avg Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Value
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ticker
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                @{profile.githubUsername}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                $0.10
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                $2105.00
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${profile.githubUsername.toUpperCase()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}