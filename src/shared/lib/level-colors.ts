export function getLevelColor(level: number): string {
  if (level <= 3) return 'bg-emerald-500';
  if (level <= 5) return 'bg-amber-400';
  if (level <= 7) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getLevelTextColor(level: number): string {
  if (level <= 3) return 'text-emerald-700';
  if (level <= 5) return 'text-amber-700';
  if (level <= 7) return 'text-orange-700';
  return 'text-red-700';
}

export function getLevelBgColor(level: number): string {
  if (level <= 3) return 'bg-emerald-50';
  if (level <= 5) return 'bg-amber-50';
  if (level <= 7) return 'bg-orange-50';
  return 'bg-red-50';
}
