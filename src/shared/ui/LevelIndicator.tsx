import { getLevelColor, getLevelTextColor, getLevelBgColor } from '@/shared/lib/level-colors';

interface LevelIndicatorProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-base',
  lg: 'h-20 w-20 text-2xl',
};

export function LevelIndicator({ level, size = 'md' }: LevelIndicatorProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold ${getLevelBgColor(level)} ${getLevelTextColor(level)} ${sizes[size]}`}
    >
      {level}
    </div>
  );
}

export function LevelBar({ level }: { level: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
      <div
        className={`h-full rounded-full transition-all duration-300 ${getLevelColor(level)}`}
        style={{ width: `${level * 10}%` }}
      />
    </div>
  );
}
