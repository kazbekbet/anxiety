import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover active:bg-accent-active',
  secondary: 'bg-accent-soft text-accent-soft-fg hover:bg-accent-soft-hover',
  ghost: 'bg-transparent text-subtle hover:bg-elevated active:bg-hover',
  danger: 'bg-danger-soft text-danger-soft-fg hover:bg-danger-soft-hover',
};

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-4 py-3 font-medium transition-colors duration-150 disabled:opacity-50 ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
