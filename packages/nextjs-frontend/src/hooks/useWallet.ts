import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { Provider } from 'zksync-ethers';

interface WalletState {
    isConnected: boolean;
    address: string | null;
    signer: any;
    provider: Provider | null;
    chainId: number | null;
    error: string | null;
}

const LENS_TESTNET_CHAIN_ID = 37111;
const LENS_TESTNET_RPC = 'https://rpc.testnet.lens.dev';

export function useWallet() {
    const [state, setState] = useState<WalletState>({
        isConnected: false,
        address: null,
        signer: null,
        provider: null,
        chainId: null,
        error: null,
    });

    const setupConnection = async () => {
        if (!window.ethereum) return;

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const ethProvider = new BrowserProvider(window.ethereum);
                const network = await ethProvider.getNetwork();
                const chainId = Number(network.chainId);

                if (chainId === LENS_TESTNET_CHAIN_ID) {
                    const provider = new Provider(LENS_TESTNET_RPC);
                    const signer = await ethProvider.getSigner();

                    setState({
                        isConnected: true,
                        address: accounts[0],
                        signer,
                        provider,
                        chainId,
                        error: null,
                    });
                }
            }
        } catch (error) {
            console.error('Failed to setup connection:', error);
        }
    };

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            setState(prev => ({
                ...prev,
                error: "Please install MetaMask or another Web3 wallet"
            }));
            return;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const ethProvider = new BrowserProvider(window.ethereum);
            const network = await ethProvider.getNetwork();
            const chainId = Number(network.chainId);

            if (chainId !== LENS_TESTNET_CHAIN_ID) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${LENS_TESTNET_CHAIN_ID.toString(16)}` }],
                    });
                } catch (err) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${LENS_TESTNET_CHAIN_ID.toString(16)}`,
                            chainName: 'Lens Network Sepolia Testnet',
                            nativeCurrency: {
                                name: 'GRASS',
                                symbol: 'GRASS',
                                decimals: 18
                            },
                            rpcUrls: [LENS_TESTNET_RPC],
                            blockExplorerUrls: ['https://block-explorer.testnet.lens.dev']
                        }]
                    });
                }
                setState(prev => ({
                    ...prev,
                    error: "Please switch to Lens Network Sepolia Testnet and try again"
                }));
                return;
            }

            const provider = new Provider(LENS_TESTNET_RPC);
            const signer = await ethProvider.getSigner();

            setState({
                isConnected: true,
                address: accounts[0],
                signer,
                provider,
                chainId: LENS_TESTNET_CHAIN_ID,
                error: null,
            });

        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : "Failed to connect wallet",
            }));
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        setState({
            isConnected: false,
            address: null,
            signer: null,
            provider: null,
            chainId: null,
            error: null,
        });
    }, []);

    useEffect(() => {
        setupConnection();

        const ethereum = window.ethereum;
        if (!ethereum) return;

        ethereum.on('accountsChanged', () => {
            setupConnection();
        });
        ethereum.on('chainChanged', () => {
            setupConnection();
        });

        return () => {
            ethereum.removeListener('accountsChanged', setupConnection);
            ethereum.removeListener('chainChanged', setupConnection);
        };
    }, []);

    return {
        ...state,
        connectWallet,
        disconnectWallet,
    };
}