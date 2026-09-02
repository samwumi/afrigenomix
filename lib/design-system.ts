// Afrigenomix Design System
// Premium, scientific, trustworthy visual identity

export const colors = {
  // Primary Palette
  navy: {
    50: '#f0f4f8',
    100: '#d9e2ec',
    200: '#bcccdc',
    300: '#9fb3c8',
    400: '#829ab1',
    500: '#627d98',
    600: '#486581',
    700: '#334e68',
    800: '#243b53',
    900: '#102a43',
  },
  
  // Secondary - Teal/Blue
  teal: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Neutrals
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status Colors
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',
    dark: '#065f46',
  },
  
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#92400e',
  },
  
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#991b1b',
  },
  
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1e40af',
  },
};

export const typography = {
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    display: 'Cal Sans, Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

export const animations = {
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  duration: {
    fast: 150,
    base: 300,
    slow: 500,
  },
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Component-specific styles
export const components = {
  button: {
    primary: {
      bg: colors.navy[700],
      hover: colors.navy[800],
      text: '#ffffff',
    },
    secondary: {
      bg: colors.teal[600],
      hover: colors.teal[700],
      text: '#ffffff',
    },
    outline: {
      border: colors.navy[300],
      hover: colors.navy[50],
      text: colors.navy[700],
    },
  },
  
  card: {
    bg: '#ffffff',
    border: colors.gray[200],
    shadow: shadows.md,
    hover: shadows.lg,
  },
  
  badge: {
    success: {
      bg: colors.success.light,
      text: colors.success.dark,
    },
    warning: {
      bg: colors.warning.light,
      text: colors.warning.dark,
    },
    error: {
      bg: colors.error.light,
      text: colors.error.dark,
    },
    info: {
      bg: colors.info.light,
      text: colors.info.dark,
    },
  },
};

// Case Status Color Mapping
export const caseStatusColors = {
  PENDING: colors.gray[500],
  DOCUMENTS_SUBMITTED: colors.info.DEFAULT,
  DOCUMENTS_VERIFIED: colors.success.DEFAULT,
  AWAITING_COLLECTION: colors.warning.DEFAULT,
  COLLECTION_SCHEDULED: colors.info.DEFAULT,
  COLLECTION_COMPLETED: colors.success.DEFAULT,
  SAMPLE_IN_TRANSIT: colors.teal[500],
  SAMPLE_RECEIVED: colors.success.DEFAULT,
  TESTING_IN_PROGRESS: colors.teal[600],
  QUALITY_REVIEW: colors.warning.DEFAULT,
  RESULT_READY: colors.success.DEFAULT,
  RESULT_RELEASED: colors.success.dark,
  COMPLETED: colors.success.dark,
  CANCELLED: colors.error.DEFAULT,
};
