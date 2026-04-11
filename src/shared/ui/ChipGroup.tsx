interface ChipGroupProps<T extends string> {
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  labels?: Record<T, string>;
}

export function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  labels,
}: ChipGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
            selected.includes(opt)
              ? 'bg-accent text-white'
              : 'bg-elevated text-subtle hover:bg-hover'
          }`}
        >
          {labels ? labels[opt] : opt}
        </button>
      ))}
    </div>
  );
}
