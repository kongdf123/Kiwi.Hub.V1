import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, width = 'max-w-md', footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative w-full ${width} bg-white rounded-xl shadow-2xl flex flex-col animate-slide-up max-h-[90vh]`}>
        <div className="flex items-center justify-between border-b border-ink-200 px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">{children}</div>
        {footer && <div className="border-t border-ink-200 px-6 py-4 shrink-0">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
