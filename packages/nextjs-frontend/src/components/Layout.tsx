import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrowserProvider, Signer, Provider, types } from 'zksync-ethers';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [signer, setSigner] = useState<Signer | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const connectWallet = async () => {
        try {
            setLoading(true);

            // Check if MetaMask is installed
            if (!window.ethereum) {
                throw new Error("Please install MetaMask to connect a wallet");
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Create providers
            const browserProvider = new BrowserProvider(window.ethereum);
            const zkProvider = Provider.getDefaultProvider(types.Network.Sepolia);

            // Get network details
            const network = await browserProvider.getNetwork();

            // Create signer
            const ethSigner = await browserProvider.getSigner();
            const zkSigner = Signer.from(ethSigner, Number(network.chainId), zkProvider);

            // Get and set the address
            const userAddress = await zkSigner.getAddress();

            setSigner(zkSigner);
            setAddress(userAddress);

        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Error connecting wallet. Please make sure MetaMask is installed and try again.");
        } finally {
            setLoading(false);
        }
    };

    const disconnectWallet = () => {
        setSigner(null);
        setAddress(null);
    };

    // Listen for account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
                disconnectWallet();
            });

            window.ethereum.on('chainChanged', () => {
                disconnectWallet();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', disconnectWallet);
                window.ethereum.removeListener('chainChanged', disconnectWallet);
            }
        };
    }, []);

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
                        {address ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">
                                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                                </span>
                                <button
                                    onClick={disconnectWallet}
                                    className="nexon-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={loading}
                                className="nexon-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
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