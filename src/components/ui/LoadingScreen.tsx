"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-green-50 to-emerald-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6">
          <Image
            src="/assets/img/LogoGreen.png"
            alt="Sbzee Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Loading Freshness...
        </h2>

        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-linear-to-r from-green-500 to-emerald-600"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>

        <p className="text-gray-600 mt-6 text-sm">
          Preparing your fresh experience
        </p>
      </motion.div>
    </div>
  );
}
