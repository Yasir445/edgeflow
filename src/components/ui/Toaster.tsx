"use client";
import { useState, useCallback, createContext, useContext } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";
interface Toast { id: string; type: ToastType; title: string; message?: string; }
interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {}, success: () => {}, error: () => {}, info: () => {} });
export const useToast = () => useContext(ToastContext);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  const success = useCallback((title: string, message?: string) => toast({ type: "success", title, message }), [toast]);
  const error = useCallback((title: string, message?: string) => toast({ type: "error", title, message }), [toast]);
  const info = useCallback((title: string, message?: string) => toast({ type: "info", title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={cn("flex items-start gap-3 rounded-xl px-4 py-3 min-w-[280px] max-w-sm pointer-events-auto border animate-slide-up",
            t.type === "success" ? "bg-emerald-500/10 border-emerald-500/20" : t.type === "error" ? "bg-red-500/10 border-red-500/20" : "bg-blue-500/10 border-blue-500/20")}
            style={{ backdropFilter: "blur(12px)" }}>
            {t.type === "success" && <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
            {t.type === "error" && <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />}
            {t.type === "info" && <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{t.title}</p>
              {t.message && <p className="text-xs text-white/50 mt-0.5">{t.message}</p>}
            </div>
            <button onClick={() => remove(t.id)} className="text-white/25 hover:text-white/60 transition-colors"><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
            }
