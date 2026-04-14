import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Modal,
  Progress,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getTestById, getLevel, useAssessmentResults } from '@/entities/assessment';

const CRISIS_PHONE = '8-800-2000-122';

export function AssessmentPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const addResult = useAssessmentResults((s) => s.addResult);
  const test = getTestById(testId ?? '');

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(test?.questionCount ?? 0).fill(null),
  );
  const [exitOpened, exitHandlers] = useDisclosure(false);
  const [crisisOpened, crisisHandlers] = useDisclosure(false);

  const submitResults = useCallback(
    (finalAnswers: (number | null)[]) => {
      if (!test) return;
      const numericAnswers = finalAnswers.map((a) => a ?? 0);
      const score = numericAnswers.reduce((sum, a) => sum + a, 0);
      const level = getLevel(test, score);
      addResult({
        testId: test.id,
        score,
        answers: numericAnswers,
        levelLabel: level.label,
        levelColor: level.color,
      });
      navigate(`/stats/tests/${test.id}/result`, { replace: true });
    },
    [test, addResult, navigate],
  );

  const handleSelect = useCallback(
    (value: number) => {
      if (!test) return;
      const next = [...answers];
      next[step] = value;
      setAnswers(next);

      if (test.hasCrisisQuestion && step === test.hasCrisisQuestion.questionIndex && value > 0) {
        crisisHandlers.open();
        return;
      }

      setTimeout(() => {
        if (step < test.questionCount - 1) {
          setStep(step + 1);
        } else {
          submitResults(next);
        }
      }, 300);
    },
    [test, step, answers, submitResults, crisisHandlers],
  );

  if (!test) {
    return (
      <Center mih="100vh">
        <Text c="dimmed">Тест не найден</Text>
      </Center>
    );
  }

  const question = test.questions[step];
  const selected = answers[step];
  const isLast = step === test.questionCount - 1;
  const hasAnswered = answers.filter((a) => a !== null).length;
  const progressValue = ((step + 1) / test.questionCount) * 100;

  const handleCrisisContinue = () => {
    crisisHandlers.close();
    if (isLast) {
      submitResults(answers);
    } else {
      setTimeout(() => setStep(step + 1), 100);
    }
  };

  return (
    <Container size="sm" px="md" pb="lg" pt="lg" mih="100vh">
      <Stack gap="md" mih="100vh">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Anchor
            component="button"
            type="button"
            fz="sm"
            c="dimmed"
            onClick={exitHandlers.open}
          >
            ← Выйти
          </Anchor>
          <Text fz="sm" c="dimmed">
            Вопрос {step + 1} из {test.questionCount}
          </Text>
        </Group>

        {/* Progress bar */}
        <Progress value={progressValue} size="sm" radius="xl" />

        {/* Preamble */}
        <Text fz="xs" c="dimmed">
          {test.preamble}
        </Text>

        {/* Question */}
        <Title order={2} fz="lg" fw={600} lh={1.3}>
          {question.text}
        </Title>

        {/* Options */}
        <Stack gap="sm" style={{ flex: 1 }}>
          {question.options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <UnstyledButton
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                p="md"
                style={{
                  borderRadius: 'var(--mantine-radius-lg)',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: isSelected
                    ? 'var(--mantine-primary-color-filled)'
                    : 'transparent',
                  background: isSelected
                    ? 'var(--mantine-primary-color-light)'
                    : 'var(--mantine-color-default-hover)',
                  color: isSelected
                    ? 'var(--mantine-primary-color-light-color)'
                    : 'var(--mantine-color-text)',
                  transition: 'all 150ms ease',
                  textAlign: 'left',
                }}
              >
                <Text fz="sm" fw={500}>
                  {opt.label}
                </Text>
              </UnstyledButton>
            );
          })}
        </Stack>

        {/* Navigation */}
        <Group gap="sm" mt="md" wrap="nowrap">
          {step > 0 && (
            <Button variant="subtle" fullWidth onClick={() => setStep(step - 1)}>
              Назад
            </Button>
          )}
          <Button
            fullWidth
            disabled={selected === null}
            onClick={() => {
              if (isLast) submitResults(answers);
              else setStep(step + 1);
            }}
          >
            {isLast ? 'Завершить' : 'Далее'}
          </Button>
        </Group>
      </Stack>

      {/* Exit confirmation modal */}
      <Modal
        opened={exitOpened}
        onClose={exitHandlers.close}
        title="Прервать тест?"
        centered
        radius="lg"
      >
        <Stack gap="md">
          <Text fz="sm" c="dimmed">
            Прогресс не сохранится. Вы ответили на {hasAnswered} из {test.questionCount} вопросов.
          </Text>
          <Stack gap="xs">
            <Button fullWidth onClick={exitHandlers.close}>
              Продолжить тест
            </Button>
            <Button
              fullWidth
              variant="subtle"
              onClick={() => navigate('/stats', { replace: true })}
            >
              Выйти
            </Button>
          </Stack>
        </Stack>
      </Modal>

      {/* Crisis modal */}
      <Modal
        opened={crisisOpened}
        onClose={handleCrisisContinue}
        title="Вы не одиноки"
        centered
        radius="lg"
      >
        <Stack gap="md">
          <Text fz="sm" c="dimmed">
            Если у вас есть мысли о причинении себе вреда, пожалуйста, обратитесь за помощью.
          </Text>
          <Box
            component="a"
            href={`tel:${CRISIS_PHONE}`}
            ta="center"
            p="md"
            fw={600}
            fz="lg"
            c="white"
            style={{
              borderRadius: 'var(--mantine-radius-lg)',
              background: 'var(--mantine-primary-color-filled)',
              textDecoration: 'none',
            }}
          >
            Телефон доверия: {CRISIS_PHONE}
          </Box>
          <Text fz="xs" c="dimmed" ta="center">
            Бесплатно, анонимно, круглосуточно
          </Text>
          <Button fullWidth variant="light" onClick={handleCrisisContinue}>
            Продолжить тест
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
