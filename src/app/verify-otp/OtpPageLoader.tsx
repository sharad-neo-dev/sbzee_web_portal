"use client";

import { motion } from "framer-motion";

export function OtpPageLoader() {
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"
        />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="h-4 bg-gray-200 rounded w-1/2 mx-auto"
        />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between gap-3">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="w-full h-16 bg-gray-200 rounded-lg"
            />
          ))}
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="h-12 bg-gray-200 rounded w-full"
        />
      </div>
    </div>
  );
}
