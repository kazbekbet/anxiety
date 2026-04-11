import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="flex items-start justify-between pb-2 pt-4">
      <div>
        <h1 className="text-2xl font-bold text-fg">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
