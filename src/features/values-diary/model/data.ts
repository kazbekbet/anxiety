export interface ValueOption {
  id: string;
  label: string;
  icon: string;
}

export const VALUE_OPTIONS: ValueOption[] = [
  { id: 'family', label: 'Семья', icon: '👨‍👩‍👧' },
  { id: 'health', label: 'Здоровье', icon: '💚' },
  { id: 'career', label: 'Карьера', icon: '💼' },
  { id: 'creativity', label: 'Творчество', icon: '🎨' },
  { id: 'friendship', label: 'Дружба', icon: '🤝' },
  { id: 'growth', label: 'Развитие', icon: '📈' },
  { id: 'freedom', label: 'Свобода', icon: '🕊️' },
  { id: 'love', label: 'Любовь', icon: '❤️' },
  { id: 'nature', label: 'Природа', icon: '🌿' },
  { id: 'peace', label: 'Покой', icon: '🧘' },
];
