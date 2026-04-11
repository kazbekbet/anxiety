import type { Technique } from '@/shared/types';
import { Card } from '@/shared/ui';

interface TechniqueCardProps {
  technique: Technique;
  onStart: (technique: Technique) => void;
}

const categoryBadge = {
  cbt: { bg: 'bg-badge-cbt', text: 'text-badge-cbt-fg', label: 'КПТ' },
  existential: { bg: 'bg-badge-existential', text: 'text-badge-existential-fg', label: 'Экзистенциальная' },
};

export function TechniqueCard({ technique, onStart }: TechniqueCardProps) {
  const badge = categoryBadge[technique.category];

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
