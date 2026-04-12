import { useState } from 'react';
import { Button } from '@/shared/ui';

interface Sensation {
  id: string;
  label: string;
  color: string;
  hex: string;
}

const SENSATIONS: Sensation[] = [
  { id: 'tension', label: 'Напряжение', color: 'bg-red-500', hex: '#ef4444' },
  { id: 'pressure', label: 'Давление', color: 'bg-orange-500', hex: '#f97316' },
  { id: 'burning', label: 'Жжение', color: 'bg-yellow-500', hex: '#eab308' },
  { id: 'trembling', label: 'Дрожь', color: 'bg-violet-500', hex: '#8b5cf6' },
  { id: 'stiffness', label: 'Скованность', color: 'bg-slate-500', hex: '#64748b' },
  { id: 'tingling', label: 'Покалывание', color: 'bg-cyan-500', hex: '#06b6d4' },
];

interface BodyZone {
  id: string;
  label: string;
  /** SVG path for the zone */
  d: string;
  /** Center for heatmap gradient */
  cx: number;
  cy: number;
  /** Heatmap radius */
  r: number;
}

// Androgynous flat anatomical silhouette — viewBox 200x420
const BODY_ZONES: BodyZone[] = [
  { id: 'head', label: 'Голова', d: 'M 100 18 a 28 32 0 1 1 0 0.01 Z', cx: 100, cy: 34, r: 32 },
  { id: 'throat', label: 'Горло', d: 'M 86 62 L 114 62 L 112 76 L 88 76 Z', cx: 100, cy: 70, r: 16 },
  { id: 'chest', label: 'Грудь', d: 'M 70 80 L 130 80 Q 138 95 132 128 L 68 128 Q 62 95 70 80 Z', cx: 100, cy: 105, r: 36 },
  { id: 'shoulders-l', label: 'Левое плечо', d: 'M 58 88 Q 50 98 48 115 Q 54 114 62 112 Q 68 102 68 88 Z', cx: 56, cy: 100, r: 18 },
  { id: 'shoulders-r', label: 'Правое плечо', d: 'M 142 88 Q 150 98 152 115 Q 146 114 138 112 Q 132 102 132 88 Z', cx: 144, cy: 100, r: 18 },
  { id: 'stomach', label: 'Живот', d: 'M 72 130 L 128 130 Q 132 155 128 176 L 72 176 Q 68 155 72 130 Z', cx: 100, cy: 153, r: 32 },
  { id: 'hands-l', label: 'Левая рука', d: 'M 38 150 Q 30 175 32 210 Q 42 212 50 208 Q 56 180 54 152 Z', cx: 44, cy: 180, r: 22 },
  { id: 'hands-r', label: 'Правая рука', d: 'M 162 150 Q 170 175 168 210 Q 158 212 150 208 Q 144 180 146 152 Z', cx: 156, cy: 180, r: 22 },
  { id: 'legs-l', label: 'Левая нога', d: 'M 72 180 L 98 180 L 96 290 Q 94 360 90 395 L 72 395 Q 68 320 72 180 Z', cx: 84, cy: 290, r: 42 },
  { id: 'legs-r', label: 'Правая нога', d: 'M 102 180 L 128 180 Q 132 320 128 395 L 110 395 Q 104 360 104 290 Z', cx: 116, cy: 290, r: 42 },
];

// Body outline path (used for background fill and outline stroke)
const BODY_OUTLINE = `
  M 100 4
  a 30 30 0 1 1 0 0.01
  M 100 64
  L 86 72
  L 68 82
  Q 56 90 52 108
  Q 46 135 34 152
  Q 28 180 30 212
  Q 34 216 44 214
  Q 52 212 56 208
  Q 58 190 60 172
  L 62 170
  L 60 250
  Q 58 320 60 396
  Q 62 404 72 404
  Q 82 404 84 396
  L 90 290
  L 98 290
  L 102 290
  L 110 290
  L 116 396
  Q 118 404 128 404
  Q 138 404 140 396
  Q 142 320 140 250
  L 138 170
  L 140 172
  Q 142 190 144 208
  Q 148 212 156 214
  Q 166 216 170 212
  Q 172 180 166 152
  Q 154 135 148 108
  Q 144 90 132 82
  L 114 72
  Z
`;

interface BodyScanProps {
  onComplete: (zones: { zone: string; sensation: string; intensity: number }[]) => void;
  onCancel: () => void;
}

