import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Asterisk } from 'lucide-react';
import { useWalletContext } from '../../context/WalletContext';

const Header: React.FC = () => {
    const location = useLocation();
    const { isConnected, address, connectWallet, disconnectWallet, error } = useWalletContext();

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Asterisk className="w-8 h-8 text-indigo-500" />
                        <span className="text-2xl font-light tracking-tight">nexon</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/discover"
                            className={`text-sm font-medium ${location.pathname === '/discover'
                                    ? 'text-indigo-500'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            discover
                        </Link>
                        <Link
                            to="/scout"
                            className={`text-sm font-medium ${location.pathname === '/scout'
                                    ? 'text-indigo-500'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            scout
                        </Link>
                        <Link
                            to="/register"
                            className={`text-sm font-medium ${location.pathname === '/register'
                                    ? 'text-indigo-500'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            register
                        </Link>
                    </nav>

                    <button
                        onClick={isConnected ? disconnectWallet : connectWallet}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${isConnected
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-indigo-500 text-white hover:bg-indigo-600'
                            }`}
                    >
                        {isConnected ? formatAddress(address!) : 'Connect Wallet'}
                    </button>
                </div>

                {error && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-red-50 text-red-700 px-4 py-2 text-sm text-center">
                        {error}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;