import { useState } from 'react';
import { Header } from '@/widgets/header';
import { Card, Button, Modal, inputClass } from '@/shared/ui';
import { useExposure } from '@/features/exposure';
import type { ExposureHierarchy } from '@/features/exposure';

function HierarchyView({ hierarchy }: { hierarchy: ExposureHierarchy }) {
  const { addStep, toggleStep, removeStep } = useExposure();
  const [newText, setNewText] = useState('');
  const [newSuds, setNewSuds] = useState(50);
  const [showAdd, setShowAdd] = useState(false);

  const completedCount = hierarchy.steps.filter((s) => s.completed).length;
  const progress = hierarchy.steps.length > 0 ? (completedCount / hierarchy.steps.length) * 100 : 0;

  const handleAdd = () => {
    if (!newText.trim()) return;
    addStep(hierarchy.id, newText.trim(), newSuds);
    setNewText('');
    setNewSuds(50);
    setShowAdd(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-fg">{hierarchy.title}</h3>
        <span className="text-xs text-faint">{completedCount}/{hierarchy.steps.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-elevated mb-4">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      {hierarchy.steps.length === 0 ? (
        <p className="text-sm text-faint text-center py-4">Добавьте первую ступень</p>
      ) : (
        <div className="space-y-2">
          {hierarchy.steps.map((step, i) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
                step.completed ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-elevated'
              }`}
            >
              <button
                role="checkbox"
                aria-checked={step.completed}
                aria-label={`Отметить: ${step.text}`}
                onClick={() => toggleStep(hierarchy.id, step.id)}
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  step.completed
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-border'
                }`}
              >
                {step.completed && <span className="text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${step.completed ? 'text-muted line-through' : 'text-fg'}`}>
                  {i + 1}. {step.text}
                </p>
                <p className="text-xs text-faint mt-0.5">Тревога: {step.suds}/100</p>
              </div>
              <button
                aria-label={`Удалить ступень: ${step.text}`}
                onClick={() => removeStep(hierarchy.id, step.id)}
                className="text-xs text-faint hover:text-red-500 shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add step */}
      {showAdd ? (
        <div className="mt-3 space-y-2">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="Описание ситуации..."
            className={inputClass}
            autoFocus
          />
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted shrink-0">Тревога:</label>
            <input
              type="range"
              min={0}
              max={100}
              value={newSuds}
              onChange={(e) => setNewSuds(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
            />
            <span className="text-sm font-medium text-fg w-8 text-right">{newSuds}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" fullWidth onClick={() => setShowAdd(false)}>Отмена</Button>
            <Button fullWidth onClick={handleAdd} disabled={!newText.trim()}>Добавить</Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" fullWidth className="mt-3" onClick={() => setShowAdd(true)}>
          + Добавить ступень
        </Button>
      )}
    </Card>
  );
}

export function ExposurePage() {
  const hierarchies = useExposure((s) => s.hierarchies);
  const addHierarchy = useExposure((s) => s.addHierarchy);
  const removeHierarchy = useExposure((s) => s.removeHierarchy);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    addHierarchy(newTitle.trim());
    setNewTitle('');
    setShowNew(false);
  };

  return (
    <div className="space-y-4">
      <Header title="Лестница страха" subtitle="Пошаговая экспозиция" />

      <Card className="bg-elevated">
        <p className="text-xs text-muted leading-relaxed">
          Создайте иерархию страхов — от лёгких ситуаций к самым тревожным.
          Начните с нижних ступеней и постепенно поднимайтесь.
        </p>
      </Card>

      <Button fullWidth onClick={() => setShowNew(true)}>
        + Новая лестница
      </Button>

      {hierarchies.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-faint">Создайте первую лестницу страха</p>
        </div>
      )}

      {hierarchies.map((h) => (
        <div key={h.id}>
          <HierarchyView hierarchy={h} />
          <button
            onClick={() => setConfirmDelete(h.id)}
            className="mt-1 text-xs text-faint hover:text-red-500 transition-colors"
          >
            Удалить лестницу
          </button>
        </div>
      ))}

      {/* New hierarchy modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Новая лестница">
        <div className="space-y-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Название (например: Социальные ситуации)"
            className={inputClass}
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setShowNew(false)}>Отмена</Button>
            <Button fullWidth onClick={handleCreate} disabled={!newTitle.trim()}>Создать</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Удалить лестницу?">
        <p className="text-sm text-muted mb-4">Все ступени будут потеряны. Это нельзя отменить.</p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setConfirmDelete(null)}>Отмена</Button>
          <Button variant="danger" fullWidth onClick={() => { if (confirmDelete) removeHierarchy(confirmDelete); setConfirmDelete(null); }}>
            Удалить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
