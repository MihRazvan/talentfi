// Import the registration data
import registrationData from './registrations.json';

// Export the developers data
export const mockDevelopers = registrationData.registrations;

// Mock data for activity feed
export const mockActivityFeed = [
    {
        username: "0xkoiner",
        amount: "45.40",
        price: "89¢",
        time: "20s"
    },
    {
        username: "0xmebius",
        amount: "34.81",
        price: "92¢",
        time: "35s"
    },
    {
        username: "robsecord",
        amount: "33.78",
        price: "46¢",
        time: "1m"
    },
    {
        username: "CryptoNinja0331",
        amount: "31.08",
        price: "48¢",
        time: "2m"
    },
    {
        username: "0xbunnygirl",
        amount: "30.00",
        price: "45¢",
        time: "2m"
    }
];

// Mock data for top volume
export const mockTopVolume = [
    {
        username: "0xkoiner",
        volume: "840,103.99"
    },
    {
        username: "0xmebius",
        volume: "756,799.99"
    },
    {
        username: "robsecord",
        volume: "685,103.99"
    },
    {
        username: "CryptoNinja0331",
        volume: "481,103.99"
    },
    {
        username: "0xbunnygirl",
        volume: "320,769.99"
    }
];