import type { Technique } from '@/shared/types';
import { Card } from '@/shared/ui';

interface TechniqueCardProps {
  technique: Technique;
  onStart: (technique: Technique) => void;
  locked?: boolean;
  unlockProgress?: { current: number; required: number };
  onManualUnlock?: () => void;
}

const categoryBadge = {
  cbt: { bg: 'bg-badge-cbt', text: 'text-badge-cbt-fg', label: 'КПТ' },
  existential: { bg: 'bg-badge-existential', text: 'text-badge-existential-fg', label: 'Экзистенциальная' },
};

export function TechniqueCard({ technique, onStart, locked, unlockProgress, onManualUnlock }: TechniqueCardProps) {
  const badge = categoryBadge[technique.category];

  if (locked) {
    return (
      <Card className="opacity-60">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
              <span className="text-xs text-faint">{technique.duration}</span>
            </div>
            <h3 className="font-semibold text-fg">{technique.title}</h3>
            {unlockProgress && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-hover">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${(unlockProgress.current / unlockProgress.required) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-faint">
                  Ещё {unlockProgress.required - unlockProgress.current} раз для разблокировки
                </p>
              </div>
            )}
            {onManualUnlock && (
              <button onClick={onManualUnlock} className="mt-2 text-xs text-accent-fg">
                Разблокировать
              </button>
            )}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-elevated text-faint">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer active:scale-[0.98] transition-transform duration-150"
      onClick={() => onStart(technique)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
            <span className="text-xs text-faint">{technique.duration}</span>
          </div>
          <h3 className="font-semibold text-fg">{technique.title}</h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">{technique.description}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-fg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </Card>
  );
}
