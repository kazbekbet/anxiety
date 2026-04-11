export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pt-8 animate-pulse">
      <div className="h-12 w-48 rounded-2xl bg-elevated" />
      <div className="h-32 rounded-2xl bg-elevated" />
      <div className="h-12 rounded-2xl bg-elevated" />
      <div className="h-24 rounded-2xl bg-elevated" />
    </div>
  );
}
