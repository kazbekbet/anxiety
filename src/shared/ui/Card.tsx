import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`rounded-2xl bg-card p-4 border border-border shadow-[0_2px_12px_-2px_rgb(0_0_0/0.08)] dark:shadow-[0_2px_12px_-2px_rgb(0_0_0/0.3)] ${className}`} {...props}>
      {children}
    </div>
  );
}
