import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { BrowserProvider } from 'ethers';

interface WalletContextType {
    provider: BrowserProvider | null;
    address: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
    provider: null,
    address: null,
    connect: async () => { },
    disconnect: () => { },
});

export function WalletProvider({ children }: { children: ReactNode }) {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        const connectOnLoad = async () => {
            if (window.ethereum && localStorage.getItem('walletConnected') === 'true') {
                await connect();
            }
        };
        connectOnLoad();
    }, []);

    const connect = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const browserProvider = new BrowserProvider(window.ethereum);

                setProvider(browserProvider);
                setAddress(accounts[0]);
                localStorage.setItem('walletConnected', 'true');
            } catch (error) {
                console.error('Error connecting wallet:', error);
            }
        }
    };

    const disconnect = () => {
        setProvider(null);
        setAddress(null);
        localStorage.removeItem('walletConnected');
    };

    return (
        <WalletContext.Provider value={{ provider, address, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext);