import React, { useState, useEffect } from 'react';
import { useCreatorToken } from '../hooks/useCreatorToken';
import { useWallet } from '../hooks/useWallet';
import { formatEther, parseEther } from 'ethers';

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
            const interval = setInterval(fetchTokenInfo, 10000);
            return () => clearInterval(interval);
        }
    }, [tokenAddress, getTokenInfo]);

    const handleBuy = async () => {
        try {
            const valueToSend = parseEther(amount);
            await buyTokens(valueToSend.toString());
            const info = await getTokenInfo();
            setTokenInfo(info);
            setAmount('');
        } catch (error) {
            console.error('Error buying tokens:', error);
        }
    };

    const handleSell = async () => {
        if (!tokenInfo?.balance || parseFloat(formatEther(tokenInfo.balance)) < parseFloat(amount)) {
            alert('Insufficient token balance');
            return;
        }

        try {
            const tokensToSell = parseEther(amount);
            await sellTokens(tokensToSell.toString());
            const info = await getTokenInfo();
            setTokenInfo(info);
            setAmount('');
        } catch (error) {
            console.error('Error selling tokens:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Trade ${symbol} Tokens</h2>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="font-medium">
                        {tokenInfo?.price ? formatEther(tokenInfo.price) : '0'} GRASS
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Your Balance</p>
                    <p className="font-medium">
                        {tokenInfo?.balance ? formatEther(tokenInfo.balance) : '0'} ${symbol}
                    </p>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm text-gray-600">
                        Amount
                    </label>
                    <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="0.0"
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handleBuy}
                        disabled={!provider}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        Buy
                    </button>
                    <button
                        onClick={handleSell}
                        disabled={!provider}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                        Sell
                    </button>
                </div>
            </div>
        </div>
    );
}