/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', 'system-ui', 'sans-serif'],
            },
            colors: {
                nexon: {
                    coral: '#FF7E6B',
                    gold: '#FFD700',
                    sage: '#98FB98',
                    turquoise: '#40E0D0',
                },
            },
        },
    },
    plugins: [],
};