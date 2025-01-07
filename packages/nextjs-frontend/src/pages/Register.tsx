import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Github } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export function Register() {
    const [githubUsername, setGithubUsername] = useState('');
    const { provider } = useWallet();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement GitHub authentication and registration
        console.log('Register with GitHub username:', githubUsername);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center">Register as a Developer</h1>

                    {!provider ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-600 mb-4">
                                Please connect your wallet to register
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                            <div className="mb-4">
                                <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 mb-2">
                                    GitHub Username
                                </label>
                                <input
                                    type="text"
                                    id="githubUsername"
                                    value={githubUsername}
                                    onChange={(e) => setGithubUsername(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your GitHub username"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Github className="h-4 w-4 mr-2" />
                                Authenticate with GitHub
                            </button>

                            <p className="mt-4 text-sm text-gray-500 text-center">
                                By registering, you agree to create a developer profile and token on Nexon
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}