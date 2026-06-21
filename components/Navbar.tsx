"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed left-0 right-0 top-4 z-40 px-6"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <div className="hidden md:flex gap-8 text-sm text-body opacity-90">
          <div>Story</div>
          <div>Journey</div>
          <div>Memories</div>
          <div>Celebration</div>
        </div>
      </div>
    </motion.nav>
  );
}
