export const theme = {
  colors: {
    primary: {
      eucalyptus: '#536641', // Main eucalyptus green (darker)
      eucalyptusLight: '#9CAF88', // Lighter eucalyptus
      eucalyptusDark: '#5A6B4A', // Darker eucalyptus
      sage: '#9CAF88', // Keep for compatibility
      sageLight: '#B8C4A6', // Lighter sage
      sageDark: '#7A8B6B', // Darker sage
    },
    secondary: {
      gold: '#D4AF37', // Main gold
      goldLight: '#E6C547', // Lighter gold
      goldDark: '#B8941F', // Darker gold
    },
    accent: {
      sunflower: '#F4D03F', // Sunflower yellow
      sunflowerDark: '#D4AC0D', // Darker sunflower
      sunflowerBright: '#FFD700', // Bright sunflower
    },
    neutral: {
      white: '#FFFFFF',
      cream: '#F8F6F0',
      lightGray: '#F5F5F5',
      gray: '#6B6B6B',
      darkGray: '#3A3A3A',
      black: '#1A1A1A',
      mutedGreen: '#5A6B4A', // Dark muted green from invitation
    },
    status: {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
    }
  },
  fonts: {
    heading: '"Playfair Display", serif', // Elegant serif for headings
    body: '"Inter", sans-serif', // Clean sans-serif for body
    script: '"Dancing Script", cursive', // Script font for names
    serif: '"Playfair Display", serif', // Serif for formal text
    display: '"Playfair Display", serif', // Display font for titles
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '50%',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  }
}

export type Theme = typeof theme
