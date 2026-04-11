import { format, isToday, isYesterday, startOfDay, subDays, eachDayOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatEntryDate(isoString: string): string {
  const date = new Date(isoString);
  if (isToday(date)) return 'Сегодня';
  if (isYesterday(date)) return 'Вчера';
  return format(date, 'd MMMM', { locale: ru });
}

export function formatTime(isoString: string): string {
  return format(new Date(isoString), 'HH:mm');
}

export function getLast7Days(): Date[] {
  const today = startOfDay(new Date());
  return eachDayOfInterval({ start: subDays(today, 6), end: today });
}

export function formatShortDay(date: Date): string {
  return format(date, 'EE', { locale: ru });
}
