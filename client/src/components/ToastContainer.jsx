import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import useToastStore from "../store/toastStore";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-amber-200 bg-amber-50 text-amber-900",
};

const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="fixed top-20 right-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        const tone = STYLES[toast.type] || STYLES.info;
        return (
          <div
            key={toast.id}
            className={`animate-slide-in-right rounded-xl border px-4 py-3 shadow-lg ${tone}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{toast.title}</p>
                {toast.message && <p className="text-sm opacity-90">{toast.message}</p>}
              </div>
              <button onClick={() => remove(toast.id)} className="rounded p-1 hover:bg-black/10">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
