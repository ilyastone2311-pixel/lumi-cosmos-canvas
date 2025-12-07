import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import InteractiveStarfield from "./InteractiveStarfield";

// Throttle for scroll/mouse performance
const throttle = <T extends (...args: unknown[]) => void>(fn: T, wait: number) => {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn(...args);
    }
  };
};

const BackgroundEffects = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rafRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = throttle(() => {
      setIsMobile(window.innerWidth < 768);
    }, 200);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Optimized scroll handler with RAF
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafRef.current = undefined;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Mouse parallax - smooth tracking
  const handleMouseMove = useCallback(throttle((e: MouseEvent) => {
    if (isMobile) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMousePos({
      x: (e.clientX - centerX) / centerX,
      y: (e.clientY - centerY) / centerY,
    });
  }, 16), [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("mousemove", handleMouseMove as EventListener);
    return () => window.removeEventListener("mousemove", handleMouseMove as EventListener);
  }, [handleMouseMove, isMobile]);

  // Listen for theme changes with transition detection
  useEffect(() => {
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains('light');
      const isSwitching = document.documentElement.classList.contains('theme-switching');
      
      if (isSwitching) {
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 450);
      }
      
      setTheme(isLight ? 'light' : 'dark');
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const isLight = theme === 'light';

  // === DARK THEME ELEMENTS ===
  
  // Glowing orbs - cyan, electric blue, violet, magenta
  const darkGlowingOrbs = useMemo(() => [
    { x: 12, y: 15, size: 6, color: "190 100% 60%", parallaxMouse: 0.12, parallaxScroll: 0.08 },
    { x: 88, y: 25, size: 5, color: "220 95% 65%", parallaxMouse: 0.08, parallaxScroll: 0.12 },
    { x: 20, y: 55, size: 7, color: "280 80% 60%", parallaxMouse: 0.15, parallaxScroll: 0.1 },
    { x: 75, y: 70, size: 5, color: "320 75% 55%", parallaxMouse: 0.1, parallaxScroll: 0.15 },
    { x: 45, y: 12, size: 6, color: "195 90% 55%", parallaxMouse: 0.12, parallaxScroll: 0.06 },
    { x: 60, y: 85, size: 4, color: "270 85% 65%", parallaxMouse: 0.08, parallaxScroll: 0.18 },
    { x: 8, y: 78, size: 5, color: "200 90% 58%", parallaxMouse: 0.14, parallaxScroll: 0.12 },
    { x: 92, y: 48, size: 4, color: "315 70% 58%", parallaxMouse: 0.1, parallaxScroll: 0.1 },
  ], []);

  // Nebula mist layers with blur
  const darkNebulas = useMemo(() => [
    { x: 75, y: 10, size: 450, color: "270 70% 22%", opacity: 0.12, parallaxScroll: 0.05 },
    { x: 15, y: 35, size: 400, color: "220 60% 18%", opacity: 0.1, parallaxScroll: 0.08 },
    { x: 85, y: 55, size: 350, color: "195 75% 18%", opacity: 0.08, parallaxScroll: 0.06 },
    { x: 25, y: 75, size: 380, color: "310 65% 20%", opacity: 0.1, parallaxScroll: 0.1 },
  ], []);

  // Neon waves/arcs - very low opacity
  const darkNeonWaves = useMemo(() => [
    { x: 20, y: 25, width: 300, height: 100, rotation: 15, color: "190 100% 60%", opacity: 0.04 },
    { x: 70, y: 60, width: 250, height: 80, rotation: -20, color: "270 80% 65%", opacity: 0.035 },
    { x: 50, y: 85, width: 280, height: 90, rotation: 8, color: "320 70% 55%", opacity: 0.03 },
  ], []);

  // Twinkling stars
  const darkTwinkleStars = useMemo(() => 
    [...Array(isMobile ? 12 : 25)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 4,
      parallaxMouse: Math.random() * 0.05,
    })),
  [isMobile]);

  // Star dust particles
  const darkStarDust = useMemo(() => 
    [...Array(isMobile ? 15 : 35)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.25 + Math.random() * 0.35,
      color: i % 4 === 0 ? "190 100% 70%" : i % 4 === 1 ? "270 80% 75%" : i % 4 === 2 ? "320 70% 65%" : "0 0% 95%",
      parallaxScroll: 0.05 + Math.random() * 0.15,
    })),
  [isMobile]);

  // === LIGHT THEME ELEMENTS ===

  // Light mode glowing particles - pastel colors
  const lightGlowingOrbs = useMemo(() => [
    { x: 15, y: 18, size: 7, color: "320 100% 75%", parallaxMouse: 0.12, parallaxScroll: 0.08 },
    { x: 85, y: 28, size: 6, color: "280 85% 78%", parallaxMouse: 0.08, parallaxScroll: 0.12 },
    { x: 22, y: 58, size: 8, color: "195 90% 65%", parallaxMouse: 0.15, parallaxScroll: 0.1 },
    { x: 78, y: 72, size: 5, color: "340 90% 72%", parallaxMouse: 0.1, parallaxScroll: 0.15 },
    { x: 48, y: 14, size: 6, color: "265 80% 75%", parallaxMouse: 0.12, parallaxScroll: 0.06 },
    { x: 62, y: 88, size: 5, color: "200 85% 62%", parallaxMouse: 0.08, parallaxScroll: 0.18 },
  ], []);

  // Light mode nebulae
  const lightNebulae = useMemo(() => [
    { x: 80, y: 8, size: 500, color: '320 100% 72%', opacity: 0.06, parallaxScroll: 0.05 },
    { x: 12, y: 38, size: 420, color: '270 80% 78%', opacity: 0.07, parallaxScroll: 0.08 },
    { x: 65, y: 62, size: 380, color: '195 85% 62%', opacity: 0.05, parallaxScroll: 0.06 },
  ], []);

  // Light mode twinkle stars
  const lightTwinkleStars = useMemo(() => 
    [...Array(isMobile ? 10 : 20)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 3,
      color: i % 3 === 0 ? '320 100% 75%' : i % 3 === 1 ? '270 85% 80%' : '195 90% 70%',
    })),
  [isMobile]);

  // Light mode star dust
  const lightStarDust = useMemo(() => 
    [...Array(isMobile ? 12 : 28)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.3,
      color: i % 4 === 0 ? '320 100% 72%' : i % 4 === 1 ? '270 80% 78%' : i % 4 === 2 ? '195 85% 58%' : '0 0% 100%',
      parallaxScroll: 0.05 + Math.random() * 0.12,
    })), 
  [isMobile]);

  // GPU-friendly parallax calculations
  const parallaxSlow = isMobile ? 0 : scrollY * 0.02;
  const parallaxMedium = isMobile ? 0 : scrollY * 0.04;
  const mouseParallaxX = isMobile ? 0 : mousePos.x * 12;
  const mouseParallaxY = isMobile ? 0 : mousePos.y * 10;

  // Common container styles
  const containerStyle = {
    opacity: isTransitioning ? 0 : 1,
    transition: 'opacity 0.45s ease',
  };

  // Light mode background
  if (isLight) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        style={containerStyle}
      >
        {/* Base gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 0%, hsla(270, 60%, 95%, 0.8) 0%, transparent 50%),
              radial-gradient(ellipse at 100% 50%, hsla(320, 80%, 95%, 0.6) 0%, transparent 40%),
              radial-gradient(ellipse at 0% 80%, hsla(195, 70%, 92%, 0.7) 0%, transparent 45%),
              linear-gradient(180deg, #F5F7FA 0%, #F0F2F8 50%, #F5F7FA 100%)
            `,
          }}
        />

        {/* Animated nebula clouds with parallax */}
        {lightNebulae.map((nebula, i) => (
          <div
            key={`light-nebula-${i}`}
            className="absolute rounded-full animate-nebula-float"
            style={{
              left: `${nebula.x}%`,
              top: `${nebula.y}%`,
              width: `${nebula.size}px`,
              height: `${nebula.size}px`,
              background: `radial-gradient(circle, hsl(${nebula.color} / ${nebula.opacity}) 0%, transparent 70%)`,
              filter: 'blur(60px)',
              animationDelay: `${i * 12}s`,
              transform: `translate(-50%, -50%) translate3d(${mouseParallaxX * 0.3}px, ${parallaxSlow * nebula.parallaxScroll * 10 + mouseParallaxY * 0.2}px, 0)`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Glowing orbs with mouse + scroll parallax */}
        {lightGlowingOrbs.map((orb, i) => (
          <div
            key={`light-orb-${i}`}
            className={`absolute rounded-full ${i % 2 === 0 ? 'animate-float-soft' : 'animate-cosmic-drift'}`}
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: `radial-gradient(circle, hsl(${orb.color}) 0%, hsl(${orb.color} / 0.3) 100%)`,
              boxShadow: `0 0 ${orb.size * 4}px hsl(${orb.color} / 0.35)`,
              animationDelay: `${i * 4}s`,
              transform: `translate3d(${mouseParallaxX * orb.parallaxMouse}px, ${parallaxMedium * orb.parallaxScroll * 8 + mouseParallaxY * orb.parallaxMouse}px, 0)`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Twinkle stars with color */}
        {lightTwinkleStars.map((star, i) => (
          <div
            key={`light-twinkle-${i}`}
            className="absolute rounded-full animate-twinkle-slow"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, hsl(${star.color}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${star.size * 2}px hsl(${star.color} / 0.4)`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {/* Floating star dust with scroll parallax */}
        {lightStarDust.map((star, i) => (
          <div
            key={`light-dust-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `hsl(${star.color})`,
              opacity: star.opacity,
              transform: `translate3d(0, ${parallaxMedium * star.parallaxScroll * 6}px, 0)`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Geometric shimmer grid - very subtle */}
        {!isMobile && (
          <div 
            className="absolute inset-0 animate-soft-shimmer"
            style={{
              backgroundImage: `
                linear-gradient(hsla(270, 60%, 80%, 0.025) 1px, transparent 1px),
                linear-gradient(90deg, hsla(270, 60%, 80%, 0.025) 1px, transparent 1px)
              `,
              backgroundSize: '70px 70px',
            }}
          />
        )}

        {/* Large soft ambient glows */}
        <div 
          className="absolute w-[650px] h-[650px] rounded-full animate-gentle-pulse"
          style={{
            top: '-12%',
            right: '-8%',
            background: 'radial-gradient(circle, hsla(320, 100%, 72%, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDuration: '14s',
            transform: `translate3d(${mouseParallaxX * -0.15}px, ${parallaxSlow * 0.6 + mouseParallaxY * -0.1}px, 0)`,
            willChange: 'transform',
          }}
        />
        <div 
          className="absolute w-[550px] h-[550px] rounded-full animate-gentle-pulse"
          style={{
            top: '35%',
            left: '-12%',
            background: 'radial-gradient(circle, hsla(270, 80%, 78%, 0.1) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animationDelay: '7s',
            animationDuration: '12s',
            transform: `translate3d(${mouseParallaxX * 0.2}px, ${parallaxMedium * 0.5 + mouseParallaxY * 0.15}px, 0)`,
            willChange: 'transform',
          }}
        />

        {/* Holographic wave overlays */}
        <div 
          className="absolute inset-x-0 top-0 h-[35vh]"
          style={{
            background: `linear-gradient(180deg, hsla(270, 60%, 95%, 0.5) 0%, transparent 100%)`,
          }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-[28vh]"
          style={{
            background: `linear-gradient(0deg, hsla(195, 70%, 95%, 0.4) 0%, transparent 100%)`,
          }}
        />

        {/* Soft vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 45%, hsla(220, 30%, 95%, 0.35) 100%)',
          }}
        />
      </div>
    );
  }

  // Dark mode background
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={containerStyle}
    >
      {/* Deep cosmic gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 80% 10%, hsl(270 60% 12% / 0.8) 0%, transparent 45%),
            radial-gradient(ellipse at 10% 30%, hsl(220 70% 10% / 0.7) 0%, transparent 40%),
            radial-gradient(ellipse at 90% 60%, hsl(200 50% 8% / 0.6) 0%, transparent 45%),
            radial-gradient(ellipse at 30% 80%, hsl(280 60% 10% / 0.7) 0%, transparent 50%),
            linear-gradient(180deg, hsl(235 55% 4%) 0%, hsl(250 50% 5%) 50%, hsl(240 50% 4%) 100%)
          `,
        }}
      />

      {/* Nebula mist layers with blur and parallax */}
      {darkNebulas.map((nebula, i) => (
        <div
          key={`dark-nebula-${i}`}
          className="absolute rounded-full animate-nebula-float"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            background: `radial-gradient(circle, hsl(${nebula.color} / ${nebula.opacity}) 0%, transparent 70%)`,
            filter: 'blur(80px)',
            animationDelay: `${i * 15}s`,
            transform: `translate(-50%, -50%) translate3d(${mouseParallaxX * 0.2}px, ${parallaxSlow * nebula.parallaxScroll * 12 + mouseParallaxY * 0.15}px, 0)`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Neon waves/arcs - ultra low opacity */}
      {!isMobile && darkNeonWaves.map((wave, i) => (
        <div
          key={`dark-wave-${i}`}
          className="absolute animate-float-soft-alt"
          style={{
            left: `${wave.x}%`,
            top: `${wave.y}%`,
            width: `${wave.width}px`,
            height: `${wave.height}px`,
            background: `radial-gradient(ellipse at center, hsl(${wave.color} / ${wave.opacity}) 0%, transparent 70%)`,
            transform: `translate(-50%, -50%) rotate(${wave.rotation}deg) translate3d(${mouseParallaxX * 0.1}px, ${parallaxSlow * 0.5}px, 0)`,
            filter: 'blur(40px)',
            animationDelay: `${i * 8}s`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Glowing orbs with mouse + scroll parallax */}
      {darkGlowingOrbs.map((orb, i) => (
        <div
          key={`dark-orb-${i}`}
          className={`absolute rounded-full ${i % 3 === 0 ? 'animate-float-soft' : i % 3 === 1 ? 'animate-cosmic-drift' : 'animate-float-soft-alt'}`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, hsl(${orb.color}) 0%, hsl(${orb.color} / 0.2) 100%)`,
            boxShadow: `0 0 ${orb.size * 5}px hsl(${orb.color} / 0.5)`,
            animationDelay: `${i * 3}s`,
            transform: `translate3d(${mouseParallaxX * orb.parallaxMouse}px, ${parallaxMedium * orb.parallaxScroll * 10 + mouseParallaxY * orb.parallaxMouse}px, 0)`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Cosmic light streaks - ultra subtle */}
      {!isMobile && (
        <>
          <div 
            className="absolute h-[1px] w-[220px] animate-cosmic-streak"
            style={{
              top: '22%',
              left: '-120px',
              background: 'linear-gradient(90deg, transparent, hsla(190, 100%, 60%, 0.12), transparent)',
              animationDuration: '50s',
            }}
          />
          <div 
            className="absolute h-[1px] w-[180px] animate-cosmic-streak"
            style={{
              top: '58%',
              left: '-120px',
              background: 'linear-gradient(90deg, transparent, hsla(270, 80%, 65%, 0.1), transparent)',
              animationDuration: '60s',
              animationDelay: '25s',
            }}
          />
          <div 
            className="absolute h-[1px] w-[150px] animate-cosmic-streak"
            style={{
              top: '78%',
              left: '-100px',
              background: 'linear-gradient(90deg, transparent, hsla(320, 70%, 60%, 0.08), transparent)',
              animationDuration: '55s',
              animationDelay: '15s',
            }}
          />
        </>
      )}

      {/* Twinkling stars with fade animation */}
      {darkTwinkleStars.map((star, i) => (
        <div
          key={`dark-twinkle-${i}`}
          className="absolute rounded-full animate-twinkle-slow"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `radial-gradient(circle, hsla(195, 100%, 80%, 0.9) 0%, transparent 70%)`,
            boxShadow: '0 0 6px hsla(195, 100%, 70%, 0.5)',
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            transform: `translate3d(${mouseParallaxX * star.parallaxMouse}px, ${mouseParallaxY * star.parallaxMouse}px, 0)`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Interactive starfield canvas */}
      <InteractiveStarfield />

      {/* Star dust particles with scroll parallax */}
      {darkStarDust.map((star, i) => (
        <div
          key={`dark-dust-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `hsl(${star.color})`,
            opacity: star.opacity,
            transform: `translate3d(0, ${parallaxMedium * star.parallaxScroll * 8}px, 0)`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Large glowing ambient orbs with pulse and parallax */}
      <div 
        className="absolute w-[650px] h-[650px] rounded-full animate-gentle-pulse"
        style={{
          top: '3%',
          right: '3%',
          background: 'radial-gradient(circle, hsl(190 100% 50% / 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDuration: '12s',
          transform: `translate3d(${mouseParallaxX * -0.2}px, ${parallaxMedium + mouseParallaxY * -0.15}px, 0)`,
          willChange: 'transform',
        }}
      />
      <div 
        className="absolute w-[550px] h-[550px] rounded-full animate-gentle-pulse"
        style={{
          top: '28%',
          left: '-2%',
          background: 'radial-gradient(circle, hsl(270 80% 55% / 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animationDelay: '6s',
          animationDuration: '14s',
          transform: `translate3d(${mouseParallaxX * 0.15}px, ${parallaxMedium + mouseParallaxY * 0.12}px, 0)`,
          willChange: 'transform',
        }}
      />
      <div 
        className="absolute w-[450px] h-[450px] rounded-full animate-gentle-pulse"
        style={{
          bottom: '12%',
          right: '12%',
          background: 'radial-gradient(circle, hsl(320 70% 50% / 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animationDelay: '10s',
          animationDuration: '16s',
          transform: `translate3d(${mouseParallaxX * -0.25}px, ${-parallaxMedium + mouseParallaxY * -0.18}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* Gradient wave overlays */}
      <div 
        className="absolute inset-x-0 top-0 h-[38vh]"
        style={{
          background: 'linear-gradient(180deg, hsl(240 50% 4% / 0.9) 0%, transparent 100%)',
        }}
      />
      <div 
        className="absolute inset-x-0 bottom-0 h-[25vh]"
        style={{
          background: 'linear-gradient(0deg, hsl(240 50% 4% / 0.85) 0%, transparent 100%)',
        }}
      />

      {/* Cosmic vignette for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(240 50% 4% / 0.45) 100%)',
        }}
      />
    </div>
  );
};

export default BackgroundEffects;