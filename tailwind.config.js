module.exports = {
    mode: 'jit',
    purge: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'primary-color': {
                    DEFAULT: '#20548E',
                    '50': '#F3F7FC',
                    '100': '#D6E5F6',
                    '200': '#9CC0E9',
                    '300': '#619BDB',
                    '400': '#2D76C8',
                    '500': '#20548E',
                    '600': '#173B64',
                    '700': '#0D233B',
                    '800': '#040A11',
                    '900': '#000000'
                },
                'secondary-color': '#ff0000',
                'secondary-color-hover': '#b30000',
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}