"use client";
import { useTheme } from "@/lib/theme-context";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="relative w-16 h-8 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 shadow-inner">
        <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-gradient-to-r from-amber-200 to-orange-300 dark:from-indigo-600 dark:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/50 to-orange-500/50 dark:from-indigo-500/50 dark:to-purple-600/50 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

      {/* Toggle track with icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <Sun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500/30 transition-all duration-300" />
        <Moon className="w-3.5 h-3.5 text-indigo-400/30 dark:text-indigo-200 transition-all duration-300" />
      </div>

      {/* Animated toggle switch */}
      <motion.div
        className="absolute top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center"
        initial={false}
        animate={{
          left: isDark ? 'calc(100% - 28px)' : '4px',
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-4 h-4 text-indigo-600" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-4 h-4 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
