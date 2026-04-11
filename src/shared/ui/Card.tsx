import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800 ${className}`} {...props}>
      {children}
    </div>
  );
}
