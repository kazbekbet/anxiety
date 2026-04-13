import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Slider,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';

interface Sensation {
  id: string;
  label: string;
  hex: string;
}

const SENSATIONS: Sensation[] = [
  { id: 'tension', label: 'Напряжение', hex: '#ef4444' },
  { id: 'pressure', label: 'Давление', hex: '#f97316' },
  { id: 'burning', label: 'Жжение', hex: '#eab308' },
  { id: 'trembling', label: 'Дрожь', hex: '#8b5cf6' },
  { id: 'stiffness', label: 'Скованность', hex: '#64748b' },
  { id: 'tingling', label: 'Покалывание', hex: '#06b6d4' },
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
    <Stack gap="sm">
      <Text fz="sm" c="dimmed" ta="center">
        Нажмите на зоны тела — затем выберите ощущение
      </Text>

      {/* Body with interactive zones */}
      <Box pos="relative" mx="auto" w="100%" maw={240}>
        <Box
          component="svg"
          {...{ viewBox: '0 0 220 540' }}
          w="100%"
          h="auto"
          style={{ touchAction: 'manipulation', color: 'var(--mantine-color-gray-3)' }}
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
            style={{
              animation: activeZone ? 'none' : 'body-breathe 4s ease-in-out infinite',
              transformOrigin: '110px 270px',
            }}
          />

          {/* Body outline stroke */}
          <path
            d={BODY_PATH}
            fill="none"
            stroke="var(--mantine-color-gray-5)"
            strokeWidth="1.5"
            strokeLinejoin="round"
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
                  style={{ cursor: 'pointer' }}
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
                    stroke="var(--mantine-color-brand-5)"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                {/* Pulse ring animation */}
                {isPulsing && (
                  <circle
                    cx={zone.cx}
                    cy={zone.cy}
                    r={zone.hitR}
                    fill="none"
                    stroke="var(--mantine-color-brand-5)"
                    strokeWidth="2"
                    style={{ pointerEvents: 'none', animation: 'pulse-ring 600ms ease-out forwards' }}
                  />
                )}
              </g>
            );
          })}
        </Box>

        {selections.size === 0 && !activeZone && (
          <Text
            pos="absolute"
            left={0}
            right={0}
            ta="center"
            fz="xs"
            c="dimmed"
            style={{ bottom: -4 }}
          >
            Коснитесь любой зоны
          </Text>
        )}
      </Box>

      {/* Selected zones summary */}
      {selections.size > 0 && (
        <Group justify="center" gap={6}>
          {Array.from(selections.entries()).map(([zoneId, data]) => {
            const zone = BODY_ZONES.find((z) => z.id === zoneId);
            if (!zone) return null;
            return (
              <Badge
                key={zoneId}
                variant="light"
                color="gray"
                radius="xl"
                size="sm"
                leftSection={
                  <Box
                    w={8}
                    h={8}
                    style={{ borderRadius: '50%', backgroundColor: data.sensation.hex }}
                  />
                }
              >
                {zone.label}: {data.sensation.label} · {data.intensity}/5
              </Badge>
            );
          })}
        </Group>
      )}

      {/* Bottom sheet */}
      {activeZone && (
        <Paper
          pos="fixed"
          left={0}
          right={0}
          bottom={0}
          mx="auto"
          w="100%"
          maw={512}
          radius="lg"
          p="lg"
          shadow="xl"
          style={{
            zIndex: 50,
            paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            animation: 'slide-up 240ms cubic-bezier(0.32, 0.72, 0, 1) forwards',
          }}
        >
          <Group justify="space-between" mb="sm" align="center">
            <Text fz="sm" fw={500}>
              {activeZone.label} — что вы чувствуете?
            </Text>
            <ActionIcon
              type="button"
              onClick={closeSheet}
              aria-label="Закрыть"
              variant="subtle"
              color="gray"
              radius="xl"
              size="sm"
            >
              ✕
            </ActionIcon>
          </Group>

          <SimpleGrid cols={3} spacing="xs" mb="md">
            {SENSATIONS.map((s) => {
              const isSelected = activeSelection?.sensation.id === s.id;
              return (
                <UnstyledButton
                  key={s.id}
                  type="button"
                  onClick={() => selectSensation(s)}
                  p="xs"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    borderRadius: 12,
                    border: '2px solid',
                    borderColor: isSelected
                      ? 'var(--mantine-color-brand-5)'
                      : 'transparent',
                    backgroundColor: isSelected
                      ? 'var(--mantine-color-brand-0)'
                      : 'var(--mantine-color-gray-0)',
                    transition: 'all 200ms ease',
                  }}
                >
                  <Box
                    w={12}
                    h={12}
                    style={{ borderRadius: '50%', backgroundColor: s.hex }}
                  />
                  <Text fz="xs" fw={isSelected ? 500 : 400} c={isSelected ? 'brand.7' : 'dimmed'}>
                    {s.label}
                  </Text>
                </UnstyledButton>
              );
            })}
          </SimpleGrid>

          {activeSelection && (
            <Stack gap={6} mb="md">
              <Group justify="space-between">
                <Text fz="xs" c="dimmed">
                  Интенсивность
                </Text>
                <Text fz="xs" fw={700} c="brand.7">
                  {activeSelection.intensity}/5
                </Text>
              </Group>
              <Slider
                value={activeSelection.intensity}
                onChange={setIntensity}
                min={1}
                max={5}
                step={1}
                label={null}
              />
            </Stack>
          )}

          <Button fullWidth onClick={closeSheet} disabled={!activeSelection}>
            Готово
          </Button>
        </Paper>
      )}

      <Group gap="sm" grow pt={4}>
        <Button type="button" variant="subtle" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="button" onClick={handleComplete} disabled={selections.size === 0}>
          Завершить ({selections.size})
        </Button>
      </Group>
    </Stack>
  );
}
