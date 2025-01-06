import { Creator } from '../types/creator';

export const mockCreators: Creator[] = [
    {
        id: '1',
        handle: '@arachnid',
        name: 'Nick Johnson',
        avatar: '/dashboard/creator1.png',
        price: 400.81,
        tokenSymbol: '$ARCH',
        skills: ['Solidity development', 'EVM expertise', 'Deterministic Contracts', 'DAO leadership'],
        verified: true,
        bio: 'Nick has demonstrated strong expertise in Ethereum development with a focus on ENS and core infrastructure.',
        metrics: {
            github: 8,
            technical: 9,
            web3: 9,
            community: 7,
            growth: 8
        }
    },
    {
        id: '2',
        handle: '@gakonst',
        name: 'Georgios Konstantopoulos',
        avatar: '/dashboard/creator2.png',
        price: 210.50,
        tokenSymbol: '$GAKO',
        skills: ['MEV expertise', 'Layer 2 solutions', 'Protocol knowledge'],
        verified: true,
        bio: 'Georgios has demonstrated strong expertise in blockchain development with a focus on MEV and Layer 2 solutions.',
        metrics: {
            github: 9,
            technical: 9,
            web3: 9,
            community: 8,
            growth: 9
        }
    },
    {
        id: '3',
        handle: '@pcaversaccio',
        name: 'Pascal Caversaccio',
        avatar: '/dashboard/creator3.png',
        price: 325.62,
        tokenSymbol: '$PCAV',
        skills: ['Security Research', 'DeFi Tooling', 'Educational Content'],
        verified: true,
        metrics: {
            github: 8,
            technical: 8,
            web3: 8,
            community: 7,
            growth: 8
        }
    },
    {
        id: '4',
        handle: '@frangio',
        name: 'Francisco Giordano',
        avatar: '/dashboard/creator4.png',
        price: 180.50,
        tokenSymbol: '$FRAG',
        skills: ['OS Collaboration', 'Testing Infrastructure', 'Protocol Design'],
        verified: true,
        metrics: {
            github: 9,
            technical: 8,
            web3: 8,
            community: 7,
            growth: 8
        }
    }
];