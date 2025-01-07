import React from 'react';

export function Footer() {
    return (
        <footer
            className="relative w-full py-6 mt-auto"
            style={{
                backgroundImage: 'url(/footer_background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="container mx-auto text-center">
                <p className="text-white text-sm">
                    Developed by magento & jensei for Lens Holiday Hackathon (❀◠‿◠)
                </p>
            </div>
        </footer>
    );
}