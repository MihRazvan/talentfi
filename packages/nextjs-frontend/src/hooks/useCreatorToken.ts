import { Contract, BrowserProvider } from 'ethers';
import CreatorTokenABI from '../abi/CreatorToken.json';
import { useCallback } from 'react';
import { useWallet } from './useWallet';

export function useCreatorToken(tokenAddress: string) {
    const { provider: walletProvider, address } = useWallet();

    const buyTokens = useCallback(async (amount: string) => {
        if (!walletProvider || !tokenAddress || !address) return;

        try {
            const signer = await walletProvider.getSigner();
            const contract = new Contract(tokenAddress, CreatorTokenABI.abi, signer);
            const tx = await contract.buy({ value: amount });
            await tx.wait();
            return tx;
        } catch (error) {
            console.error('Error buying tokens:', error);
            throw error;
        }
    }, [walletProvider, tokenAddress, address]);

    const sellTokens = useCallback(async (amount: string) => {
        if (!walletProvider || !tokenAddress || !address) return;

        try {
            const signer = await walletProvider.getSigner();
            const contract = new Contract(tokenAddress, CreatorTokenABI.abi, signer);
            const tx = await contract.sell(amount);
            await tx.wait();
            return tx;
        } catch (error) {
            console.error('Error selling tokens:', error);
            throw error;
        }
    }, [walletProvider, tokenAddress, address]);

    const getTokenInfo = useCallback(async () => {
        if (!walletProvider || !tokenAddress) return null;

        try {
            const contract = new Contract(tokenAddress, CreatorTokenABI.abi, walletProvider);
            const [price, totalSupply] = await Promise.all([
                contract.price(),
                contract.totalSupply()
            ]);
            return { price, totalSupply };
        } catch (error) {
            console.error('Error getting token info:', error);
            return null;
        }
    }, [walletProvider, tokenAddress]);

    return {
        buyTokens,
        sellTokens,
        getTokenInfo
    };
}