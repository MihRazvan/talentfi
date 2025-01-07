import React from 'react';
import { Asterisk } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-auto py-8 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center space-x-2">
                        <Asterisk className="w-6 h-6 text-gradient-primary" />
                        <span className="text-xl font-light">nexon</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        Developed by magento & jensei for Lens Holiday Hackathon (❁´◡`❁)
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;