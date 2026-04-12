import { useState } from 'react';
import { OnboardingFlow } from './OnboardingFlow';

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem('onboarded') === '1',
  );

  if (!onboarded) {
    return (
      <OnboardingFlow
        onComplete={() => {
          localStorage.setItem('onboarded', '1');
          setOnboarded(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
