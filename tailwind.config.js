module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            gridTemplateRows: {
                '[auto,auto,1fr]': 'auto auto 1fr',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
}
