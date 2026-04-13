import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Accent palette aligned with the legacy `--color-accent` (indigo) used across the app.
const indigo: MantineColorsTuple = [
  '#eef2ff',
  '#e0e7ff',
  '#c7d2fe',
  '#a5b4fc',
  '#818cf8',
  '#6366f1',
  '#4f46e5',
  '#4338ca',
  '#3730a3',
  '#312e81',
];

export const mantineTheme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 4 },
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
    brand: indigo,
  },
  cursorType: 'pointer',
});
