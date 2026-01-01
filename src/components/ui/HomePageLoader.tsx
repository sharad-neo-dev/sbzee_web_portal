"use client";

import { motion } from "framer-motion";

export function HomePageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          }}
          className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-r from-green-400 to-emerald-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">🍎</span>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Loading Fresh Produce...
        </h2>

        <div className="space-y-3 max-w-md mx-auto">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-2 bg-linear-to-r from-green-400 to-emerald-600 rounded-full"
          />
          <p className="text-gray-600 text-sm">
            Gathering the freshest fruits and vegetables for you
          </p>
        </div>
      </motion.div>
    </div>
  );
}
