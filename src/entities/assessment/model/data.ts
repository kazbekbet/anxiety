import type { TestDefinition } from '@/shared/types';

const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Совсем нет' },
  { value: 1, label: 'Иногда (1-6 дней)' },
  { value: 2, label: 'Часто (7-11 дней)' },
  { value: 3, label: 'Ежедневно или почти' },
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

const PSWQ_OPTIONS = [
  { value: 1, label: 'Совсем не типично' },
  { value: 2, label: 'Немного типично' },
  { value: 3, label: 'Умеренно типично' },
  { value: 4, label: 'Довольно типично' },
  { value: 5, label: 'Очень типично для меня' },
];

const ASI3_OPTIONS = [
  { value: 0, label: 'Совсем нет' },
  { value: 1, label: 'Немного' },
  { value: 2, label: 'Отчасти' },
  { value: 3, label: 'Значительно' },
  { value: 4, label: 'Очень сильно' },
];

export const additionalAssessments: TestDefinition[] = [
  {
    id: 'pswq',
    title: 'Опросник беспокойства Пенна (PSWQ)',
    shortTitle: 'PSWQ',
    description: 'Оценка склонности к хроническому беспокойству. 16 вопросов, ~5 минут.',
    preamble: 'Оцените, насколько каждое утверждение типично для вас:',
    questionCount: 16,
    intervalDays: 30,
    maxScore: 80,
    questions: [
      { id: 0, text: 'Если у меня недостаточно времени, чтобы всё сделать, я не беспокоюсь об этом', options: PSWQ_OPTIONS },
      { id: 1, text: 'Мои беспокойства переполняют меня', options: PSWQ_OPTIONS },
      { id: 2, text: 'Я не склонен(а) беспокоиться о вещах', options: PSWQ_OPTIONS },
      { id: 3, text: 'Многие ситуации заставляют меня беспокоиться', options: PSWQ_OPTIONS },
      { id: 4, text: 'Я знаю, что не должен(а) беспокоиться, но ничего не могу с собой поделать', options: PSWQ_OPTIONS },
      { id: 5, text: 'Когда я нахожусь под давлением, я очень сильно беспокоюсь', options: PSWQ_OPTIONS },
      { id: 6, text: 'Я всегда о чём-нибудь беспокоюсь', options: PSWQ_OPTIONS },
      { id: 7, text: 'Мне легко отбросить беспокойные мысли', options: PSWQ_OPTIONS },
      { id: 8, text: 'Как только я заканчиваю одно дело, я начинаю беспокоиться обо всём остальном', options: PSWQ_OPTIONS },
      { id: 9, text: 'Я никогда ни о чём не беспокоюсь', options: PSWQ_OPTIONS },
      { id: 10, text: 'Когда мне нечего больше делать по какому-то вопросу, я перестаю беспокоиться', options: PSWQ_OPTIONS },
      { id: 11, text: 'Я беспокоился(ась) всю жизнь', options: PSWQ_OPTIONS },
      { id: 12, text: 'Я замечаю, что беспокоюсь о чём-то', options: PSWQ_OPTIONS },
      { id: 13, text: 'Стоит мне начать беспокоиться, я не могу остановиться', options: PSWQ_OPTIONS },
      { id: 14, text: 'Я беспокоюсь постоянно', options: PSWQ_OPTIONS },
      { id: 15, text: 'Я беспокоюсь о проектах до тех пор, пока они не будут завершены', options: PSWQ_OPTIONS },
    ],
    levels: [
      { max: 39, label: 'Низкая склонность к беспокойству', color: 'emerald' },
      { max: 55, label: 'Умеренная склонность', color: 'amber' },
      { max: 65, label: 'Высокая склонность', color: 'orange' },
      { max: 80, label: 'Очень высокая склонность', color: 'red' },
    ],
    attribution: 'Meyer TJ, Miller ML, Metzger RL, Borkovec TD (1990)',
  },
  {
    id: 'asi3',
    title: 'Индекс тревожной чувствительности (ASI-3)',
    shortTitle: 'ASI-3',
    description: 'Оценка страха симптомов тревоги. 18 вопросов, ~4 минуты.',
    preamble: 'Укажите, насколько вы согласны с каждым утверждением:',
    questionCount: 18,
    intervalDays: 30,
    maxScore: 72,
    questions: [
      { id: 0, text: 'Для меня важно не выглядеть нервным(ой)', options: ASI3_OPTIONS },
      { id: 1, text: 'Когда я не могу сосредоточиться, я беспокоюсь, что схожу с ума', options: ASI3_OPTIONS },
      { id: 2, text: 'Меня пугает, когда сердце бьётся быстро', options: ASI3_OPTIONS },
      { id: 3, text: 'Когда у меня расстроен желудок, я беспокоюсь, что серьёзно болен(а)', options: ASI3_OPTIONS },
      { id: 4, text: 'Меня пугает, когда я не могу сосредоточиться на задаче', options: ASI3_OPTIONS },
      { id: 5, text: 'Когда я дрожу в присутствии других, я боюсь, что люди подумают обо мне плохо', options: ASI3_OPTIONS },
      { id: 6, text: 'Когда у меня стеснение в груди, я боюсь, что не смогу дышать', options: ASI3_OPTIONS },
      { id: 7, text: 'Когда я чувствую боль в груди, я боюсь, что у меня сердечный приступ', options: ASI3_OPTIONS },
      { id: 8, text: 'Я беспокоюсь, что другие люди заметят мою тревогу', options: ASI3_OPTIONS },
      { id: 9, text: 'Когда я чувствую «пустоту» в голове, я беспокоюсь, что со мной что-то не так', options: ASI3_OPTIONS },
      { id: 10, text: 'Когда у меня расстроен желудок, я беспокоюсь, что серьёзно болен(а)', options: ASI3_OPTIONS },
      { id: 11, text: 'Меня пугает, когда я не могу ясно мыслить', options: ASI3_OPTIONS },
      { id: 12, text: 'Когда я дрожу, другие люди могут подумать обо мне плохо', options: ASI3_OPTIONS },
      { id: 13, text: 'Когда мои мысли путаются, я беспокоюсь, что теряю рассудок', options: ASI3_OPTIONS },
      { id: 14, text: 'Когда у меня одышка, меня пугает, что я задохнусь', options: ASI3_OPTIONS },
      { id: 15, text: 'Для меня важно контролировать свои эмоции на людях', options: ASI3_OPTIONS },
      { id: 16, text: 'Когда у меня учащается сердцебиение, я боюсь инфаркта', options: ASI3_OPTIONS },
      { id: 17, text: 'Меня пугает, когда я нервничаю', options: ASI3_OPTIONS },
    ],
    levels: [
      { max: 17, label: 'Низкая чувствительность', color: 'emerald' },
      { max: 35, label: 'Умеренная чувствительность', color: 'amber' },
      { max: 53, label: 'Высокая чувствительность', color: 'orange' },
      { max: 72, label: 'Очень высокая чувствительность', color: 'red' },
    ],
    attribution: 'Taylor S, Zvolensky MJ, Cox BJ et al. (2007)',
  },
];

// All tests combined
export const allAssessments: TestDefinition[] = [...assessments, ...additionalAssessments];

export function getTestById(id: string): TestDefinition | undefined {
  return allAssessments.find((t) => t.id === id);
}

export function getLevel(test: TestDefinition, score: number) {
  for (const level of test.levels) {
    if (score <= level.max) return level;
  }
  return test.levels[test.levels.length - 1];
}
