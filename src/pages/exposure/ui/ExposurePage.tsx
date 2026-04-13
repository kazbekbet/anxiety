import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Modal,
  Paper,
  Progress,
  Slider,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Header } from '@/widgets/header';
import { useExposure } from '@/features/exposure';
import type { ExposureHierarchy } from '@/features/exposure';

function HierarchyView({ hierarchy }: { hierarchy: ExposureHierarchy }) {
  const { addStep, toggleStep, removeStep } = useExposure();
  const [newText, setNewText] = useState('');
  const [newSuds, setNewSuds] = useState(50);
  const [showAdd, setShowAdd] = useState(false);

  const completedCount = hierarchy.steps.filter((s) => s.completed).length;
  const progress =
    hierarchy.steps.length > 0 ? (completedCount / hierarchy.steps.length) * 100 : 0;

  const handleAdd = () => {
    if (!newText.trim()) return;
    addStep(hierarchy.id, newText.trim(), newSuds);
    setNewText('');
    setNewSuds(50);
    setShowAdd(false);
  };

  return (
    <Paper withBorder radius="lg" p="md">
      <Group justify="space-between" mb="xs">
        <Text fw={600}>{hierarchy.title}</Text>
        <Text fz="xs" c="dimmed">
          {completedCount}/{hierarchy.steps.length}
        </Text>
      </Group>

      <Progress value={progress} color="calm" radius="xl" mb="md" />

      {hierarchy.steps.length === 0 ? (
        <Text fz="sm" c="dimmed" ta="center" py="md">
          Добавьте первую ступень
        </Text>
      ) : (
        <Stack gap="xs">
          {hierarchy.steps.map((step, i) => (
            <Paper
              key={step.id}
              radius="md"
              p="sm"
              bg={
                step.completed
                  ? 'var(--mantine-color-calm-light)'
                  : 'var(--mantine-color-default-hover)'
              }
            >
              <Group align="flex-start" wrap="nowrap" gap="sm">
                <Checkbox
                  checked={step.completed}
                  onChange={() => toggleStep(hierarchy.id, step.id)}
                  aria-label={`Отметить: ${step.text}`}
                  color="calm"
                  mt={2}
                />
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    fz="sm"
                    c={step.completed ? 'dimmed' : undefined}
                    td={step.completed ? 'line-through' : undefined}
                  >
                    {i + 1}. {step.text}
                  </Text>
                  <Text fz="xs" c="dimmed" mt={2}>
                    Тревога: {step.suds}/100
                  </Text>
                </Box>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  aria-label={`Удалить ступень: ${step.text}`}
                  onClick={() => removeStep(hierarchy.id, step.id)}
                >
                  ✕
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {showAdd ? (
        <Stack gap="xs" mt="sm">
          <TextInput
            value={newText}
            onChange={(e) => setNewText(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
            }}
            placeholder="Описание ситуации..."
            data-autofocus
            autoFocus
          />
          <Group gap="sm" wrap="nowrap" align="center">
            <Text fz="xs" c="dimmed">
              Тревога:
            </Text>
            <Slider
              value={newSuds}
              onChange={setNewSuds}
              min={0}
              max={100}
              color="brand"
              style={{ flex: 1 }}
            />
            <Text fz="sm" fw={500} w={32} ta="right">
              {newSuds}
            </Text>
          </Group>
          <Group gap="xs" grow>
            <Button variant="subtle" onClick={() => setShowAdd(false)}>
              Отмена
            </Button>
            <Button onClick={handleAdd} disabled={!newText.trim()} color="brand">
              Добавить
            </Button>
          </Group>
        </Stack>
      ) : (
        <Button variant="light" color="brand" fullWidth mt="sm" onClick={() => setShowAdd(true)}>
          + Добавить ступень
        </Button>
      )}
    </Paper>
  );
}

export function ExposurePage() {
  const hierarchies = useExposure((s) => s.hierarchies);
  const addHierarchy = useExposure((s) => s.addHierarchy);
  const removeHierarchy = useExposure((s) => s.removeHierarchy);
  const [newOpened, { open: openNew, close: closeNew }] = useDisclosure(false);
  const [newTitle, setNewTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    addHierarchy(newTitle.trim());
    setNewTitle('');
    closeNew();
  };

  const handleCloseNew = () => {
    setNewTitle('');
    closeNew();
  };

  return (
    <Stack gap="md">
      <Header title="Лестница страха" subtitle="Пошаговая экспозиция" />

      <Paper withBorder radius="lg" p="md" bg="var(--mantine-color-default-hover)">
        <Text fz="xs" c="dimmed">
          Создайте иерархию страхов — от лёгких ситуаций к самым тревожным. Начните с нижних
          ступеней и постепенно поднимайтесь.
        </Text>
      </Paper>

      <Button fullWidth color="brand" onClick={openNew}>
        + Новая лестница
      </Button>

      {hierarchies.length === 0 && (
        <Center py="xl">
          <Text fz="sm" c="dimmed">
            Создайте первую лестницу страха
          </Text>
        </Center>
      )}

      {hierarchies.map((h) => (
        <Stack key={h.id} gap={4}>
          <HierarchyView hierarchy={h} />
          <Center>
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              onClick={() => setConfirmDelete(h.id)}
            >
              Удалить лестницу
            </Button>
          </Center>
        </Stack>
      ))}

      <Modal opened={newOpened} onClose={handleCloseNew} title="Новая лестница" centered>
        <Stack gap="md">
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.currentTarget.value)}
            placeholder="Название (например: Социальные ситуации)"
            data-autofocus
            autoFocus
          />
          <Group gap="sm" grow>
            <Button variant="subtle" onClick={handleCloseNew}>
              Отмена
            </Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim()} color="brand">
              Создать
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Удалить лестницу?"
        centered
      >
        <Stack gap="md">
          <Text fz="sm" c="dimmed">
            Все ступени будут потеряны. Это нельзя отменить.
          </Text>
          <Group gap="sm" grow>
            <Button variant="subtle" onClick={() => setConfirmDelete(null)}>
              Отмена
            </Button>
            <Button
              color="warm"
              onClick={() => {
                if (confirmDelete) removeHierarchy(confirmDelete);
                setConfirmDelete(null);
              }}
            >
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
