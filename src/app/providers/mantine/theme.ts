import {
  createTheme,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from '@mantine/core';

/**
 * Brand palette — indigo with a hint of violet at the darker shades so the
 * accent reads warmer than plain slate-indigo across both color schemes.
 */
const brand: MantineColorsTuple = [
  '#eef0ff',
  '#dde1ff',
  '#b6bdff',
  '#8d96ff',
  '#6b74f6',
  '#5a63ea',
  '#4e54d4',
  '#3f43b5',
  '#333791',
  '#2b2e7a',
];

/**
 * Calm / secondary accent — soft teal-mint, used for "positive" surfaces
 * (improvement indicators, completion states).
 */
const calm: MantineColorsTuple = [
  '#e7fbf5',
  '#d0f5e9',
  '#a3ead1',
  '#72dfb8',
  '#4ad5a3',
  '#33d097',
  '#25c38d',
  '#16ad79',
  '#009a6a',
  '#008659',
];

/**
 * Warm / tertiary accent — coral-rose, used sparingly for highlights and
 * category badges to balance the otherwise cool palette.
 */
const warm: MantineColorsTuple = [
  '#ffedef',
  '#ffd7da',
  '#ffabb1',
  '#ff7c87',
  '#ff5463',
  '#ff3b4c',
  '#ff2c40',
  '#e41d32',
  '#cc132b',
  '#b20222',
];

export const mantineTheme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 5, dark: 4 },
  defaultRadius: 'md',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '600',
  },
  radius: {
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
  },
  colors: {
    brand,
    calm,
    warm,
  },
  defaultGradient: { from: 'brand.5', to: 'warm.4', deg: 135 },
  cursorType: 'pointer',
  other: {
    // Reusable cross-component tokens (consumed via theme.other.* in styles).
    bodyGradientLight:
      'radial-gradient(at 0% 0%, rgba(234, 225, 255, 0.9) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255, 225, 235, 0.7) 0px, transparent 50%), linear-gradient(180deg, #fbf9ff 0%, #f5f3ff 100%)',
    bodyGradientDark:
      'radial-gradient(at 0% 0%, rgba(59, 45, 105, 0.55) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(85, 40, 80, 0.35) 0px, transparent 50%), linear-gradient(180deg, #15131f 0%, #0f0d1a 100%)',
  },
});

/**
 * Resolves additional CSS variables for softer, more colorful surfaces than
 * Mantine's defaults. Consumed via `var(...)` in components.
 */
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-body': '#fbfaff',
    '--mantine-color-default-hover': '#f1eeff',
    '--app-surface-muted': '#f3f0ff',
    '--app-surface-card': '#ffffff',
    '--app-surface-highlight': '#eef0ff',
    '--app-border-soft': '#e6e1f5',
    '--app-shadow-card': '0 2px 12px -2px rgba(61, 52, 120, 0.08)',
  },
  dark: {
    '--mantine-color-body': '#15131f',
    '--mantine-color-default-hover': '#22202f',
    '--app-surface-muted': '#1d1a2b',
    '--app-surface-card': '#1b1928',
    '--app-surface-highlight': '#27233a',
    '--app-border-soft': '#2d2942',
    '--app-shadow-card': '0 2px 12px -2px rgba(0, 0, 0, 0.4)',
  },
});
