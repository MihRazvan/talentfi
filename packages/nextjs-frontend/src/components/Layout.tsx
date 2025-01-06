import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/">
                            <img src="/nexon_black_logo.png" alt="Nexon" className="h-8" />
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