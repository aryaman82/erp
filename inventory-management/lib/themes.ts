import type { ThemeConfig } from '@/types/system'

export const DEFAULT_THEMES: ThemeConfig[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and modern default theme',
    colors: {
      primary: 'hsl(221.2 83.2% 53.3%)',
      secondary: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 96%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      mutedForeground: 'hsl(215.4 16.3% 46.9%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(222.2 84% 4.9%)',
      popover: 'hsl(0 0% 100%)',
      popoverForeground: 'hsl(222.2 84% 4.9%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(221.2 83.2% 53.3%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(38.1 91.8% 60.2%)',
      info: 'hsl(199.8 95.5% 73.9%)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    darkMode: false,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Sleek dark theme for low-light environments',
    colors: {
      primary: 'hsl(213 92% 67%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      mutedForeground: 'hsl(215 20.2% 65.1%)',
      card: 'hsl(222.2 84% 4.9%)',
      cardForeground: 'hsl(210 40% 98%)',
      popover: 'hsl(222.2 84% 4.9%)',
      popoverForeground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      input: 'hsl(217.2 32.6% 17.5%)',
      ring: 'hsl(213 92% 67%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      success: 'hsl(142.1 76.2% 36.3%)',
      warning: 'hsl(38.1 91.8% 60.2%)',
      info: 'hsl(199.8 95.5% 73.9%)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    darkMode: true,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calming blue and teal color scheme',
    colors: {
      primary: 'hsl(191 91% 36%)',
      secondary: 'hsl(191 85% 96%)',
      accent: 'hsl(172 66% 50%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(191 85% 96%)',
      mutedForeground: 'hsl(191 16% 47%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(222.2 84% 4.9%)',
      popover: 'hsl(0 0% 100%)',
      popoverForeground: 'hsl(222.2 84% 4.9%)',
      border: 'hsl(191 31% 91%)',
      input: 'hsl(191 31% 91%)',
      ring: 'hsl(191 91% 36%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      success: 'hsl(160 84% 39%)',
      warning: 'hsl(42 96% 59%)',
      info: 'hsl(191 91% 36%)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    darkMode: false,
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green theme inspired by nature',
    colors: {
      primary: 'hsl(134 61% 41%)',
      secondary: 'hsl(134 40% 96%)',
      accent: 'hsl(45 93% 47%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(134 40% 96%)',
      mutedForeground: 'hsl(134 16% 47%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(222.2 84% 4.9%)',
      popover: 'hsl(0 0% 100%)',
      popoverForeground: 'hsl(222.2 84% 4.9%)',
      border: 'hsl(134 31% 91%)',
      input: 'hsl(134 31% 91%)',
      ring: 'hsl(134 61% 41%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      success: 'hsl(134 61% 41%)',
      warning: 'hsl(45 93% 47%)',
      info: 'hsl(205 78% 60%)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    darkMode: false,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and purple gradient theme',
    colors: {
      primary: 'hsl(21 90% 48%)',
      secondary: 'hsl(21 85% 96%)',
      accent: 'hsl(270 70% 55%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(21 85% 96%)',
      mutedForeground: 'hsl(21 16% 47%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(222.2 84% 4.9%)',
      popover: 'hsl(0 0% 100%)',
      popoverForeground: 'hsl(222.2 84% 4.9%)',
      border: 'hsl(21 31% 91%)',
      input: 'hsl(21 31% 91%)',
      ring: 'hsl(21 90% 48%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      success: 'hsl(134 61% 41%)',
      warning: 'hsl(21 90% 48%)',
      info: 'hsl(270 70% 55%)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    darkMode: false,
  },
]

export function applyTheme(theme: ThemeConfig) {
  if (typeof document === 'undefined') return // SSR safety
  
  const root = document.documentElement

  // Helper function to extract HSL values from hsl() strings
  const extractHslValues = (hslString: string): string => {
    // Remove 'hsl(' and ')' and return just the values
    return hslString.replace(/hsl\(/g, '').replace(/\)/g, '')
  }

  // Apply CSS variables for colors using shadcn/ui naming convention
  root.style.setProperty('--primary', extractHslValues(theme.colors.primary))
  root.style.setProperty('--secondary', extractHslValues(theme.colors.secondary))
  root.style.setProperty('--background', extractHslValues(theme.colors.background))
  root.style.setProperty('--foreground', extractHslValues(theme.colors.foreground))
  root.style.setProperty('--muted', extractHslValues(theme.colors.muted))
  root.style.setProperty('--muted-foreground', extractHslValues(theme.colors.mutedForeground))
  root.style.setProperty('--card', extractHslValues(theme.colors.card))
  root.style.setProperty('--card-foreground', extractHslValues(theme.colors.cardForeground))
  root.style.setProperty('--popover', extractHslValues(theme.colors.popover))
  root.style.setProperty('--popover-foreground', extractHslValues(theme.colors.popoverForeground))
  root.style.setProperty('--border', extractHslValues(theme.colors.border))
  root.style.setProperty('--input', extractHslValues(theme.colors.input))
  root.style.setProperty('--ring', extractHslValues(theme.colors.ring))
  root.style.setProperty('--destructive', extractHslValues(theme.colors.destructive))
  root.style.setProperty('--destructive-foreground', extractHslValues(theme.colors.destructiveForeground))
  
  // Optional colors
  if (theme.colors.accent) root.style.setProperty('--accent', extractHslValues(theme.colors.accent))
  if (theme.colors.success) root.style.setProperty('--success', extractHslValues(theme.colors.success))
  if (theme.colors.warning) root.style.setProperty('--warning', extractHslValues(theme.colors.warning))
  if (theme.colors.info) root.style.setProperty('--info', extractHslValues(theme.colors.info))

  // Apply typography
  root.style.setProperty('--font-sans', theme.typography.fontFamily)

  // Apply radius (extract just the value, not rem)
  root.style.setProperty('--radius', theme.borderRadius.md.replace('rem', 'rem'))

  // Apply dark mode class
  if (theme.darkMode) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function createCustomTheme(baseTheme: ThemeConfig, customizations: Partial<ThemeConfig>): ThemeConfig {
  return {
    ...baseTheme,
    ...customizations,
    colors: {
      ...baseTheme.colors,
      ...customizations.colors,
    },
    typography: {
      ...baseTheme.typography,
      ...customizations.typography,
    },
    spacing: {
      ...baseTheme.spacing,
      ...customizations.spacing,
    },
    borderRadius: {
      ...baseTheme.borderRadius,
      ...customizations.borderRadius,
    },
    shadows: {
      ...baseTheme.shadows,
      ...customizations.shadows,
    },
  }
}

export function generateThemeCSS(theme: ThemeConfig): string {
  let css = ':root {\n'

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    css += `  --${cssVar}: ${value};\n`
  })

  // Typography
  css += `  --font-family: ${theme.typography.fontFamily};\n`
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    css += `  --font-size-${key}: ${value};\n`
  })
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    css += `  --font-weight-${key}: ${value};\n`
  })

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`
  })

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`
  })

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`
  })

  css += '}\n'

  if (theme.darkMode) {
    css += '\n.dark {\n'
    css += '  color-scheme: dark;\n'
    css += '}\n'
  }

  return css
}
