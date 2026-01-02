"use client";

import { useState, useCallback } from "react";

export type ToastType = "default" | "destructive" | "success";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface UseToastReturn {
  toasts: Toast[];
  toast: (options: {
    title: string;
    description?: string;
    type?: ToastType;
  }) => void;
  dismiss: (id: string) => void;
}

let toastId = 0;

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (options: { title: string; description?: string; type?: ToastType }) => {
      const id = `toast-${toastId++}`;
      const newToast: Toast = {
        id,
        title: options.title,
        description: options.description,
        type: options.type || "default",
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
