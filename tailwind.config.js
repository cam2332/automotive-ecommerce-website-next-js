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
                'body-color': '#f1faee',
            },
            inset: {
                '50%-512px': 'calc(50% - 512px)'
            },
            minHeight: {
                '8': '32px',
                'screen-96px': 'calc(100vh - 96px)'
            },
            width: {
                '70%': '70%',
                '90%': '90%',
                '350px': '350px',
                '5xl': '1024px'
            },
            minWidth: {
                '70px': '70px',
                '200px': '200px',
                '225px': '225px',
                '250px': '250px'
            },
            maxWidth: {
                '160px': '160px',
                'full-96px': 'calc(100% - 96px)'
            },
            margin: {
                '-21': '-5.25rem'
            },
            padding: {
                '2px': '2px'
            },
            zIndex: {
                '100': '100'
            },
            scale: {
                '200': '2'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}