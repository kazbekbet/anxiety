import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Button, Center, MantineProvider, Paper, Stack, Text, Title } from '@mantine/core';
import { cssVariablesResolver, mantineTheme } from './providers/mantine/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isQuotaError =
      this.state.error?.name === 'QuotaExceededError' ||
      this.state.error?.message?.includes('quota');

    // ErrorBoundary lives outside the app-level MantineProvider so it can catch
    // errors from that provider itself; render its own provider to guarantee
    // Mantine context is available regardless of where the failure happened.
    return (
      <MantineProvider theme={mantineTheme} cssVariablesResolver={cssVariablesResolver}>
        <Center mih="100vh" px="md" bg="var(--mantine-color-body)">
          <Paper withBorder radius="lg" p="lg" w="100%" maw={380}>
            <Stack gap="md" align="stretch">
              <Title order={2} fz="lg" fw={600} ta="center">
                {isQuotaError ? 'Хранилище переполнено' : 'Что-то пошло не так'}
              </Title>
              <Text fz="sm" c="dimmed" ta="center">
                {isQuotaError
                  ? 'Экспортируйте данные и очистите старые записи.'
                  : 'Попробуйте перезагрузить приложение.'}
              </Text>
              <Stack gap="xs">
                <Button fullWidth onClick={this.handleReset}>
                  Попробовать снова
                </Button>
                {isQuotaError && (
                  <Button fullWidth color="red" variant="light" onClick={this.handleClearData}>
                    Очистить данные
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Center>
      </MantineProvider>
    );
  }
}
