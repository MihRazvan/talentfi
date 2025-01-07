import React, { useState } from 'react';
import { Code2, Palette, Music, TrendingUp, Search, Loader2, Target, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

type CreatorType = 'developer' | 'nft-artist' | 'musician' | 'trader';

interface ScoutResult {
    username: string;
    type: CreatorType;
    confidence_score: number;
    market_potential: number;
    suggested_price: string;
    token_symbol: string;
    strengths: string[];
    risks: string[];
    thesis: string[];
}

const Scout = () => {
    const [selectedType, setSelectedType] = useState<CreatorType | null>(null);
    const [identifier, setIdentifier] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ScoutResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!identifier || !selectedType) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock result
            setResult({
                username: identifier,
                type: selectedType,
                confidence_score: 8.5,
                market_potential: 9.2,
                suggested_price: "0.85",
                token_symbol: `$${identifier.toUpperCase()}`,
                strengths: [
                    "Strong GitHub contribution history",
                    "Active in open source communities",
                    "Growing social media presence"
                ],
                risks: [
                    "Early in career trajectory",
                    "Market volatility in tech sector"
                ],
                thesis: [
                    "Shows exceptional promise in blockchain development",
                    "Strong technical foundation with room for growth",
                    "Active community engagement suggests good token adoption"
                ]
            });
        } catch (err) {
            setError('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-cyan-100 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-medium text-slate-900">Scout Potential Creators</h1>
                    <p className="text-slate-600 mt-2">Analyze and evaluate upcoming talent before they join the platform</p>
                    <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="text-sm">Earn 2% of all buys when your scouted creator claims their profile!</span>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6">
                        {/* Info Banner */}
                        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                            <h3 className="text-indigo-700 font-medium mb-2">How Scouting Works</h3>
                            <ol className="text-sm text-indigo-600 space-y-1">
                                <li>1. Select the creator type you want to analyze</li>
                                <li>2. Enter their identifier (e.g., GitHub username for developers)</li>
                                <li>3. Our AI will analyze their potential and market fit</li>
                                <li>4. Share the analysis with the creator to encourage them to join</li>
                                <li>5. Earn 2% of all future buys when they claim their profile!</li>
                            </ol>
                        </div>

                        {/* Creator Type Selection */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { id: 'developer', label: 'Developer', icon: Code2, placeholder: 'GitHub Username' },
                                { id: 'nft-artist', label: 'NFT Artist', icon: Palette, placeholder: 'OpenSea Address' },
                                { id: 'musician', label: 'Musician', icon: Music, placeholder: 'Spotify Artist ID' },
                                { id: 'trader', label: 'Trader', icon: TrendingUp, placeholder: 'Wallet Address' }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setSelectedType(type.id as CreatorType);
                                        setIdentifier('');
                                        setResult(null);
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all
                    ${selectedType === type.id
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-slate-200 hover:border-slate-300'}`}
                                >
                                    <type.icon className={`w-6 h-6 mx-auto mb-2 
                    ${selectedType === type.id ? 'text-indigo-500' : 'text-slate-500'}`}
                                    />
                                    <span className={`block text-sm font-medium
                    ${selectedType === type.id ? 'text-indigo-500' : 'text-slate-700'}`}>
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={selectedType
                                        ? `Enter ${selectedType === 'developer' ? 'GitHub username'
                                            : selectedType === 'nft-artist' ? 'OpenSea address'
                                                : selectedType === 'musician' ? 'Spotify artist ID'
                                                    : 'wallet address'}`
                                        : 'Select a creator type first'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    disabled={!selectedType}
                                    className="w-full px-4 py-2 pl-10 rounded-lg border border-slate-200 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                    disabled:bg-slate-50 disabled:cursor-not-allowed"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !identifier || !selectedType}
                            className="w-full py-2 px-4 rounded-lg bg-indigo-500 text-white font-medium 
                hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing potential...
                                </>
                            ) : 'Analyze Creator Potential'}
                        </button>

                        {/* Results */}
                        {result && (
                            <div className="mt-8 space-y-6">
                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                        <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                                            <Target className="w-4 h-4" />
                                            <span className="text-sm font-medium">Confidence Score</span>
                                        </div>
                                        <span className="text-2xl font-medium text-emerald-700">{result.confidence_score}</span>
                                    </div>

                                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                                        <div className="flex items-center space-x-2 text-blue-600 mb-2">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-sm font-medium">Market Potential</span>
                                        </div>
                                        <span className="text-2xl font-medium text-blue-700">{result.market_potential}</span>
                                    </div>

                                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                                        <div className="flex items-center space-x-2 text-purple-600 mb-2">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-sm font-medium">Suggested Price</span>
                                        </div>
                                        <span className="text-2xl font-medium text-purple-700">${result.suggested_price}</span>
                                    </div>
                                </div>

                                {/* Analysis */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-900 mb-2">Investment Thesis</h3>
                                        <div className="space-y-2">
                                            {result.thesis.map((point, i) => (
                                                <p key={i} className="text-sm text-slate-600">{point}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-slate-900 mb-2">Strengths</h3>
                                            <ul className="space-y-2">
                                                {result.strengths.map((strength, i) => (
                                                    <li key={i} className="flex items-center space-x-2 text-sm text-slate-600">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                        <span>{strength}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-slate-900 mb-2">Risk Factors</h3>
                                            <ul className="space-y-2">
                                                {result.risks.map((risk, i) => (
                                                    <li key={i} className="flex items-center space-x-2 text-sm text-slate-600">
                                                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                                        <span>{risk}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scout;