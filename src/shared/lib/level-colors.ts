export function getLevelColor(level: number): string {
  if (level <= 3) return 'bg-emerald-500';
  if (level <= 5) return 'bg-amber-400';
  if (level <= 7) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getLevelTextColor(level: number): string {
  if (level <= 3) return 'text-emerald-700 dark:text-emerald-400';
  if (level <= 5) return 'text-amber-700 dark:text-amber-400';
  if (level <= 7) return 'text-orange-700 dark:text-orange-400';
  return 'text-red-700 dark:text-red-400';
}

export function getLevelBgColor(level: number): string {
  if (level <= 3) return 'bg-emerald-50 dark:bg-emerald-950';
  if (level <= 5) return 'bg-amber-50 dark:bg-amber-950';
  if (level <= 7) return 'bg-orange-50 dark:bg-orange-950';
  return 'bg-red-50 dark:bg-red-950';
}
