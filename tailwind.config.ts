import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          DEFAULT: '#007bff',
          hover: '#0056b3',
        },
        secondary: {
          DEFAULT: '#6c757d',
          hover: '#5a6268',
        },
        background: {
          DEFAULT: '#f8f9fa',
          card: '#ffffff',
          cardHover: '#f0f0f0',
        },
        text: {
          DEFAULT: '#343a40',
          secondary: '#6c757d',
        },
        
        // Dark mode colors
        dark: {
          primary: {
            DEFAULT: '#375a7f',
            hover: '#2c4866',
          },
          secondary: {
            DEFAULT: '#444444',
            hover: '#363636',
          },
          background: {
            DEFAULT: '#222222',
            card: '#2d2d2d',
            cardHover: '#363636',
          },
          text: {
            DEFAULT: '#f8f9fa',
            secondary: '#adb5bd',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
