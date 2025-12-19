import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";

// Dark theme illustration
import heroImageDark from "@/assets/hero-reader-dark-user.png";
// Light theme illustration
import heroImageLight from "@/assets/hero-reader-light-user.png";

const HeroIllustration = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isSwitching, setIsSwitching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based fade out
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 350, 600], [1, 1, 0]);
  const scrollScale = useTransform(scrollY, [0, 350, 600], [1, 1, 0.9]);
  const scrollYOffset = useTransform(scrollY, [0, 600], [0, 100]);

  useEffect(() => {
    const stored = localStorage.getItem("lumi-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
    setMounted(true);

    const observer = new MutationObserver(() => {
      const root = document.documentElement;
      const isLight = root.classList.contains("light");
      const switching = root.classList.contains("theme-switching");
      setIsSwitching(switching);
      setTheme(isLight ? "light" : "dark");
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const isLightTheme = mounted && theme === 'light';
  const currentHeroImage = isLightTheme ? heroImageLight : heroImageDark;

  // Mouse position for parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !isHovered) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleTap = () => {
    setIsTapped(true);
    setIsHovered(true);
    setTimeout(() => {
      setIsTapped(false);
      setIsHovered(false);
    }, 2000);
  };

  // Sparkles positioned around the illustration
  const sparkles = useMemo(() => [
    { top: "8%", right: "20%", size: 16, delay: 0 },
    { top: "18%", right: "8%", size: 12, delay: 0.6 },
    { bottom: "22%", right: "12%", size: 14, delay: 1.2 },
    { top: "40%", right: "28%", size: 10, delay: 1.8 },
    { bottom: "35%", left: "15%", size: 12, delay: 0.3 },
    { top: "25%", left: "20%", size: 10, delay: 0.9 },
  ], []);

  const isActive = isHovered || isTapped;

  if (!mounted) {
    return <div className="w-full h-full" />;
  }

  return (
    <motion.div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center pointer-events-auto"
      style={{
        perspective: "1200px",
        opacity: scrollOpacity,
        scale: scrollScale,
        y: scrollYOffset,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTap}
    >
      {/* Ambient glow behind illustration */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-visible"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[100px]"
          style={{
            background: isLightTheme
              ? 'radial-gradient(ellipse at center, hsla(270, 80%, 75%, 0.25) 0%, hsla(270, 60%, 85%, 0.12) 40%, transparent 70%)'
              : 'radial-gradient(ellipse at center, hsla(195, 100%, 50%, 0.22) 0%, hsla(195, 80%, 40%, 0.1) 40%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Main illustration container - fills the space */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Illustration with floating animation */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={{
            y: isActive ? [0, -10, 0] : [0, -5, 0],
            scale: isActive ? 1.01 : 1,
          }}
          transition={{
            y: { duration: isActive ? 2.5 : 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.4, ease: [0.2, 0.9, 0.2, 1] },
          }}
        >
          {/* Theme transition glow pulse */}
          <AnimatePresence>
            {isSwitching && (
              <motion.div
                className="absolute inset-[-20%] rounded-full pointer-events-none z-30"
                style={{
                  background: isLightTheme
                    ? 'radial-gradient(ellipse at center, hsla(270, 90%, 75%, 0.5) 0%, transparent 55%)'
                    : 'radial-gradient(ellipse at center, hsla(195, 100%, 55%, 0.5) 0%, transparent 55%)',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: [0, 1, 0], scale: [0.85, 1.15, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* The image - fills the container while maintaining aspect ratio */}
          <div className="relative w-full h-full overflow-visible flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={isLightTheme ? "hero-light" : "hero-dark"}
                src={currentHeroImage}
                alt="Girl reading inside a transparent bubble illustration"
                className="object-contain relative z-10"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                  opacity: isSwitching ? 0.4 : 1,
                  scale: isSwitching ? 1.15 : 1.18,
                }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  filter: isActive
                    ? isLightTheme
                      ? "drop-shadow(0 0 70px hsla(270, 85%, 60%, 0.55))"
                      : "drop-shadow(0 0 70px hsla(195, 100%, 50%, 0.6))"
                    : isLightTheme
                      ? "drop-shadow(0 0 50px hsla(270, 85%, 65%, 0.4))"
                      : "drop-shadow(0 0 50px hsla(195, 100%, 45%, 0.45))",
                  willChange: "transform, filter, opacity",
                }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Sparkles - positioned relative to container */}
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-20"
          style={{ 
            top: sparkle.top, 
            bottom: sparkle.bottom, 
            right: sparkle.right,
            left: sparkle.left,
          }}
          animate={{
            opacity: isActive ? [0.6, 1, 0.6] : [0.35, 0.65, 0.35],
            scale: isActive ? [1, 1.35, 1] : [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: isActive ? 1.8 : 3,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" 
              fill={isLightTheme ? "hsla(270, 100%, 70%, 0.9)" : "hsla(195, 100%, 75%, 0.9)"}
            />
          </svg>
        </motion.div>
      ))}

      {/* Glowing rings extending into space - scaled up to match the artwork */}
      <motion.div
        className="absolute top-1/2 right-[12%] -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <div
          className="w-[110vh] h-[110vh] rounded-full"
          style={{
            border: isLightTheme
              ? "1px solid hsla(270, 80%, 75%, 0.2)"
              : "1px solid hsla(195, 100%, 60%, 0.2)",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-[8%] -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        <div
          className="w-[140vh] h-[140vh] rounded-full"
          style={{
            border: isLightTheme
              ? "1px solid hsla(270, 80%, 75%, 0.12)"
              : "1px solid hsla(195, 100%, 60%, 0.12)",
          }}
        />
      </motion.div>

      {/* Hover glow ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute top-1/2 right-[10%] -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              border: isLightTheme
                ? "2px solid hsla(270, 100%, 70%, 0.4)"
                : "2px solid hsla(195, 100%, 65%, 0.4)",
            }}
            initial={{ width: "26vh", height: "26vh", opacity: 0.8 }}
            animate={{ width: "95vh", height: "95vh", opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HeroIllustration;
