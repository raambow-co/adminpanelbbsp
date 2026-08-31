/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BBSP Core Brand Colors
        primary: {
          DEFAULT: '#10367D',       // Deep Royal Blue
          hover: '#1A4594',         // Secondary Accent Blue
          dark: '#0B275C',          // Dark Institutional Blue
          dim: 'rgba(16, 54, 125, 0.6)',
          glow: 'rgba(16, 54, 125, 0.05)',
        },
        secondary: '#1A4594',
        
        // Canvas & Surfaces
        canvas: '#EBEBEB',          // Light Canvas Background (--bg-dark)
        surface: {
          DEFAULT: '#FFFFFF',       // Card / Surface White (--bg-card)
          hover: '#FAF9F6',         // Surface Hover (--bg-card-hover)
          elevated: '#F5F6F9',
        },
        glass: 'rgba(255, 255, 255, 0.85)',
        
        // Borders & Dividers
        bbsp: {
          border: 'rgba(16, 54, 125, 0.12)',
          'border-highlight': 'rgba(165, 206, 224, 0.6)',
          glow: 'rgba(16, 54, 125, 0.05)',
        },
        
        // Text & Hierarchy
        text: {
          main: '#10367D',          // Primary deep royal blue
          muted: '#1A4594',         // Secondary royal blue
          dim: 'rgba(16, 54, 125, 0.6)', // Low-emphasis blue
        },
        
        // 4 Ecosystem Pillars
        pillar: {
          solar: '#A5CEE0',         // Solar / Renewable Energy (Ice/Sky Blue)
          loans: '#80B5CE',         // Loans / Financial Services (Soft Teal Blue)
          realty: '#5A9CBE',        // Real Estate / Infrastructure (Ocean Blue)
          edtech: '#3B7E9F',        // Education / EdTech (Deep Steel Blue)
        },
        
        // Extended BBSP Tokens
        brandGold: '#D57530',       // Warm Terracotta / Amber
        solar: '#D57530',
        loans: '#9FB768',
        realty: '#FFBC92',
        edtech: '#FBF8E0',
        darkBase: '#FAF9F6',
        darkSurface: '#FFFFFF',
        stone: {
          550: '#78716c',
          605: '#57534e',
          650: '#514d4a',
          750: '#2d2a29',
          805: '#22201f',
          850: '#1d1b1a',
          905: '#100e0d',
        }
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'bbsp-card': '0 4px 20px -2px rgba(16, 54, 125, 0.06), 0 2px 6px -1px rgba(16, 54, 125, 0.04)',
        'bbsp-card-hover': '0 12px 30px -4px rgba(16, 54, 125, 0.12), 0 4px 12px -2px rgba(16, 54, 125, 0.06)',
        'bbsp-glow': '0 0 25px rgba(16, 54, 125, 0.12)',
        'solar-glow': '0 0 20px rgba(165, 206, 224, 0.35)',
        'loans-glow': '0 0 20px rgba(128, 181, 206, 0.35)',
        'realty-glow': '0 0 20px rgba(90, 156, 190, 0.35)',
        'edtech-glow': '0 0 20px rgba(59, 126, 159, 0.35)',
      }
    },
  },
  plugins: [],
}
