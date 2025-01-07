import React, { useState } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { Code2, Palette, Music, TrendingUp, Loader2, CheckCircle2, XCircle, Github, Info } from 'lucide-react';

type CreatorType = 'developer' | 'nft-artist' | 'musician' | 'trader';

interface CategoryOption {
    id: CreatorType;
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    inputType: string;
    authType?: 'github' | 'wallet';
}

const Register = () => {
    const { connectWallet } = useWalletContext();
    const [selectedCategory, setSelectedCategory] = useState<CreatorType | null>(null);
    const [identifier, setIdentifier] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'none' | 'exists' | 'new'>('none');
    const [isRegistering, setIsRegistering] = useState(false);
    const [needsAuth, setNeedsAuth] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const categories: CategoryOption[] = [
        {
            id: 'developer',
            label: 'Developer',
            icon: <Code2 className="w-5 h-5" />,
            placeholder: 'Enter GitHub Username',
            inputType: 'text',
            authType: 'github'
        },
        {
            id: 'nft-artist',
            label: 'NFT Artist',
            icon: <Palette className="w-5 h-5" />,
            placeholder: 'Enter OpenSea Wallet',
            inputType: 'text',
            authType: 'wallet'
        },
        {
            id: 'musician',
            label: 'Musician',
            icon: <Music className="w-5 h-5" />,
            placeholder: 'Enter Spotify Account',
            inputType: 'text'
        },
        {
            id: 'trader',
            label: 'Trader',
            icon: <TrendingUp className="w-5 h-5" />,
            placeholder: 'Enter DeBank Wallet',
            inputType: 'text',
            authType: 'wallet'
        }
    ];

    const handleVerify = async () => {
        if (!identifier) return;

        setIsVerifying(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const selectedCat = categories.find(c => c.id === selectedCategory);
            if (selectedCat?.authType === 'github') {
                setNeedsAuth(true);
                setVerificationStatus('none');
            } else {
                // For demo, set as existing if username is "existinguser"
                setVerificationStatus(identifier.toLowerCase() === 'existinguser' ? 'exists' : 'new');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleGithubAuth = async () => {
        setIsVerifying(true);
        setError(null);

        try {
            // Simulate GitHub OAuth process
            await new Promise(resolve => setTimeout(resolve, 2000));
            setVerificationStatus('new');
            setNeedsAuth(false);
        } catch (err) {
            setError('GitHub authentication failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleRegister = async () => {
        setIsRegistering(true);
        setError(null);

        try {
            await connectWallet();
            // Simulate registration process
            await new Promise(resolve => setTimeout(resolve, 2000));
            window.location.href = '/discover';
        } catch (err) {
            setError('Registration failed. Please try again.');
            setIsRegistering(false);
        }
    };

    const handleClaim = async () => {
        setIsRegistering(true);
        setError(null);

        try {
            await connectWallet();
            // Simulate claim process
            await new Promise(resolve => setTimeout(resolve, 2000));
            setError('Claim failed: Account not eligible');
        } catch (err) {
            setError('Claim failed. Please try again.');
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-cyan-100 py-12">
            <div className="max-w-lg mx-auto px-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-medium text-slate-900">Register as Creator</h1>
                            <p className="text-slate-600 mt-2">Join our platform and tokenize your talent</p>
                        </div>

                        {/* Info Card */}
                        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <Info className="w-5 h-5 text-indigo-500 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-indigo-900 mb-1">How it works</h3>
                                    <ol className="text-sm text-indigo-700 space-y-1">
                                        <li>1. Select your creator category</li>
                                        <li>2. Enter your identifier for verification</li>
                                        <li>3. Complete authentication if required</li>
                                        <li>4. Register or claim your profile</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-3 mb-6">
                            <h2 className="text-sm font-medium text-slate-700">Select your category</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            setNeedsAuth(false);
                                            setVerificationStatus('none');
                                            setIdentifier('');
                                        }}
                                        className={`p-4 rounded-xl border-2 transition-all flex items-center space-x-3
                          ${selectedCategory === category.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className={`${selectedCategory === category.id ? 'text-indigo-500' : 'text-slate-500'}`}>
                                            {category.icon}
                                        </div>
                                        <span className={`font-medium ${selectedCategory === category.id ? 'text-indigo-500' : 'text-slate-700'}`}>
                                            {category.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Field */}
                        {selectedCategory && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {selectedCategory === 'developer' && 'GitHub Username'}
                                        {selectedCategory === 'nft-artist' && 'OpenSea Wallet Address'}
                                        {selectedCategory === 'musician' && 'Spotify Account ID'}
                                        {selectedCategory === 'trader' && 'DeBank Wallet Address'}
                                    </label>
                                    <input
                                        type={categories.find(c => c.id === selectedCategory)?.inputType}
                                        placeholder={categories.find(c => c.id === selectedCategory)?.placeholder}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                    <p className="text-xs text-slate-500">
                                        {selectedCategory === 'developer' && 'Enter your GitHub username to verify your developer profile'}
                                        {selectedCategory === 'nft-artist' && 'Enter your OpenSea wallet to verify your NFT creations'}
                                        {selectedCategory === 'musician' && 'Enter your Spotify account ID to verify your music profile'}
                                        {selectedCategory === 'trader' && 'Enter your DeBank wallet to verify your trading history'}
                                    </p>
                                </div>

                                {/* Verify Button */}
                                {!needsAuth && !verificationStatus && (
                                    <button
                                        onClick={handleVerify}
                                        disabled={isVerifying || !identifier}
                                        className="w-full py-2 px-4 rounded-lg bg-indigo-500 text-white font-medium 
                          hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Verifying your credentials...
                                            </>
                                        ) : 'Verify Credentials'}
                                    </button>
                                )}

                                {/* GitHub Auth Button */}
                                {needsAuth && (
                                    <div className="space-y-3">
                                        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                                            We need to verify your GitHub account to proceed. This helps us ensure the authenticity of developer profiles.
                                        </div>
                                        <button
                                            onClick={handleGithubAuth}
                                            disabled={isVerifying}
                                            className="w-full py-2 px-4 rounded-lg bg-slate-800 text-white font-medium 
                            hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isVerifying ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Authenticating with GitHub...
                                                </>
                                            ) : (
                                                <>
                                                    <Github className="w-4 h-4 mr-2" />
                                                    Authenticate with GitHub
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {verificationStatus !== 'none' && (
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 rounded-lg p-3 text-sm">
                                            {verificationStatus === 'exists' ? (
                                                <p className="text-slate-600">
                                                    We found an existing profile for this account. You can claim it to gain access.
                                                </p>
                                            ) : (
                                                <p className="text-slate-600">
                                                    Great! You can now register as a creator. This will create your creator token and profile.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex space-x-4">
                                            <button
                                                onClick={handleClaim}
                                                disabled={verificationStatus !== 'exists' || isRegistering}
                                                className="flex-1 py-2 px-4 rounded-lg bg-emerald-500 text-white font-medium 
                              hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isRegistering ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Processing claim...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Claim Profile
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleRegister}
                                                disabled={verificationStatus !== 'new' || isRegistering}
                                                className="flex-1 py-2 px-4 rounded-lg bg-indigo-500 text-white font-medium 
                              hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isRegistering ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Creating profile...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Register Profile
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                        <XCircle className="w-4 h-4" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;