import type { Config } from "tailwindcss";

const config: Config = {
  // 🎯 Use 'class' to allow manual toggle via useTheme
  darkMode: "class", 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF8C00', // Aapka Saffron Dot 
        // Ye niche wale variables globals.css se connect honge
        'brand-bg': 'var(--background)',
        'brand-text': 'var(--foreground)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      borderWidth: {
        '12': '12px',
      },
    },
  },
  plugins: [],
};
export default config;