import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface TechniquePageLayoutProps {
  title: string;
  children: ReactNode;
}

export function TechniquePageLayout({ title, children }: TechniquePageLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => navigate('/techniques');

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-surface pt-[max(0px,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
      <header className="flex items-center gap-3 py-4">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Назад к техникам"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated text-subtle transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-fg leading-tight">{title}</h1>
      </header>

      <div>{children}</div>
    </div>
  );
}
