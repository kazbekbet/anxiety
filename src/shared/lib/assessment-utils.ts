/** Map test level color to numeric level (1-10) for LevelBar */
export function levelColorToNumber(color: string): number {
  if (color === 'emerald') return 2;
  if (color === 'amber') return 4;
  if (color === 'orange') return 7;
  return 9;
}

/** Days since a timestamp */
export function daysSince(timestamp: string): number {
  return Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 86400000);
}
