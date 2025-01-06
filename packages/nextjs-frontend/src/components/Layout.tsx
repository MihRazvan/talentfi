import React from 'react';
import { Link } from 'react-router-dom';
import { Asterisk } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Asterisk className="h-8 w-8 text-[#FF7E6B]" />
                            <span className="text-2xl font-bold">nexon</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-8">
                        <Link to="/discover" className="nav-link">discover</Link>
                        <Link to="/scout" className="nav-link">scout</Link>
                        <Link to="/register" className="nav-link">register</Link>
                        <button className="nexon-button">
                            Connect Wallet
                        </button>
                    </div>
                </nav>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="nexon-gradient h-1" />
        </div>
    );
}