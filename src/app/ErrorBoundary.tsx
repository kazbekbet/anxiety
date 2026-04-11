import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Card, Button } from '@/shared/ui';

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

    const isQuotaError = this.state.error?.name === 'QuotaExceededError'
      || this.state.error?.message?.includes('quota');

    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <Card className="w-full max-w-sm text-center">
          <h2 className="text-lg font-semibold text-fg mb-2">
            {isQuotaError ? 'Хранилище переполнено' : 'Что-то пошло не так'}
          </h2>
          <p className="text-sm text-muted mb-4">
            {isQuotaError
              ? 'Экспортируйте данные и очистите старые записи.'
              : 'Попробуйте перезагрузить приложение.'}
          </p>
          <div className="space-y-2">
            <Button fullWidth onClick={this.handleReset}>
              Попробовать снова
            </Button>
            {isQuotaError && (
              <Button fullWidth variant="danger" onClick={this.handleClearData}>
                Очистить данные
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }
}
