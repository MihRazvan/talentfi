import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
    const { provider, connect, disconnect } = useWallet();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex-shrink-0">
                            <img src="/nexon_black_logo.png" alt="Nexon" className="h-8" />
                        </Link>

                        <nav className="flex space-x-8">
                            <Link
                                to="/discover"
                                className={`px-3 py-2 text-sm font-medium ${isActive('/discover')
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Discover
                            </Link>
                            <Link
                                to="/scout"
                                className={`px-3 py-2 text-sm font-medium ${isActive('/scout')
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Scout
                            </Link>
                            <Link
                                to="/register"
                                className={`px-3 py-2 text-sm font-medium ${isActive('/register')
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Register
                            </Link>
                        </nav>
                    </div>

                    <button
                        onClick={provider ? disconnect : connect}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Wallet className="h-4 w-4 mr-2" />
                        {provider ? 'Disconnect' : 'Connect Wallet'}
                    </button>
                </div>
            </div>
        </header>
    );
}