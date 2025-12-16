import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";

// Dark theme illustration
import heroImageDark from "@/assets/hero-reader-dark.png";
// Light theme illustration
import heroImageLight from "@/assets/hero-reader-light.png";

const HeroIllustration = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isSwitching, setIsSwitching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based fade out
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 400, 600], [1, 1, 0]);
  const scrollScale = useTransform(scrollY, [0, 400, 600], [1, 1, 0.9]);
  const scrollY2 = useTransform(scrollY, [0, 600], [0, 60]);

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

  // Mouse position for parallax tilt (simplified)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

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

  // Minimal sparkle accents
  const sparkles = useMemo(() => [
    { top: "10%", right: "20%", size: 10, delay: 0 },
    { top: "25%", right: "8%", size: 7, delay: 0.8 },
    { bottom: "30%", right: "15%", size: 8, delay: 1.5 },
  ], []);

  const isActive = isHovered || isTapped;

  if (!mounted) {
    return (
      <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[60vw] h-[85vh] min-w-[380px] max-w-[800px] min-h-[480px] max-h-[850px] z-10" />
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[60vw] h-[85vh] min-w-[380px] max-w-[800px] min-h-[480px] max-h-[850px] z-10 pointer-events-auto"
      style={{
        perspective: "1000px",
        opacity: scrollOpacity,
        scale: scrollScale,
        y: scrollY2,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTap}
    >
      {/* Main illustration container with 3D tilt */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Illustration with floating animation */}
        <motion.div
          className="relative w-[90%] h-auto"
          animate={{
            y: isActive ? [0, -15, 0] : [0, -8, 0],
            scale: isActive ? 1.04 : 1,
          }}
          transition={{
            y: { duration: isActive ? 2.5 : 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.3, ease: [0.2, 0.9, 0.2, 1] },
          }}
        >
          {/* Soft bottom fade into background - NO FRAME */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: `linear-gradient(to top, 
                hsl(var(--background)) 0%, 
                hsla(var(--background), 0.6) 10%,
                hsla(var(--background), 0.2) 20%,
                transparent 30%
              )`,
            }}
          />

          {/* Theme transition glow pulse */}
          <AnimatePresence>
            {isSwitching && (
              <motion.div
                className="absolute inset-[-20%] rounded-full pointer-events-none z-30"
                style={{
                  background: isLightTheme
                    ? 'radial-gradient(ellipse at center, hsla(280, 100%, 80%, 0.4) 0%, transparent 60%)'
                    : 'radial-gradient(ellipse at center, hsla(195, 100%, 60%, 0.4) 0%, transparent 60%)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* The image with crossfade theme transition */}
          <div className="hero-image-container relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={isLightTheme ? "hero-light" : "hero-dark"}
                src={currentHeroImage}
                alt="Magical reading illustration"
                className="w-full h-auto object-contain relative z-10"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ 
                  opacity: isSwitching ? 0.3 : 1, 
                  scale: isSwitching ? 1.02 : 1,
                }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  filter: isActive 
                    ? isLightTheme
                      ? 'drop-shadow(0 0 30px hsla(280, 80%, 65%, 0.35))'
                      : 'drop-shadow(0 0 30px hsla(195, 100%, 55%, 0.4))'
                    : isLightTheme
                      ? 'drop-shadow(0 0 20px hsla(280, 80%, 70%, 0.2))'
                      : 'drop-shadow(0 0 20px hsla(195, 100%, 50%, 0.25))',
                  willChange: 'transform, filter',
                }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Minimal sparkles */}
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: sparkle.top, bottom: sparkle.bottom, right: sparkle.right }}
          animate={{
            opacity: isActive ? [0.5, 0.9, 0.5] : [0.3, 0.6, 0.3],
            scale: isActive ? [1, 1.3, 1] : [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: isActive ? 2 : 3,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" 
              fill={isLightTheme ? "hsla(280, 100%, 70%, 0.85)" : "hsla(195, 100%, 75%, 0.85)"}
            />
          </svg>
        </motion.div>
      ))}

      {/* Hover glow ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              border: isLightTheme
                ? '1px solid hsla(280, 100%, 75%, 0.3)'
                : '1px solid hsla(195, 100%, 70%, 0.3)',
            }}
            initial={{ width: '40%', height: '40%', opacity: 0.6 }}
            animate={{ width: '85%', height: '85%', opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HeroIllustration;
