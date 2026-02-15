import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ibm: {
                    blue: {
                        10: '#edf5ff',
                        20: '#d0e2ff',
                        30: '#a6c8ff',
                        40: '#78a9ff',
                        50: '#4589ff',
                        60: '#0f62fe',
                        70: '#0043ce',
                        80: '#002d9c',
                        90: '#001d6c',
                        100: '#001141',
                    },
                    gray: {
                        10: '#f4f4f4',
                        20: '#e0e0e0',
                        30: '#c6c6c6',
                        50: '#8d8d8d',
                        60: '#6f6f6f',
                        70: '#525252',
                        80: '#393939',
                        90: '#262626',
                        100: '#161616',
                    },
                    teal: {
                        40: '#08bdba',
                        50: '#009d9a',
                        60: '#007d79',
                    },
                    purple: {
                        50: '#a56eff',
                        60: '#8a3ffc',
                    },
                    cyan: {
                        40: '#33b1ff',
                        50: '#1192e8',
                    }
                }
            },
            fontFamily: {
                sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
                'counter': 'counter 2s ease-out forwards',
                'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
                'gradient-shift': 'gradientShift 8s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '0.8' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
