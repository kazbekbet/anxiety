import { Box, Center, Stack, Text, useMantineTheme } from '@mantine/core';

interface TestGaugeProps {
  score: number;
  maxScore: number;
  color: string;
}

const COLOR_MAP: Record<string, string> = {
  emerald: 'calm',
  amber: 'yellow',
  orange: 'orange',
  red: 'warm',
};

export function TestGauge({ score, maxScore, color }: TestGaugeProps) {
  const theme = useMantineTheme();
  const size = 180;
  const strokeWidth = 12;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2;

  // Arc: 240 degrees (from 150° to 390°)
  const startAngle = 150;
  const totalSweep = 240;
  const fillSweep = (score / maxScore) * totalSweep;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (sweep: number) => {
    const endAngle = startAngle + sweep;
    const x1 = cx + radius * Math.cos(toRad(startAngle));
    const y1 = cy + radius * Math.sin(toRad(startAngle));
    const x2 = cx + radius * Math.cos(toRad(endAngle));
    const y2 = cy + radius * Math.sin(toRad(endAngle));
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const themeColorKey = COLOR_MAP[color] ?? 'brand';
  const fillStroke = theme.colors[themeColorKey]?.[5] ?? 'var(--mantine-primary-color-filled)';
  const trackStroke = 'var(--mantine-color-default-hover)';

  return (
    <Center pos="relative" w={size} h={size}>
      <Box component="svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <path
          d={arcPath(totalSweep)}
          fill="none"
          stroke={trackStroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        {score > 0 && (
          <path
            d={arcPath(fillSweep)}
            fill="none"
            stroke={fillStroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </Box>
      <Stack
        gap={0}
        align="center"
        pos="absolute"
        style={{ top: '40%' }}
      >
        <Text fz={36} fw={700} lh={1}>
          {score}
        </Text>
        <Text fz="sm" c="dimmed">
          из {maxScore}
        </Text>
      </Stack>
    </Center>
  );
}
