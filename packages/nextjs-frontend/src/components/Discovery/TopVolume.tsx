import React from 'react';
import { TrendingUp } from 'lucide-react';
import { mockTopVolume } from '../../data/mockData';

const TopVolume = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-medium mb-4 text-slate-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
                TOP volume this week
            </h2>
            <div className="space-y-4">
                {mockTopVolume.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                {index + 1}
                            </div>
                            <img
                                src={`https://avatars.githubusercontent.com/${item.username}`}
                                alt={item.username}
                                className="w-8 h-8 rounded-full border border-slate-100"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://github.com/identicons/icon.png';
                                }}
                            />
                            <span className="text-sm text-slate-900">@{item.username}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">${item.volume}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopVolume;