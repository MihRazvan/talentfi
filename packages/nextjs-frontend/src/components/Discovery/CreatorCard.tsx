import React from 'react';
import { Share2, Heart, Shield, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface CreatorCardProps {
    creator: any;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
    // Simulating claimed status - in production this would come from blockchain
    const isClaimed = creator.username === "robsecord" || creator.username === "0xkoiner";

    const tokenPrice = Number(creator.analysis.market_metrics.suggested_initial_price) / 1e18;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img
                                src={`https://avatars.githubusercontent.com/${creator.username}`}
                                alt={creator.username}
                                className="w-10 h-10 rounded-full border-2 border-slate-100"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://github.com/identicons/icon.png';
                                }}
                            />
                            {/* Status Icon */}
                            {isClaimed ? (
                                <ShieldCheck className="w-4 h-4 text-emerald-500 absolute -bottom-1 -right-1" />
                            ) : (
                                <Shield className="w-4 h-4 text-slate-400 absolute -bottom-1 -right-1" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900">@{creator.username}</h3>
                            <p className="text-sm text-slate-500">
                                {creator.analysis.confidence_score}% confidence
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="p-1.5 rounded-full hover:bg-slate-50">
                            <Share2 className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-slate-50">
                            <Heart className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Skills */}
                <div className="space-y-1.5 mb-4">
                    {creator.analysis.skills_assessment.validated_skills.slice(0, 3).map((skill: string) => (
                        <div key={skill} className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span className="text-sm text-slate-600">{skill}</span>
                        </div>
                    ))}
                </div>

                {/* Investment Thesis & Risk */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600">{creator.analysis.investment_thesis[0]}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600">{creator.analysis.risk_factors[0]}</p>
                    </div>
                </div>

                {/* Token Info */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500">Token Price</span>
                            <span className="font-medium text-slate-900">${tokenPrice.toFixed(2)}</span>
                        </div>
                        <button className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition-colors">
                            Invest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorCard;