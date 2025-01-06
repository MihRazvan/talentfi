import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

type CreatorType = 'Developer' | 'NFT-Creator' | 'Musician' | 'Trader';

interface InputConfig {
    placeholder: string;
    label: string;
}

const inputConfigs: Record<CreatorType, InputConfig> = {
    'Developer': { placeholder: 'Enter GitHub username', label: 'GitHub Username' },
    'NFT-Creator': { placeholder: 'Enter OpenSea address', label: 'OpenSea Address' },
    'Musician': { placeholder: 'Enter Spotify name', label: 'Spotify Name' },
    'Trader': { placeholder: 'Enter DeBank account', label: 'DeBank Account' }
};

export function Register() {
    const [selectedType, setSelectedType] = useState<CreatorType>('Developer');
    const [identifier, setIdentifier] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = () => {
        setIsVerifying(true);
        // Verification logic will be implemented later
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
                        <Link to="/scout" className="text-sm font-medium hover:text-gray-900">scout</Link>
                        <Link to="/register" className="text-sm font-medium text-gray-900">register</Link>
                        <button className="flex items-center space-x-1 text-sm font-medium hover:text-gray-900">
                            <span>login</span>
                            <LogIn className="h-4 w-4" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center py-16 px-4">
                <div className="max-w-md w-full space-y-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-playfair italic mb-4">Join Nexon</h1>
                        <p className="text-gray-600">Become part of the next generation of creators</p>
                    </div>

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

                                <div className="flex justify-center space-x-4">
                                    <button disabled className="px-6 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                                        register
                                    </button>
                                    <button disabled className="px-6 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                                        claim
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

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