export type CreatorType = 'Developer' | 'NFT-Creator' | 'Musician' | 'Trader';

export interface InputConfig {
    label: string;
    placeholder: string;
}

export const inputConfigs: Record<CreatorType, InputConfig> = {
    Developer: {
        label: 'Enter Github Username',
        placeholder: 'e.g., vitalik'
    },
    'NFT-Creator': {
        label: 'Enter Opensea Address',
        placeholder: '0x...'
    },
    Musician: {
        label: 'Enter Spotify Name',
        placeholder: 'e.g., Drake'
    },
    Trader: {
        label: 'Enter DeBank Account',
        placeholder: '0x...'
    }
};