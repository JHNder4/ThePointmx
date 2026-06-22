import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.90 }}
      aria-label="Cambiar tema"
      className="fixed z-50 flex items-center justify-center rounded-full transition-all duration-300"
      style={{
        bottom: "1.4rem",
        right: "3.2rem",
        width: 34,
        height: 34,
        background: isDark ? "rgba(28,28,32,0.92)" : "rgba(255,255,255,0.92)",
        border: isDark ? "1px solid rgba(63,63,70,0.6)" : "1px solid rgba(0,0,0,0.10)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: isDark
          ? "0 2px 14px rgba(0,0,0,0.45)"
          : "0 2px 14px rgba(0,0,0,0.10)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {isDark ? (
            <Sun className="w-[15px] h-[15px] text-amber-400" />
          ) : (
            <Moon className="w-[15px] h-[15px] text-indigo-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
