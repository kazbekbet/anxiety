import { Card } from '@/shared/ui';
import { useValuesStore } from '@/features/values-diary';
import { VALUE_OPTIONS } from '@/features/values-diary/model/data';

export function ValuesWidget() {
  const entries = useValuesStore((s) => s.entries);
  const latest = entries[0];

  if (!latest) return null;

  return (
    <Card>
      <h3 className="mb-3 font-semibold text-fg">Ваши ценности</h3>
      <div className="space-y-2">
        {latest.values.map((v) => {
          const opt = VALUE_OPTIONS.find((o) => o.id === v.valueId);
          if (!opt) return null;
          return (
            <div key={v.valueId} className="flex items-center gap-3">
              <span className="text-lg">{opt.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm text-fg">{opt.label}</span>
                  <span className="text-xs text-faint">{v.score}/10</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-hover">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${v.score * 10}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {latest.action && (
        <div className="mt-3 rounded-xl bg-elevated p-2.5">
          <p className="text-xs text-faint mb-0.5">Действие на неделю</p>
          <p className="text-sm text-subtle">{latest.action}</p>
        </div>
      )}
    </Card>
  );
}