export function BodyScan({ onComplete, onCancel }: BodyScanProps) {
  const [selections, setSelections] = useState<Map<string, { sensation: Sensation; intensity: number }>>(new Map());
  const [activeZone, setActiveZone] = useState<BodyZone | null>(null);
  const [pulsingZone, setPulsingZone] = useState<string | null>(null);

  const handleZoneClick = (zone: BodyZone) => {
    if (selections.has(zone.id)) {
      // Remove selection
      const next = new Map(selections);
      next.delete(zone.id);
      setSelections(next);
      setActiveZone(null);
      return;
    }
    // Activate zone with pulse
    setActiveZone(zone);
    setPulsingZone(zone.id);
    if ('vibrate' in navigator) navigator.vibrate(10);
    setTimeout(() => setPulsingZone(null), 600);
  };

  const selectSensation = (sensation: Sensation) => {
    if (!activeZone) return;
    const next = new Map(selections);
    next.set(activeZone.id, { sensation, intensity: next.get(activeZone.id)?.intensity ?? 3 });
    setSelections(next);
  };

  const setIntensity = (intensity: number) => {
    if (!activeZone) return;
    const existing = selections.get(activeZone.id);
    if (!existing) return;
    const next = new Map(selections);
    next.set(activeZone.id, { ...existing, intensity });
    setSelections(next);
  };

  const closeSheet = () => setActiveZone(null);

  const handleComplete = () => {
    const zones = Array.from(selections.entries()).map(([zoneId, data]) => ({
      zone: zoneId,
      sensation: data.sensation.label,
      intensity: data.intensity,
    }));
    onComplete(zones);
  };

  const activeSelection = activeZone ? selections.get(activeZone.id) : null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted text-center">
        Нажмите на зоны тела — затем выберите ощущение
      </p>

      {/* Body with interactive zones */}
      <div className="relative mx-auto w-full" style={{ maxWidth: 280 }}>
        <svg
          viewBox="0 0 200 420"
          className="w-full h-auto"
          style={{ touchAction: 'manipulation' }}
        >
          <defs>
            {/* Blur filter for heat glow */}
            <filter id="body-heat-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>

            {/* Radial gradients for each sensation */}
            {SENSATIONS.map((s) => (
              <radialGradient key={s.id} id={`heat-${s.id}`}>
                <stop offset="0%" stopColor={s.hex} stopOpacity="0.8" />
                <stop offset="70%" stopColor={s.hex} stopOpacity="0.3" />
                <stop offset="100%" stopColor={s.hex} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* Body silhouette — filled */}
          <path
            d={BODY_OUTLINE}
            fill="currentColor"
            className="text-elevated"
            style={{
              animation: activeZone ? 'none' : 'body-breathe 4s ease-in-out infinite',
              transformOrigin: '100px 210px',
            }}
          />

          {/* Body outline stroke */}
          <path
            d={BODY_OUTLINE}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-border"
          />

          {/* Heatmap layer — sensations rendered as soft glows */}
          <g filter="url(#body-heat-blur)">
            {Array.from(selections.entries()).map(([zoneId, data]) => {
              const zone = BODY_ZONES.find((z) => z.id === zoneId);
              if (!zone) return null;
              return (
                <circle
                  key={zoneId}
                  cx={zone.cx}
                  cy={zone.cy}
                  r={zone.r * (0.6 + data.intensity * 0.1)}
                  fill={`url(#heat-${data.sensation.id})`}
                  opacity={0.5 + data.intensity * 0.1}
                  style={{ transition: 'r 400ms ease-out, opacity 400ms ease-out' }}
                />
              );
            })}
          </g>

          {/* Interactive zones — SVG paths with native hit detection */}
          {BODY_ZONES.map((zone) => {
            const isSelected = selections.has(zone.id);
            const isActive = activeZone?.id === zone.id;
            const isPulsing = pulsingZone === zone.id;
            return (
              <g key={zone.id}>
                <path
                  d={zone.d}
                  fill="transparent"
                  stroke={isActive ? 'currentColor' : 'transparent'}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  className={`cursor-pointer text-accent transition-colors ${isActive ? 'animate-pulse' : ''}`}
                  role="button"
                  aria-label={zone.label}
                  aria-pressed={isSelected}
                  onClick={() => handleZoneClick(zone)}
                />
                {/* Pulse ring on selection */}
                {isPulsing && (
                  <circle
                    cx={zone.cx}
                    cy={zone.cy}
                    r={zone.r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-accent"
                    style={{ animation: 'pulse-ring 600ms ease-out forwards' }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Idle hint */}
        {selections.size === 0 && !activeZone && (
          <p className="absolute -bottom-2 left-0 right-0 text-center text-xs text-faint">
            Коснитесь любой зоны
          </p>
        )}
      </div>

      {/* Selected zones summary */}
      {selections.size > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {Array.from(selections.entries()).map(([zoneId, data]) => {
            const zone = BODY_ZONES.find((z) => z.id === zoneId);
            if (!zone) return null;
            return (
              <span
                key={zoneId}
                className="inline-flex items-center gap-1 rounded-full bg-elevated px-2.5 py-1 text-xs text-subtle"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: data.sensation.hex }}
                />
                {zone.label}: {data.sensation.label} · {data.intensity}/5
              </span>
            );
          })}
        </div>
      )}

      {/* Bottom sheet for sensation selection */}
      {activeZone && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg rounded-t-2xl bg-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl animate-slide-up">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-fg">
              {activeZone.label} — что вы чувствуете?
            </p>
            <button
              type="button"
              onClick={closeSheet}
              aria-label="Закрыть"
              className="flex h-7 w-7 items-center justify-center rounded-full text-faint hover:bg-elevated"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {SENSATIONS.map((s) => {
              const isSelected = activeSelection?.sensation.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSensation(s)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 text-xs transition-all ${
                    isSelected
                      ? 'border-accent bg-accent-soft'
                      : 'border-transparent bg-elevated hover:bg-hover'
                  }`}
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.hex }} />
                  <span className={isSelected ? 'text-accent-soft-fg font-medium' : 'text-subtle'}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {activeSelection && (
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-muted">Интенсивность</span>
                <span className="text-xs font-bold text-accent-fg">{activeSelection.intensity}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={activeSelection.intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          )}

          <Button fullWidth onClick={closeSheet} disabled={!activeSelection}>
            Готово
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
          Отмена
        </Button>
        <Button type="button" fullWidth onClick={handleComplete} disabled={selections.size === 0}>
          Завершить ({selections.size})
        </Button>
      </div>
    </div>
  );
}
