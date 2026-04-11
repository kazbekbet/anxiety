import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { ThemeToggle } from '@/widgets/theme-toggle';
import { Card, Button, LevelIndicator, Modal } from '@/shared/ui';
import { Sparkline } from '@/shared/ui/Sparkline';
import { useAnxietyEntries } from '@/entities/anxiety';
import { LogAnxietyForm } from '@/features/log-anxiety';
import { WorryTimer } from '@/features/worry-time';
import { techniques } from '@/entities/technique';
import { getLevelBgColor, getLevelTextColor } from '@/shared/lib/level-colors';
import { sparklineData, trendDirection } from '@/shared/lib/insights';
import { generateSmartInsight } from '@/shared/lib/smart-insights';
import { useAssessmentResults, assessments } from '@/entities/assessment';

const QUICK_LEVELS = [
  { range: '1-2', level: 2, label: 'Спокойно' },
  { range: '3-4', level: 4, label: 'Легко' },
  { range: '5-6', level: 6, label: 'Средне' },
  { range: '7-8', level: 8, label: 'Сильно' },
  { range: '9-10', level: 10, label: 'Паника' },
];

const CRISIS_PHONE = '8-800-2000-122';

interface Recommendation {
  text: string;
  route: string;
  level: 'calm' | 'mild' | 'moderate' | 'severe' | 'crisis';
}

function getRecommendation(level: number): Recommendation {
  if (level <= 3) return { text: 'Всё хорошо. Запишите мысли в дневник?', route: '/diary', level: 'calm' };
  if (level <= 5) return { text: 'Попробуйте дыхание по квадрату', route: '/techniques', level: 'mild' };
  if (level <= 7) return { text: 'Рекомендуем дыхание 4-7-8', route: '/techniques', level: 'moderate' };
  if (level <= 9) return { text: 'Начните с дыхания, потом — Worry Time', route: '/techniques', level: 'severe' };
  return { text: 'Вы не одиноки. Обратитесь за помощью', route: '', level: 'crisis' };
}

