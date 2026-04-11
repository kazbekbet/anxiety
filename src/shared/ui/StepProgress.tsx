interface StepProgressProps {
  total: number;
  current: number;
}

export function StepProgress({ total, current }: StepProgressProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i <= current ? 'bg-accent' : 'bg-hover'
          }`}
        />
      ))}
    </div>
  );
}
