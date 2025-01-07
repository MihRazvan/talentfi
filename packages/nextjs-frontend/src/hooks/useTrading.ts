// src/hooks/useTrading.ts
import { useState } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { Contract } from 'zksync-ethers';
import CreatorTokenABI from '../abi/CreatorToken.json';

export function useTrading() {
    const { signer } = useWalletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buyTokens = async (tokenAddress: string, amount: string) => {
        if (!signer) {
            setError('Please connect your wallet first');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const amountInWei = (parseFloat(amount) * 1e18).toString();
            const tokenContract = new Contract(tokenAddress, CreatorTokenABI.abi, signer);

            const tx = await tokenContract.buy({
                value: amountInWei
            });

            await tx.wait();
        } catch (err) {
            console.error('Buy error:', err);
            setError(err instanceof Error ? err.message : 'Failed to buy tokens');
        } finally {
            setIsLoading(false);
        }
    };

    const sellTokens = async (tokenAddress: string, amount: string) => {
        if (!signer) {
            setError('Please connect your wallet first');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const amountInWei = (parseFloat(amount) * 1e18).toString();
            const tokenContract = new Contract(tokenAddress, CreatorTokenABI.abi, signer);

            const tx = await tokenContract.sell(amountInWei);
            await tx.wait();
        } catch (err) {
            console.error('Sell error:', err);
            setError(err instanceof Error ? err.message : 'Failed to sell tokens');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        buyTokens,
        sellTokens,
        isLoading,
        error
    };
}
