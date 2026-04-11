import { useState } from 'react';
import { Button, Card } from '@/shared/ui';

const BODY_ZONES = [
  { id: 'head', label: 'Голова', y: 8, x: 50 },
  { id: 'throat', label: 'Горло', y: 18, x: 50 },
  { id: 'chest', label: 'Грудь', y: 30, x: 50 },
  { id: 'shoulders', label: 'Плечи', y: 25, x: 30 },
  { id: 'stomach', label: 'Живот', y: 42, x: 50 },
  { id: 'hands', label: 'Руки', y: 48, x: 22 },
  { id: 'legs', label: 'Ноги', y: 70, x: 40 },
] as const;

type ZoneId = (typeof BODY_ZONES)[number]['id'];

const SENSATIONS = ['Напряжение', 'Давление', 'Жжение', 'Дрожь', 'Скованность', 'Покалывание'];

interface BodyScanProps {
  onComplete: (zones: { zone: string; sensation: string }[]) => void;
  onCancel: () => void;
}

export function BodyScan({ onComplete, onCancel }: BodyScanProps) {
  const [selected, setSelected] = useState<Map<ZoneId, string>>(new Map());
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);

  const toggleZone = (zoneId: ZoneId) => {
    if (selected.has(zoneId)) {
      const next = new Map(selected);
      next.delete(zoneId);
      setSelected(next);
      setActiveZone(null);
    } else {
      setActiveZone(zoneId);
    }
  };

  const setSensation = (sensation: string) => {
    if (!activeZone) return;
    const next = new Map(selected);
    next.set(activeZone, sensation);
    setSelected(next);
    setActiveZone(null);
  };

  const handleComplete = () => {
    const zones = Array.from(selected.entries()).map(([zone, sensation]) => ({ zone, sensation }));
    onComplete(zones);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted text-center">Нажмите на зоны, где вы чувствуете тревогу</p>

      {/* Body silhouette */}
      <div className="relative mx-auto" style={{ width: 200, height: 300 }}>
        {/* Simple body outline */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-elevated">
          {/* Head */}
          <circle cx="50" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Body */}
          <line x1="50" y1="18" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" />
          {/* Arms */}
          <line x1="50" y1="25" x2="25" y2="45" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="25" x2="75" y2="45" stroke="currentColor" strokeWidth="1.5" />
          {/* Legs */}
          <line x1="50" y1="50" x2="35" y2="80" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="65" y2="80" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {/* Clickable zones */}
        {BODY_ZONES.map((zone) => {
          const isSelected = selected.has(zone.id);
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => toggleZone(zone.id)}
              aria-label={zone.label}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                isSelected
                  ? 'h-8 w-8 bg-red-400/60 dark:bg-red-500/50 ring-2 ring-red-400'
                  : isActive
                    ? 'h-8 w-8 bg-accent/40 ring-2 ring-accent'
                    : 'h-6 w-6 bg-accent/20 hover:bg-accent/30'
              }`}
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            />
          );
        })}
      </div>

      {/* Zone labels */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {BODY_ZONES.map((zone) => {
          const sensation = selected.get(zone.id);
          return (
            <span
              key={zone.id}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                sensation
                  ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : 'bg-elevated text-faint'
              }`}
            >
              {zone.label}{sensation ? `: ${sensation}` : ''}
            </span>
          );
        })}
      </div>

      {/* Sensation picker */}
      {activeZone && (
        <Card className="animate-fade-in">
          <p className="text-sm font-medium text-fg mb-2">
            {BODY_ZONES.find((z) => z.id === activeZone)?.label} — что вы чувствуете?
          </p>
          <div className="flex flex-wrap gap-2">
            {SENSATIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSensation(s)}
                className="rounded-full bg-elevated px-3 py-1.5 text-sm text-subtle hover:bg-hover transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="ghost" fullWidth onClick={onCancel}>Отмена</Button>
        <Button fullWidth onClick={handleComplete} disabled={selected.size === 0}>
          Готово ({selected.size})
        </Button>
      </div>
    </div>
  );
}
