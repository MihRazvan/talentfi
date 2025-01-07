import { useEffect, useState } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { mockDevelopers } from '../data/mockData';
import { Developer, CreatorToken } from '../types';
import { Contract } from 'zksync-ethers';
import TalentRegistryABI from '../abi/TalentRegistry.json';
import CreatorTokenABI from '../abi/CreatorToken.json';

export interface CreatorData extends Developer {
    tokenData?: CreatorToken;
    isClaimed: boolean;
}

export function useCreatorData() {
    const { provider } = useWalletContext();
    const [creators, setCreators] = useState<CreatorData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                if (!provider) {
                    setCreators(mockDevelopers.map(dev => ({
                        ...dev,
                        isClaimed: false,
                        tokenData: {
                            name: dev.analysis.market_metrics.suggested_token_name,
                            symbol: dev.analysis.market_metrics.suggested_token_symbol,
                            price: Number(dev.analysis.market_metrics.suggested_initial_price) / 1e18,
                            balance: 0,
                            volume24h: 0
                        }
                    })));
                    setLoading(false);
                    return;
                }

                const registryContract = new Contract(
                    import.meta.env.VITE_REGISTRY_ADDRESS,
                    TalentRegistryABI.abi,
                    provider
                );

                const enrichedData = await Promise.all(
                    mockDevelopers.map(async (dev) => {
                        try {
                            const developerInfo = await registryContract.getDeveloperByAddress(dev.developer_address);
                            const isClaimed = developerInfo.isRegistered;

                            let tokenData: CreatorToken | undefined;

                            if (isClaimed && developerInfo.tokenAddress) {
                                const tokenContract = new Contract(
                                    developerInfo.tokenAddress,
                                    CreatorTokenABI.abi,
                                    provider
                                );

                                const currentPrice = await tokenContract.getCurrentPrice();

                                tokenData = {
                                    name: dev.analysis.market_metrics.suggested_token_name,
                                    symbol: dev.analysis.market_metrics.suggested_token_symbol,
                                    price: Number(currentPrice) / 1e18,
                                    balance: 0,
                                    volume24h: 0
                                };
                            } else {
                                tokenData = {
                                    name: dev.analysis.market_metrics.suggested_token_name,
                                    symbol: dev.analysis.market_metrics.suggested_token_symbol,
                                    price: Number(dev.analysis.market_metrics.suggested_initial_price) / 1e18,
                                    balance: 0,
                                    volume24h: 0
                                };
                            }

                            return {
                                ...dev,
                                isClaimed,
                                tokenData
                            };
                        } catch (err) {
                            console.error(`Error fetching data for ${dev.username}:`, err);
                            return {
                                ...dev,
                                isClaimed: false,
                                tokenData: {
                                    name: dev.analysis.market_metrics.suggested_token_name,
                                    symbol: dev.analysis.market_metrics.suggested_token_symbol,
                                    price: Number(dev.analysis.market_metrics.suggested_initial_price) / 1e18,
                                    balance: 0,
                                    volume24h: 0
                                }
                            };
                        }
                    })
                );

                setCreators(enrichedData);
            } catch (err) {
                console.error('Error fetching creator data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch creator data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [provider]);

    return { creators, loading, error };
}