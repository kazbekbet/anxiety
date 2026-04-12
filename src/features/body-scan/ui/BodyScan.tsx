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
  /** Circle center for interactive hit area + heatmap */
  cx: number;
  cy: number;
  /** Hit-area radius (invisible bigger target) */
  hitR: number;
  /** Heatmap glow radius */
  glowR: number;
}

/**
 * Body zones — coordinates match BODY_PATH silhouette
 * viewBox: 0 0 220 540
 */
const BODY_ZONES: BodyZone[] = [
  { id: 'head', label: 'Голова', cx: 110, cy: 48, hitR: 32, glowR: 36 },
  { id: 'throat', label: 'Горло', cx: 110, cy: 96, hitR: 16, glowR: 20 },
  { id: 'chest', label: 'Грудь', cx: 110, cy: 150, hitR: 30, glowR: 42 },
  { id: 'shoulder-l', label: 'Левое плечо', cx: 66, cy: 128, hitR: 18, glowR: 24 },
  { id: 'shoulder-r', label: 'Правое плечо', cx: 154, cy: 128, hitR: 18, glowR: 24 },
  { id: 'stomach', label: 'Живот', cx: 110, cy: 215, hitR: 28, glowR: 38 },
  { id: 'arm-l', label: 'Левая рука', cx: 48, cy: 200, hitR: 20, glowR: 26 },
  { id: 'arm-r', label: 'Правая рука', cx: 172, cy: 200, hitR: 20, glowR: 26 },
  { id: 'hand-l', label: 'Левая кисть', cx: 34, cy: 290, hitR: 18, glowR: 22 },
  { id: 'hand-r', label: 'Правая кисть', cx: 186, cy: 290, hitR: 18, glowR: 22 },
  { id: 'thigh-l', label: 'Левое бедро', cx: 90, cy: 320, hitR: 22, glowR: 30 },
  { id: 'thigh-r', label: 'Правое бедро', cx: 130, cy: 320, hitR: 22, glowR: 30 },
  { id: 'leg-l', label: 'Левая голень', cx: 85, cy: 440, hitR: 20, glowR: 28 },
  { id: 'leg-r', label: 'Правая голень', cx: 135, cy: 440, hitR: 20, glowR: 28 },
];

/**
 * Professional gender-neutral human silhouette
 * Adapted from Wikimedia-style human body outline (Public Domain)
 * viewBox: 0 0 220 540
 */
const BODY_PATH = `
M 110 15
C 127 15 140 28 140 48
C 140 62 135 72 130 78
C 132 82 134 86 136 90
L 142 104
C 144 108 142 112 138 112
L 130 112
C 134 116 140 122 146 126
L 168 136
C 178 142 184 150 186 164
L 194 210
C 196 220 192 226 184 224
L 176 222
L 170 210
L 168 182
L 160 178
L 156 202
L 158 232
C 158 242 156 252 156 262
L 164 300
C 168 316 170 330 168 340
L 158 340
L 154 320
L 150 304
L 148 310
C 146 324 144 340 142 360
L 138 440
C 137 470 136 490 134 508
C 134 518 130 522 124 522
L 118 522
C 114 522 112 518 112 512
L 114 460
L 112 380
L 108 380
L 106 460
L 108 512
C 108 518 106 522 102 522
L 96 522
C 90 522 86 518 86 508
C 84 490 83 470 82 440
L 78 360
C 76 340 74 324 72 310
L 70 304
L 66 320
L 62 340
L 52 340
C 50 330 52 316 56 300
L 64 262
C 64 252 62 242 62 232
L 64 202
L 60 178
L 52 182
L 50 210
L 44 222
L 36 224
C 28 226 24 220 26 210
L 34 164
C 36 150 42 142 52 136
L 74 126
C 80 122 86 116 90 112
L 82 112
C 78 112 76 108 78 104
L 84 90
C 86 86 88 82 90 78
C 85 72 80 62 80 48
C 80 28 93 15 110 15
Z
`.replace(/\s+/g, ' ').trim();

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
      const next = new Map(selections);
      next.delete(zone.id);
      setSelections(next);
      setActiveZone(null);
      return;
    }
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
      <div className="relative mx-auto w-full" style={{ maxWidth: 240 }}>
        <svg
          viewBox="0 0 220 540"
          className="w-full h-auto"
          style={{ touchAction: 'manipulation' }}
        >
          <defs>
            <filter id="body-heat-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>

            {SENSATIONS.map((s) => (
              <radialGradient key={s.id} id={`heat-${s.id}`}>
                <stop offset="0%" stopColor={s.hex} stopOpacity="0.85" />
                <stop offset="60%" stopColor={s.hex} stopOpacity="0.4" />
                <stop offset="100%" stopColor={s.hex} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* Body silhouette — filled */}
          <path
            d={BODY_PATH}
            fill="currentColor"
            className="text-elevated"
            style={{
              animation: activeZone ? 'none' : 'body-breathe 4s ease-in-out infinite',
              transformOrigin: '110px 270px',
            }}
          />

          {/* Body outline stroke */}
          <path
            d={BODY_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="text-border"
          />

          {/* Heatmap layer */}
          <g filter="url(#body-heat-blur)">
            {Array.from(selections.entries()).map(([zoneId, data]) => {
              const zone = BODY_ZONES.find((z) => z.id === zoneId);
              if (!zone) return null;
              return (
                <circle
                  key={zoneId}
                  cx={zone.cx}
                  cy={zone.cy}
                  r={zone.glowR * (0.7 + data.intensity * 0.08)}
                  fill={`url(#heat-${data.sensation.id})`}
                  opacity={0.6 + data.intensity * 0.08}
                  style={{ transition: 'r 400ms ease-out, opacity 400ms ease-out' }}
                />
              );
            })}
          </g>

          {/* Interactive hit-areas — invisible circles with ring indicator */}
          {BODY_ZONES.map((zone) => {
            const isSelected = selections.has(zone.id);
            const isActive = activeZone?.id === zone.id;
            const isPulsing = pulsingZone === zone.id;
            return (
              <g key={zone.id}>
                {/* Invisible hit area */}
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r={zone.hitR}
                  fill="transparent"
                  className="cursor-pointer"
                  role="button"
                  aria-label={zone.label}
                  aria-pressed={isSelected}
                  onClick={() => handleZoneClick(zone)}
                />
                {/* Active zone indicator */}
                {isActive && (
                  <circle
                    cx={zone.cx}
                    cy={zone.cy}
                    r={zone.hitR - 2}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="text-accent pointer-events-none animate-pulse"
                  />
                )}
                {/* Pulse ring animation */}
                {isPulsing && (
                  <circle
                    cx={zone.cx}
                    cy={zone.cy}
                    r={zone.hitR}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-accent pointer-events-none"
                    style={{ animation: 'pulse-ring 600ms ease-out forwards' }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {selections.size === 0 && !activeZone && (
          <p className="absolute -bottom-1 left-0 right-0 text-center text-xs text-faint">
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

      {/* Bottom sheet */}
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
