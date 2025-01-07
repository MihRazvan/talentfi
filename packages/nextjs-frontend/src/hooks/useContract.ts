import { Contract } from 'zksync-ethers';
import TalentRegistryABI from '../abi/TalentRegistry.json';
import { useProvider } from './useProvider';

const REGISTRY_ADDRESS = import.meta.env.VITE_REGISTRY_ADDRESS || '0xebF5B72C11808aa2dFdc5Ef8A3Fce0930F388964';

export function useTalentRegistry() {
    const provider = useProvider();

    if (!provider) return null;

    return new Contract(
        REGISTRY_ADDRESS,
        TalentRegistryABI.abi,
        provider
    );
}