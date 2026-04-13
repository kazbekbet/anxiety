import { ActionIcon, Tooltip } from '@mantine/core';
import { useTheme, type Theme } from '@/shared/lib/theme-context';

const options: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
  { value: 'system', label: 'Система' },
];

export function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme();

  const cycle = () => {
    const idx = options.findIndex((o) => o.value === theme);
    setTheme(options[(idx + 1) % options.length].value);
  };

  const label = options.find((o) => o.value === theme)?.label ?? '';

  return (
    <Tooltip label={label} position="right" withArrow>
      <ActionIcon
        onClick={cycle}
        variant="subtle"
        color="gray"
        size="lg"
        radius="lg"
        aria-label={label}
        mt={4}
      >
        {resolved === 'dark' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        )}
      </ActionIcon>
    </Tooltip>
  );
}