export function HomePage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const addEntry = useAnxietyEntries((s) => s.addEntry);
  const latestEntry = entries[0] ?? null;
  const [showForm, setShowForm] = useState(false);
  const [showWorryTimer, setShowWorryTimer] = useState(false);
  const [tapped, setTapped] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const navigate = useNavigate();

  const quickTechniques = techniques.slice(0, 3);
  const assessmentResults = useAssessmentResults((s) => s.results);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const showTestBanner = (() => {
    if (dismissedBanner) return false;
    const gad7 = assessments.find((t) => t.id === 'gad7');
    if (!gad7) return false;
    const lastGad7 = assessmentResults.find((r) => r.testId === 'gad7');
    if (!lastGad7) return true;
    const daysSince = Math.floor(
      (new Date().getTime() - new Date(lastGad7.timestamp).getTime()) / 86400000,
    );
    return daysSince >= gad7.intervalDays;
  })();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 6) return { title: 'Не спится?', sub: 'Здесь безопасно' };
    if (h < 12) return { title: 'Доброе утро', sub: 'Как вы сегодня?' };
    if (h < 18) return { title: 'Добрый день', sub: 'Проверьте своё состояние' };
    if (h < 22) return { title: 'Добрый вечер', sub: 'Время подвести итоги дня' };
    return { title: 'Поздний вечер', sub: 'Всё в порядке' };
  })();
  const sparkData = useMemo(() => sparklineData(entries), [entries]);
  const trend = useMemo(() => trendDirection(entries), [entries]);
  const smartInsight = useMemo(() => generateSmartInsight(entries), [entries]);

  const handleQuickTap = (level: number) => {
    addEntry({ level, note: '', triggers: [] });
    setTapped(level);
    setRecommendation(getRecommendation(level));
    if ('vibrate' in navigator) navigator.vibrate(level <= 4 ? 10 : level <= 7 ? 20 : 40);
    setTimeout(() => setTapped(null), 1500);
  };

  return (
    <div className="space-y-4">
      <Header title={greeting.title} subtitle={greeting.sub} action={<ThemeToggle />} />

      {/* SOS button */}
      <Card
        className="flex cursor-pointer items-center gap-3 bg-red-50 dark:bg-red-950 active:scale-[0.98] transition-transform"
        onClick={() => window.open(`tel:${CRISIS_PHONE}`)}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white text-sm font-bold">
          SOS
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-red-700 dark:text-red-300 text-sm">Если сейчас очень плохо</p>
          <p className="text-xs text-red-600/70 dark:text-red-400/70">Телефон доверия: {CRISIS_PHONE}</p>
        </div>
      </Card>

      {/* One-tap check-in */}
      <Card>
        <p className="mb-3 text-sm font-medium text-subtle text-center">Быстрая запись</p>
        <div className="flex gap-2">
          {QUICK_LEVELS.map((q) => (
            <button
              key={q.level}
              onClick={() => handleQuickTap(q.level)}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl py-3.5 transition-all active:scale-95 ${getLevelBgColor(q.level)} ${getLevelTextColor(q.level)} ${tapped === q.level ? 'ring-2 ring-accent scale-95' : ''}`}
            >
              <span className="text-base font-bold leading-none">{q.range}</span>
              <span className="text-[11px] font-medium leading-tight opacity-80">{q.label}</span>
            </button>
          ))}
        </div>

        {/* Recommendation after check-in */}
        {recommendation && (
          <div key={recommendation.text} className="mt-3 rounded-xl bg-elevated p-3 animate-success-pop">
            <p className="text-sm text-subtle mb-2">{recommendation.text}</p>
            {recommendation.level === 'crisis' ? (
              <a
                href={`tel:${CRISIS_PHONE}`}
                className="block w-full rounded-xl bg-red-500 py-2.5 text-center text-sm font-medium text-white"
              >
                Позвонить: {CRISIS_PHONE}
              </a>
            ) : (
              <Button
                fullWidth
                variant="secondary"
                className="!py-2 text-xs"
                onClick={() => navigate(recommendation.route)}
              >
                {recommendation.level === 'calm' ? 'Открыть дневник' : 'Начать технику'}
              </Button>
            )}
          </div>
        )}

        {tapped && !recommendation && (
          <p key={tapped} className="mt-2 text-center text-xs text-accent-fg animate-success-pop">
            ✓ Записано
          </p>
        )}
      </Card>

      {/* Smart insight */}
      {smartInsight && (
        <Card className={`text-sm ${
          smartInsight.type === 'positive' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          : smartInsight.type === 'suggestion' ? 'bg-accent-soft text-accent-soft-fg'
          : 'bg-elevated text-subtle'
        }`}>
          {smartInsight.text}
        </Card>
      )}

      {/* Test banner */}
      {showTestBanner && (
        <Card className="flex items-center gap-3 bg-accent-soft">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white text-lg">
            ?
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-accent-soft-fg">Оцените тревожность</p>
            <p className="text-xs text-muted">GAD-7 — займёт 2 минуты</p>
          </div>
          <Button variant="secondary" className="shrink-0 !py-2 !px-3 text-xs" onClick={() => navigate('/stats/tests/gad7')}>
            Пройти
          </Button>
          <button onClick={() => setDismissedBanner(true)} className="text-faint hover:text-subtle text-xs">
            ✕
          </button>
        </Card>
      )}

      {/* Latest entry with sparkline */}
      {latestEntry && (
        <Card className="flex items-center gap-4">
          <LevelIndicator level={latestEntry.level} />
          <div className="flex-1">
            <p className="text-sm text-muted">Последняя запись</p>
            <p className="text-sm font-medium text-fg">
              {latestEntry.level}/10
              {trend && (
                <span className={`ml-1 ${trend === 'down' ? 'text-emerald-500' : trend === 'up' ? 'text-red-500' : ''}`}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
                </span>
              )}
            </p>
          </div>
          <Sparkline data={sparkData} width={80} height={28} className="text-accent" />
        </Card>
      )}

      <Button fullWidth variant="secondary" onClick={() => setShowForm(true)}>
        + Подробная запись
      </Button>

      {/* Worry Time card */}
      <Card
        className="flex cursor-pointer items-center gap-3 active:scale-[0.98] transition-transform"
        onClick={() => setShowWorryTimer(true)}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-fg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-fg text-sm">Время беспокойства</p>
          <p className="text-xs text-faint">Запланированная сессия для тревожных мыслей</p>
        </div>
      </Card>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">Быстрые техники</h2>
          <button onClick={() => navigate('/techniques')} className="text-sm text-accent-fg hover:underline">
            Все
          </button>
        </div>
        <div className="space-y-2">
          {quickTechniques.map((t) => (
            <Card
              key={t.id}
              className="flex cursor-pointer items-center gap-3 active:scale-[0.98] transition-transform"
              onClick={() => navigate('/techniques')}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-fg">
                {t.category === 'cbt' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-fg text-sm">{t.title}</p>
                <p className="text-xs text-faint">{t.duration}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Новая запись">
        <LogAnxietyForm
          onSubmit={(data) => { addEntry(data); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal open={showWorryTimer} onClose={() => setShowWorryTimer(false)} title="Время беспокойства">
        <WorryTimer onClose={() => setShowWorryTimer(false)} />
      </Modal>
    </div>
  );
}
