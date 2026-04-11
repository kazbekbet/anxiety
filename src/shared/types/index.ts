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

export interface Technique {
  id: string;
  title: string;
  description: string;
  category: 'cbt' | 'existential';
  duration: string;
  steps: string[];
}
