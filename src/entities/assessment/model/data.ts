import type { TestDefinition } from '@/shared/types';

const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Никогда' },
  { value: 1, label: 'Несколько дней' },
  { value: 2, label: 'Больше половины дней' },
  { value: 3, label: 'Почти каждый день' },
];

export const assessments: TestDefinition[] = [
  {
    id: 'gad7',
    title: 'Шкала тревоги GAD-7',
    shortTitle: 'GAD-7',
    description: 'Оценка уровня тревожности за последние 2 недели. 7 вопросов, ~2 минуты.',
    preamble: 'За последние 2 недели, как часто вас беспокоило следующее:',
    questionCount: 7,
    intervalDays: 14,
    maxScore: 21,
    questions: [
      { id: 0, text: 'Ощущение нервозности, тревоги или беспокойства', options: FREQUENCY_OPTIONS },
      { id: 1, text: 'Невозможность прекратить или контролировать беспокойство', options: FREQUENCY_OPTIONS },
      { id: 2, text: 'Чрезмерное беспокойство по разным поводам', options: FREQUENCY_OPTIONS },
      { id: 3, text: 'Трудности с расслаблением', options: FREQUENCY_OPTIONS },
      { id: 4, text: 'Настолько беспокойны, что трудно усидеть на месте', options: FREQUENCY_OPTIONS },
      { id: 5, text: 'Легко раздражаетесь или становитесь нетерпимы', options: FREQUENCY_OPTIONS },
      { id: 6, text: 'Чувство страха, как будто может произойти что-то ужасное', options: FREQUENCY_OPTIONS },
    ],
    levels: [
      { max: 4, label: 'Минимальная тревожность', color: 'emerald' },
      { max: 9, label: 'Лёгкая тревожность', color: 'amber' },
      { max: 14, label: 'Умеренная тревожность', color: 'orange' },
      { max: 21, label: 'Выраженная тревожность', color: 'red' },
    ],
    attribution: 'Spitzer RL, Kroenke K, Williams JBW, Löwe B (2006)',
  },
  {
    id: 'phq9',
    title: 'Шкала депрессии PHQ-9',
    shortTitle: 'PHQ-9',
    description: 'Оценка симптомов депрессии за последние 2 недели. 9 вопросов, ~3 минуты.',
    preamble: 'За последние 2 недели, как часто вас беспокоило следующее:',
    questionCount: 9,
    intervalDays: 14,
    maxScore: 27,
    questions: [
      { id: 0, text: 'Мало интереса или удовольствия от привычных дел', options: FREQUENCY_OPTIONS },
      { id: 1, text: 'Подавленность, угнетённость или чувство безнадёжности', options: FREQUENCY_OPTIONS },
      { id: 2, text: 'Трудности с засыпанием, прерывистый сон или чрезмерный сон', options: FREQUENCY_OPTIONS },
      { id: 3, text: 'Усталость или упадок сил', options: FREQUENCY_OPTIONS },
      { id: 4, text: 'Плохой аппетит или переедание', options: FREQUENCY_OPTIONS },
      { id: 5, text: 'Чувство, что вы плохой человек, неудачник, или что вы подвели себя или семью', options: FREQUENCY_OPTIONS },
      { id: 6, text: 'Трудности с концентрацией (чтение, просмотр ТВ)', options: FREQUENCY_OPTIONS },
      { id: 7, text: 'Двигаетесь или говорите настолько медленно, что другие замечают, или наоборот — чрезмерно суетливы', options: FREQUENCY_OPTIONS },
      { id: 8, text: 'Мысли о том, что лучше бы вас не было, или о причинении себе вреда', options: FREQUENCY_OPTIONS },
    ],
    levels: [
      { max: 4, label: 'Минимальная', color: 'emerald' },
      { max: 9, label: 'Лёгкая', color: 'amber' },
      { max: 14, label: 'Умеренная', color: 'orange' },
      { max: 19, label: 'Выраженная', color: 'red' },
      { max: 27, label: 'Тяжёлая', color: 'red' },
    ],
    hasCrisisQuestion: { questionIndex: 8 },
    attribution: 'Kroenke K, Spitzer RL, Williams JBW (2001)',
  },
];

export function getTestById(id: string): TestDefinition | undefined {
  return assessments.find((t) => t.id === id);
}

export function getLevel(test: TestDefinition, score: number) {
  for (const level of test.levels) {
    if (score <= level.max) return level;
  }
  return test.levels[test.levels.length - 1];
}
