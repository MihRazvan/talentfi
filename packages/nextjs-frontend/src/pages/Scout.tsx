import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { CreatorType, inputConfigs } from '../types/creator';

// ... (keep existing type definitions and configs)

export function Scout() {
    const [selectedType, setSelectedType] = useState<CreatorType>('Developer');
    const [identifier, setIdentifier] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = () => {
        setIsVerifying(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/">
                        <img src="/nexon_black_logo.png" alt="Nexon" className="h-8" />
                    </Link>

                    <div className="flex items-center space-x-8">
                        <Link to="/discover" className="text-sm font-medium hover:text-gray-900">discover</Link>
                        <Link to="/scout" className="text-sm font-medium text-gray-900">scout</Link>
                        <Link to="/register" className="text-sm font-medium hover:text-gray-900">register</Link>
                        <button className="flex items-center space-x-1 text-sm font-medium hover:text-gray-900">
                            <span>login</span>
                            <LogIn className="h-4 w-4" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Background Image */}
            <div className="h-16">
                <img
                    src="/footer_background.png"
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center text-center">
                <div className="max-w-3xl mx-auto px-4 py-16">
                    <h1 className="text-4xl font-playfair mb-8">Discover Talent, Earn Rewards</h1>

                    <p className="mb-12 text-lg">
                        Become a talent scout and shape the future of creativity. By manually adding rising stars - whether developers, NFT-Creators, musicians or traders-you help them shine on the discover page.
                    </p>

                    <div className="mb-12">
                        <h2 className="text-xl font-medium mb-4">How It Works</h2>
                        <ol className="space-y-2">
                            <li>1. <span className="font-medium">Spot Talent:</span> Add promising creators to the platform.</li>
                            <li>2. <span className="font-medium">AI Review:</span> Our system validates their profile.</li>
                            <li>3. <span className="font-medium">Earn Rewards:</span> When they claim their profile via nexon, you earn a Scout Reward (SR) - 2% of trading revenue.</li>
                        </ol>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-xl font-medium mb-4">Win-Win for Everyone</h2>
                        <ul className="space-y-2">
                            <li>• <span className="font-medium">Scouts:</span> Share in the success of the creators you discover.</li>
                            <li>• <span className="font-medium">Creators:</span> Keep 10% of trading revenue with the Creator Rewards (CR).</li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-playfair italic mb-8">
                        Start scouting today and turn your eye for talent<br />into tangible rewards!
                    </h2>

                    <img src="/scout/arrow1.png" alt="" className="w-8 mx-auto animate-bounce" />
                </div>

                {/* Stairs Divider */}
                <div className="w-full h-32">
                    <img
                        src="/scout/coloredstairs_upsidedown.png"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Scout Form */}
                <div className="max-w-md w-full mx-auto px-4 py-16 space-y-12">
                    <div className="space-y-8">
                        {/* Category Selection */}
                        <div>
                            <h2 className="text-xl font-medium mb-4">Select category</h2>
                            <div className="grid grid-cols-4 gap-4">
                                {Object.keys(inputConfigs).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type as CreatorType)}
                                        className={`p-3 text-sm rounded-lg transition-colors ${selectedType === type
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {inputConfigs[selectedType].label}
                            </label>
                            <input
                                type="text"
                                placeholder={inputConfigs[selectedType].placeholder}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                            />
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            className="w-full py-3 bg-gradient-to-r from-nexon-coral via-nexon-gold to-nexon-turquoise text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Verify
                        </button>

                        {/* Verification Status */}
                        {isVerifying && (
                            <div className="text-center space-y-6">
                                <p className="text-gray-600">Waiting for verification...</p>
                                <button disabled className="px-6 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                                    Add Creator
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative h-16 flex items-center justify-center">
                <img
                    src="/footer_background.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <p className="relative z-10 text-white text-sm">
                    Developed by magento & jensei for Lens Holiday Hackathon (❀◠‿◠)
                </p>
            </footer>
        </div>
    );
}