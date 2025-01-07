import React, { useState } from 'react';
import { Search } from 'lucide-react';
import CreatorCard from '../components/Discovery/CreatorCard';
import ActivityFeed from '../components/Discovery/ActivityFeed';
import TopVolume from '../components/Discovery/TopVolume';
import { useCreatorData } from '../hooks/useCreatorData';

const categories = [
    { id: 'featured', label: 'Featured' },
    { id: 'developers', label: 'Developers' },
    { id: 'nft-creators', label: 'NFT-Creators' },
    { id: 'musicians', label: 'Musicians' },
    { id: 'traders', label: 'Traders' }
];

const Discovery = () => {
    const [activeCategory, setActiveCategory] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const { creators, loading, error } = useCreatorData();

    const filteredCreators = creators.filter(creator =>
        creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.analysis.skills_assessment.validated_skills.some(skill =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col space-y-6">
                {/* Category Tabs */}
                <div className="flex items-center justify-between">
                    <div className="flex space-x-4 overflow-x-auto">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors
                  ${activeCategory === category.id
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Creators"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                </div>

                {/* Creator Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCreators.map(creator => (
                        <CreatorCard key={creator.developer_address} creator={creator} />
                    ))}
                </div>

                {/* Activity and Volume */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <ActivityFeed />
                    <TopVolume />
                </div>
            </div>
        </div>
    );
};


export default Discovery;