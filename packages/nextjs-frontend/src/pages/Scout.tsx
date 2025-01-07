import React from 'react';
import { Layout } from '../components/Layout';

export function Scout() {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-8">Scout for Talent</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600 mb-4">
                        Coming soon! Scout will allow you to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Discover emerging developers before they go mainstream</li>
                        <li>Get notifications about rising talent</li>
                        <li>Earn rewards for successful talent discovery</li>
                        <li>Build your reputation as a talent scout</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}