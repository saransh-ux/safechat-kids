/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                indigo: { 50: '#F0F5FF', 100: '#E5EDFF', 200: '#CDDFFF', 300: '#B2CEFF', 400: '#7FAAF9', 500: '#407BFF', 600: '#2A5CFF', 700: '#1D44E5', 800: '#1B37B2', 900: '#19308A', 950: '#111F5E' },
                blue: { 50: '#E6FAFF', 100: '#CCF3FF', 200: '#99E7FF', 300: '#66DBFF', 400: '#33CFFF', 500: '#00C3FF', 600: '#009ECC', 700: '#007AA3', 800: '#00587A', 900: '#003A52' },
                yellow: { 50: '#FFFCE8', 100: '#FFF7C2', 200: '#FFEFA3', 300: '#FFE67A', 400: '#FFDF5C', 500: '#FFD12B', 600: '#E6B917', 700: '#B38F0E', 800: '#806405', 900: '#4D3B00' },
                pink: { 50: '#FFF0F5', 100: '#FFE0EC', 200: '#FFC2D9', 300: '#FFA3C6', 400: '#FF669E', 500: '#FF337A', 600: '#E6195E', 700: '#B30042', 800: '#80002E', 900: '#4D001B' },
                emerald: { 50: '#E8FDF5', 100: '#D1FBEA', 200: '#A3F6D4', 300: '#75F0BF', 400: '#47EBAA', 500: '#1AE695', 600: '#00CC7A', 700: '#00995C', 800: '#00663D', 900: '#00331F' },
                slate: { 50: '#FDFDFD', 100: '#F5F7F9', 200: '#E8EAED', 300: '#D8DBDF', 400: '#C4C8CD', 500: '#A9AFB6', 600: '#8A9198', 700: '#646A72', 800: '#464C54', 900: '#31363C', 950: '#202428' },
                rose: { 50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF', 400: '#FB7185', 500: '#F43F5E', 600: '#E11D48', 700: '#BE123C', 800: '#9F1239', 900: '#881337' }
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-5deg)' },
                    '50%': { transform: 'rotate(5deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(25px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pop: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(50px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'slide-in-left': {
                    '0%': { transform: 'translateX(-50px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                }
            },
            animation: {
                wiggle: 'wiggle 2s ease-in-out infinite',
                float: 'float 3s ease-in-out infinite',
                'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
                'fade-in': 'fade-in 0.6s ease-out forwards',
                'pop': 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
                'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
                'spin-slow': 'spin 8s linear infinite',
                'bounce-slow': 'bounce 2s infinite',
            }
        },
    },
    plugins: [],
}
