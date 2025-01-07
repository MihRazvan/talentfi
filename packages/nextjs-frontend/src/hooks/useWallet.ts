import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider, Signer, Provider } from 'zksync-ethers';

interface WalletState {
    isConnected: boolean;
    address: string | null;
    signer: Signer | null;
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

    const addLensNetwork = async () => {
        if (!window.ethereum) return;

        try {
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
        } catch (error) {
            console.error('Failed to add Lens Network:', error);
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

            const browserProvider = new BrowserProvider(window.ethereum);
            const network = await browserProvider.getNetwork();
            const chainId = Number(network.chainId);

            if (chainId !== LENS_TESTNET_CHAIN_ID) {
                await addLensNetwork();
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${LENS_TESTNET_CHAIN_ID.toString(16)}` }],
                });
                setState(prev => ({
                    ...prev,
                    error: "Please switch to Lens Network Sepolia Testnet and try again"
                }));
                return;
            }

            const provider = new Provider(LENS_TESTNET_RPC);
            const signer = Signer.from(
                await browserProvider.getSigner(),
                LENS_TESTNET_CHAIN_ID,
                provider
            );

            const address = accounts[0];

            setState({
                isConnected: true,
                address,
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
        const ethereum = window.ethereum;
        if (!ethereum) return;

        ethereum.on('accountsChanged', disconnectWallet);
        ethereum.on('chainChanged', disconnectWallet);

        return () => {
            ethereum.removeListener('accountsChanged', disconnectWallet);
            ethereum.removeListener('chainChanged', disconnectWallet);
        };
    }, [disconnectWallet]);

    return {
        ...state,
        connectWallet,
        disconnectWallet,
    };
}