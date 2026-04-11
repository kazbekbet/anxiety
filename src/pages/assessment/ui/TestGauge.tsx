interface TestGaugeProps {
  score: number;
  maxScore: number;
  color: string;
}

const COLOR_MAP: Record<string, string> = {
  emerald: 'stroke-emerald-500',
  amber: 'stroke-amber-500',
  orange: 'stroke-orange-500',
  red: 'stroke-red-500',
};

export function TestGauge({ score, maxScore, color }: TestGaugeProps) {
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

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <path
          d={arcPath(totalSweep)}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-elevated"
        />
        {/* Filled arc */}
        {score > 0 && (
          <path
            d={arcPath(fillSweep)}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={COLOR_MAP[color] ?? 'stroke-accent'}
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center" style={{ top: '40%' }}>
        <span className="text-4xl font-bold text-fg">{score}</span>
        <span className="text-sm text-faint">из {maxScore}</span>
      </div>
    </div>
  );
}
