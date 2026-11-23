import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCompost } from '../context/CompostContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCompost();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => {
        const styles =
          toast.type === 'success'
            ? 'bg-[#132A1C] text-white border-[#1E6B3A]'
            : toast.type === 'error'
              ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
              : 'bg-[#FAF9F5] text-[#18241D] border-[#D6D0C0]';

        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
              ? AlertCircle
              : Info;

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-sm transition-all duration-150 ${styles}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-md opacity-75 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
