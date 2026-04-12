import { type ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] animate-slide-up sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-5 sm:animate-fade-in">
        <div className="mb-4 flex items-center justify-between sticky top-0 bg-card pb-2 -mt-1 pt-1 z-10">
          <h2 className="text-lg font-semibold text-fg">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-faint hover:bg-elevated"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
