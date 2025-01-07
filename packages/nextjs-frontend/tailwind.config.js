/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                coral: 'var(--color-coral)',
                gold: 'var(--color-gold)',
                sage: 'var(--color-sage)',
                turquoise: 'var(--color-turquoise)',
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
};