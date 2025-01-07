import React, { useState, useEffect } from 'react';
import { useCreatorToken } from '../hooks/useCreatorToken';
import { useWallet } from '../hooks/useWallet';

interface TokenTradingProps {
    tokenAddress: string;
    symbol: string;
}

export function TokenTrading({ tokenAddress, symbol }: TokenTradingProps) {
    const [amount, setAmount] = useState('');
    const [tokenInfo, setTokenInfo] = useState<any>(null);
    const { buyTokens, sellTokens, getTokenInfo } = useCreatorToken(tokenAddress);
    const { provider } = useWallet();

    useEffect(() => {
        const fetchTokenInfo = async () => {
            const info = await getTokenInfo();
            setTokenInfo(info);
        };

        if (tokenAddress) {
            fetchTokenInfo();
        }
    }, [tokenAddress, getTokenInfo]);

    const handleBuy = async () => {
        try {
            await buyTokens(amount);
            // Refresh token info after transaction
            const info = await getTokenInfo();
            setTokenInfo(info);
            setAmount('');
        } catch (error) {
            console.error('Error buying tokens:', error);
        }
    };

    const handleSell = async () => {
        try {
            await sellTokens(amount);
            // Refresh token info after transaction
            const info = await getTokenInfo();
            setTokenInfo(info);
            setAmount('');
        } catch (error) {
            console.error('Error selling tokens:', error);
        }
    };

    if (!provider) {
        return (
            <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-center text-gray-600">
                    Please connect your wallet to trade tokens
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Trade {symbol} Tokens</h2>

            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Current Price</span>
                    <span>{tokenInfo?.price ? `${tokenInfo.price} ETH` : 'Loading...'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Supply</span>
                    <span>{tokenInfo?.totalSupply || 'Loading...'}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter amount"
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={handleBuy}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Buy
                    </button>
                    <button
                        onClick={handleSell}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Sell
                    </button>
                </div>
            </div>
        </div>
    );
}