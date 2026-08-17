import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icon =
            toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-cyan-400 shrink-0" />
            );

          const borderBg =
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-zinc-900/95 shadow-emerald-950/40'
              : toast.type === 'error'
              ? 'border-rose-500/30 bg-zinc-900/95 shadow-rose-950/40'
              : toast.type === 'warning'
              ? 'border-amber-500/30 bg-zinc-900/95 shadow-amber-950/40'
              : 'border-cyan-500/30 bg-zinc-900/95 shadow-cyan-950/40';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${borderBg}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-zinc-100">{toast.title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                id={`close-toast-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-zinc-500 hover:text-zinc-300 p-1 -mr-1 -mt-1 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
