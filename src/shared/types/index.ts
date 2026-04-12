export interface AnxietyEntry {
  id: string;
  level: number;
  note: string;
  triggers: string[];
  timestamp: string;
}

export interface ThoughtRecord {
  id: string;
  situation: string;
  automaticThought: string;
  emotion: string;
  emotionIntensity: number;
  cognitiveDistortions: CognitiveDistortion[];
  alternativeThought: string;
  newEmotionIntensity: number;
  timestamp: string;
}

export type CognitiveDistortion =
  | 'catastrophizing'
  | 'black-and-white'
  | 'mind-reading'
  | 'fortune-telling'
  | 'personalization'
  | 'overgeneralization'
  | 'emotional-reasoning'
  | 'should-statements'
  | 'labeling'
  | 'magnification';

export const COGNITIVE_DISTORTION_LABELS: Record<CognitiveDistortion, string> = {
  catastrophizing: 'Катастрофизация',
  'black-and-white': 'Чёрно-белое мышление',
  'mind-reading': 'Чтение мыслей',
  'fortune-telling': 'Предсказание будущего',
  personalization: 'Персонализация',
  overgeneralization: 'Сверхобобщение',
  'emotional-reasoning': 'Эмоциональное обоснование',
  'should-statements': 'Долженствование',
  labeling: 'Навешивание ярлыков',
  magnification: 'Преувеличение',
};

export type TechniqueSituation = 'panic' | 'rumination' | 'deep-work';

export interface Technique {
  id: string;
  title: string;
  description: string;
  category: 'cbt' | 'existential';
  situation: TechniqueSituation;
  duration: string;
  steps: string[];
  unlockCondition?: { requiredId: string; uses: number };
}

export interface ValueEntry {
  id: string;
  values: { valueId: string; score: number }[];
  action: string;
  timestamp: string;
}

export interface TestQuestion {
  id: number;
  text: string;
  options: { value: number; label: string }[];
}

export interface TestLevel {
  max: number;
  label: string;
  color: 'emerald' | 'amber' | 'orange' | 'red';
}

export interface TestDefinition {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  preamble: string;
  questionCount: number;
  intervalDays: number;
  maxScore: number;
  questions: TestQuestion[];
  levels: TestLevel[];
  attribution: string;
  hasCrisisQuestion?: { questionIndex: number };
}

export interface TestResult {
  id: string;
  testId: string;
  score: number;
  answers: number[];
  levelLabel: string;
  levelColor: string;
  timestamp: string;
}
