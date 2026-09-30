import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'attention' | 'info';
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ICON_MAP = {
  success: CheckCircle,
  warning: AlertTriangle,
  attention: AlertCircle,
  info: Info,
};

const COLOR_MAP = {
  success: 'text-success-600',
  warning: 'text-warning-600',
  attention: 'text-attention-600',
  info: 'text-teal-600',
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && toasts.length > 0) {
      onDismiss(toasts[toasts.length - 1].id);
    }
  }, [toasts, onDismiss]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => onDismiss(t.id), 4000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm animate-slide-up">
      {toasts.map((toast) => {
        const Icon = ICON_MAP[toast.type];
        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 rounded-lg bg-white shadow-lg border border-ink-200 px-4 py-3 animate-slide-right"
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${COLOR_MAP[toast.type]}`} />
            <p className="text-sm text-ink-900 flex-1">{toast.message}</p>
            <button onClick={() => onDismiss(toast.id)} className="text-ink-400 hover:text-ink-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
