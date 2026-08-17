"use client";

import { motion } from "framer-motion";

// Next remounts template.js on every navigation, so a simple enter animation
// is enough. No need to wire AnimatePresence up to the router.
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
