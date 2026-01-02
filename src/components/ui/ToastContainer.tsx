"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-9999 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]",
              "border border-gray-200 bg-white",
              {
                "border-green-200 bg-green-50": toast.type === "success",
                "border-red-200 bg-red-50": toast.type === "destructive",
              }
            )}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {toast.type === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                )}
                {toast.type === "destructive" && (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                {toast.type === "default" && (
                  <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{toast.title}</h4>
                  {toast.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {toast.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="ml-4 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
