import { Provider } from 'zksync-ethers';
import { useMemo } from 'react';

export function useProvider() {
    return useMemo(() => {
        try {
            return new Provider('https://rpc.testnet.lens.dev');
        } catch (error) {
            console.error('Failed to create provider:', error);
            return null;
        }
    }, []);
}