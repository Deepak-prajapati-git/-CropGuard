import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import type { ToastMessage } from '../../types';

// ─── Toast Context ────────────────────────────────────────────────────────────

interface ToastContextValue {
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ─── Toast Provider ───────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    setToasts(prev => [...prev.slice(-3), { id, message, type, duration }]);
    const timer = window.setTimeout(() => removeToast(id), duration);
    timers.current.set(id, timer);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-label="Notifications">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── Toast Item ───────────────────────────────────────────────────────────────

const TOAST_STYLES = {
  success: 'bg-[#174A35] text-white',
  error: 'bg-[#B54747] text-white',
  warning: 'bg-[#B7791F] text-white',
  info: 'bg-[#1E2923] text-white',
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => (
  <div
    className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.2)]',
      'pointer-events-auto w-full max-w-sm animate-slide-up',
      TOAST_STYLES[toast.type]
    )}
    role="status"
  >
    <span className="flex-1 text-sm font-medium">{toast.message}</span>
    <button
      onClick={onDismiss}
      className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1 rounded"
      aria-label="Dismiss notification"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
);

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onConfirm, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-6 w-full max-w-sm animate-fade-in">
        <h2 id="dialog-title" className="text-base font-semibold text-[#1E2923] mb-2">{title}</h2>
        <p className="text-sm text-[#66736A] mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 px-4 text-sm font-medium rounded-[10px] border border-[#DDE3DB] bg-white text-[#1E2923] hover:bg-[#EEF1E9] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'flex-1 h-10 px-4 text-sm font-medium rounded-[10px] text-white transition-colors',
              variant === 'danger' ? 'bg-[#B54747] hover:bg-[#a33d3d]' : 'bg-[#174A35] hover:bg-[#103A29]'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] animate-slide-up">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#DDE3DB] rounded-full" />
        </div>
        {title && (
          <div className="px-5 py-3 border-b border-[#DDE3DB]">
            <h2 className="text-base font-semibold text-[#1E2923]">{title}</h2>
          </div>
        )}
        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto safe-bottom">
          {children}
        </div>
      </div>
    </div>
  );
};
