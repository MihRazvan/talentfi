import React, { useState } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { Code2, Palette, Music, TrendingUp, Loader2, CheckCircle2, XCircle, Github, Info } from 'lucide-react';

const Register = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState('none'); // none, exists, new
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const { isConnected } = useWalletContext();

    const handleVerify = async () => {
        if (!identifier) return;
        setIsVerifying(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock verification result
            if (identifier === 'existinguser') {
                setVerificationStatus('exists');
            } else {
                setVerificationStatus('new');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleGithubAuth = async () => {
        setIsVerifying(true);
        try {
            // Simulate GitHub OAuth flow
            await new Promise(resolve => setTimeout(resolve, 2000));
            setVerificationStatus('new');
        } catch (err) {
            setError('GitHub authentication failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClaim = async () => {
        setIsRegistering(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Handle claim logic
        } catch (err) {
            setError('Failed to claim profile. Please try again.');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleRegister = async () => {
        setIsRegistering(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Handle registration logic
        } catch (err) {
            setError('Failed to register profile. Please try again.');
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
                                {[
                                    { id: 'developer', label: 'Developer', icon: Code2 },
                                    { id: 'nft-artist', label: 'NFT Artist', icon: Palette },
                                    { id: 'musician', label: 'Musician', icon: Music },
                                    { id: 'trader', label: 'Trader', icon: TrendingUp }
                                ].map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            setVerificationStatus('none');
                                            setIdentifier('');
                                        }}
                                        className={`p-4 rounded-xl border-2 transition-all
                      ${selectedCategory === category.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <category.icon className={`w-6 h-6 mx-auto mb-2 
                      ${selectedCategory === category.id ? 'text-indigo-500' : 'text-slate-500'}`}
                                        />
                                        <span className={`block text-sm font-medium
                      ${selectedCategory === category.id ? 'text-indigo-500' : 'text-slate-700'}`}>
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
                                        type="text"
                                        placeholder={`Enter your ${selectedCategory} identifier`}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>

                                {/* Verify Button */}
                                {verificationStatus === 'none' && (
                                    <button
                                        onClick={handleVerify}
                                        disabled={isVerifying || !identifier}
                                        className="w-full py-2 px-4 rounded-lg bg-indigo-500 text-white font-medium 
                      hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : 'Verify Credentials'}
                                    </button>
                                )}

                                {/* GitHub Auth Button */}
                                {selectedCategory === 'developer' && verificationStatus === 'new' && (
                                    <button
                                        onClick={handleGithubAuth}
                                        className="w-full py-2 px-4 rounded-lg bg-slate-800 text-white font-medium 
                      hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        <Github className="w-4 h-4 mr-2" />
                                        Authenticate with GitHub
                                    </button>
                                )}

                                {/* Action Buttons */}
                                {verificationStatus !== 'none' && (
                                    <div className="space-y-4">
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={handleClaim}
                                                disabled={verificationStatus !== 'exists' || isRegistering || !isConnected}
                                                className="flex-1 py-2 px-4 rounded-lg bg-emerald-500 text-white font-medium 
                          hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isRegistering ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Claiming...
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
                                                disabled={verificationStatus !== 'new' || isRegistering || !isConnected}
                                                className="flex-1 py-2 px-4 rounded-lg bg-indigo-500 text-white font-medium 
                          hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isRegistering ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Registering...
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