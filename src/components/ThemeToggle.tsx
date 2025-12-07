import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const THEME_TRANSITION_DURATION = 500; // ms

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("lumi-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("lumi-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    
    // Add switching class for transition animations
    root.classList.add("theme-switching");
    setIsSwitching(true);
    
    // Small delay to let the fade-out start, then switch theme
    setTimeout(() => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, 50);
    
    // Remove switching class after transition completes
    setTimeout(() => {
      root.classList.remove("theme-switching");
      setIsSwitching(false);
    }, THEME_TRANSITION_DURATION);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      disabled={isSwitching}
      className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden theme-toggle-button"
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        background: theme === "dark" 
          ? "linear-gradient(145deg, hsla(250, 30%, 16%, 0.9), hsla(245, 35%, 12%, 0.95))"
          : "linear-gradient(145deg, hsla(220, 40%, 96%, 0.9), hsla(220, 30%, 92%, 0.95))",
        border: theme === "dark"
          ? "1px solid hsla(195, 85%, 55%, 0.2)"
          : "1px solid hsla(195, 85%, 55%, 0.3)",
        boxShadow: theme === "dark"
          ? "0 4px 20px hsla(240, 40%, 4%, 0.4), 0 0 25px hsla(195, 85%, 55%, 0.1)"
          : "0 4px 20px hsla(220, 20%, 70%, 0.3), 0 0 25px hsla(195, 85%, 55%, 0.15)",
        cursor: isSwitching ? "wait" : "pointer",
      }}
    >
      {/* Cosmic pulse glow during switch */}
      <AnimatePresence>
        {isSwitching && (
          <motion.div
            className="absolute inset-[-100%] rounded-full pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              background: "radial-gradient(circle, hsla(280, 80%, 70%, 0.4) 0%, hsla(195, 85%, 60%, 0.2) 40%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle, hsla(195, 85%, 55%, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Icon container with morph animation */}
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Moon 
              className="w-5 h-5" 
              style={{ 
                color: "hsl(195, 85%, 55%)",
                filter: "drop-shadow(0 0 8px hsla(195, 85%, 55%, 0.6))"
              }} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Sun 
              className="w-5 h-5" 
              style={{ 
                color: "hsl(45, 100%, 55%)",
                filter: "drop-shadow(0 0 8px hsla(45, 100%, 55%, 0.6))"
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active indicator ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: theme === "dark"
            ? ["0 0 0 0px hsla(265, 70%, 65%, 0)", "0 0 0 3px hsla(265, 70%, 65%, 0.3)", "0 0 0 0px hsla(265, 70%, 65%, 0)"]
            : ["0 0 0 0px hsla(45, 100%, 55%, 0)", "0 0 0 3px hsla(45, 100%, 55%, 0.3)", "0 0 0 0px hsla(45, 100%, 55%, 0)"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
