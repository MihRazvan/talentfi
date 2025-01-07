import { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '../hooks/useWallet';
import { Signer, Provider } from 'zksync-ethers';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    signer: Signer | null;
    provider: Provider | null;
    chainId: number | null;
    error: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const wallet = useWallet();

    return (
        <WalletContext.Provider value={wallet}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWalletContext() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWalletContext must be used within a WalletProvider');
    }
    return context;
}