import { useEffect, useState, useMemo, useRef } from "react";
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

  // Mouse parallax - smooth tracking with direct event handling
  useEffect(() => {
    if (isMobile) return;
    
    let animationFrame: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setMousePos({
          x: (e.clientX - centerX) / centerX,
          y: (e.clientY - centerY) / centerY,
        });
        animationFrame = 0;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isMobile]);

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
  
  // Glowing orbs - cyan, electric blue, violet, magenta - MORE VISIBLE
  const darkGlowingOrbs = useMemo(() => [
    { x: 12, y: 15, size: 12, color: "190 100% 60%", parallaxMouse: 0.15, parallaxScroll: 0.1 },
    { x: 88, y: 25, size: 10, color: "220 95% 65%", parallaxMouse: 0.1, parallaxScroll: 0.15 },
    { x: 20, y: 55, size: 14, color: "280 80% 60%", parallaxMouse: 0.18, parallaxScroll: 0.12 },
    { x: 75, y: 70, size: 10, color: "320 75% 55%", parallaxMouse: 0.12, parallaxScroll: 0.18 },
    { x: 45, y: 12, size: 6, color: "195 90% 55%", parallaxMouse: 0.12, parallaxScroll: 0.06 },
    { x: 60, y: 85, size: 4, color: "270 85% 65%", parallaxMouse: 0.08, parallaxScroll: 0.18 },
    { x: 8, y: 78, size: 5, color: "200 90% 58%", parallaxMouse: 0.14, parallaxScroll: 0.12 },
    { x: 92, y: 48, size: 4, color: "315 70% 58%", parallaxMouse: 0.1, parallaxScroll: 0.1 },
  ], []);

  // Nebula mist layers with blur - MORE VISIBLE
  const darkNebulas = useMemo(() => [
    { x: 75, y: 10, size: 550, color: "270 70% 28%", opacity: 0.2, parallaxScroll: 0.06 },
    { x: 15, y: 35, size: 480, color: "220 60% 22%", opacity: 0.18, parallaxScroll: 0.1 },
    { x: 85, y: 55, size: 420, color: "195 75% 22%", opacity: 0.15, parallaxScroll: 0.08 },
    { x: 25, y: 75, size: 460, color: "310 65% 25%", opacity: 0.18, parallaxScroll: 0.12 },
  ], []);

  // Neon waves/arcs - MORE VISIBLE
  const darkNeonWaves = useMemo(() => [
    { x: 20, y: 25, width: 350, height: 120, rotation: 15, color: "190 100% 60%", opacity: 0.08 },
    { x: 70, y: 60, width: 300, height: 100, rotation: -20, color: "270 80% 65%", opacity: 0.07 },
    { x: 50, y: 85, width: 320, height: 110, rotation: 8, color: "320 70% 55%", opacity: 0.06 },
  ], []);

  // Twinkling stars - MORE VISIBLE
  const darkTwinkleStars = useMemo(() => 
    [...Array(isMobile ? 15 : 35)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 3,
      parallaxMouse: Math.random() * 0.08,
    })),
  [isMobile]);

  // Star dust particles - MORE VISIBLE
  const darkStarDust = useMemo(() => 
    [...Array(isMobile ? 20 : 50)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      opacity: 0.4 + Math.random() * 0.4,
      color: i % 4 === 0 ? "190 100% 70%" : i % 4 === 1 ? "270 80% 75%" : i % 4 === 2 ? "320 70% 65%" : "0 0% 95%",
      parallaxScroll: 0.08 + Math.random() * 0.2,
    })),
  [isMobile]);

  // === LIGHT THEME ELEMENTS - ENHANCED VISIBILITY ===

  // Light mode glowing particles - MUCH MORE VISIBLE
  const lightGlowingOrbs = useMemo(() => [
    { x: 10, y: 15, size: 28, color: "320 85% 65%", parallaxMouse: 0.2, parallaxScroll: 0.12 },
    { x: 90, y: 22, size: 24, color: "280 75% 68%", parallaxMouse: 0.15, parallaxScroll: 0.18 },
    { x: 18, y: 55, size: 32, color: "195 80% 55%", parallaxMouse: 0.22, parallaxScroll: 0.14 },
    { x: 82, y: 68, size: 22, color: "340 80% 62%", parallaxMouse: 0.16, parallaxScroll: 0.2 },
    { x: 45, y: 10, size: 20, color: "265 70% 65%", parallaxMouse: 0.18, parallaxScroll: 0.1 },
    { x: 58, y: 85, size: 26, color: "200 75% 52%", parallaxMouse: 0.14, parallaxScroll: 0.22 },
    { x: 35, y: 75, size: 18, color: "310 85% 60%", parallaxMouse: 0.12, parallaxScroll: 0.16 },
    { x: 72, y: 38, size: 22, color: "220 70% 58%", parallaxMouse: 0.2, parallaxScroll: 0.12 },
  ], []);

  // Light mode nebulae - ENHANCED
  const lightNebulae = useMemo(() => [
    { x: 85, y: 5, size: 700, color: '320 90% 65%', opacity: 0.25, parallaxScroll: 0.08 },
    { x: 8, y: 35, size: 600, color: '270 70% 70%', opacity: 0.3, parallaxScroll: 0.12 },
    { x: 70, y: 60, size: 550, color: '195 75% 55%', opacity: 0.22, parallaxScroll: 0.1 },
    { x: 25, y: 80, size: 500, color: '340 85% 68%', opacity: 0.2, parallaxScroll: 0.14 },
    { x: 50, y: 25, size: 450, color: '210 65% 60%', opacity: 0.18, parallaxScroll: 0.06 },
  ], []);

  // Light mode twinkle stars - MORE AND BRIGHTER
  const lightTwinkleStars = useMemo(() => 
    [...Array(isMobile ? 18 : 45)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      color: i % 5 === 0 ? '320 90% 60%' : i % 5 === 1 ? '270 75% 65%' : i % 5 === 2 ? '195 80% 50%' : i % 5 === 3 ? '340 85% 55%' : '210 70% 55%',
    })),
  [isMobile]);

  // Light mode star dust - MORE PARTICLES
  const lightStarDust = useMemo(() => 
    [...Array(isMobile ? 25 : 60)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      opacity: 0.4 + Math.random() * 0.4,
      color: i % 5 === 0 ? '320 90% 62%' : i % 5 === 1 ? '270 70% 68%' : i % 5 === 2 ? '195 75% 48%' : i % 5 === 3 ? '340 80% 58%' : '210 65% 52%',
      parallaxScroll: 0.08 + Math.random() * 0.15,
    })), 
  [isMobile]);

  // Light mode floating sparkles - NEW
  const lightSparkles = useMemo(() => 
    [...Array(isMobile ? 8 : 18)].map((_, i) => ({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 4,
      color: i % 4 === 0 ? '320 100% 70%' : i % 4 === 1 ? '270 90% 75%' : i % 4 === 2 ? '195 95% 60%' : '340 95% 65%',
      parallaxMouse: 0.1 + Math.random() * 0.15,
    })),
  [isMobile]);

  // GPU-friendly parallax calculations - MORE NOTICEABLE
  const parallaxSlow = isMobile ? 0 : scrollY * 0.05;
  const parallaxMedium = isMobile ? 0 : scrollY * 0.1;
  const mouseParallaxX = isMobile ? 0 : mousePos.x * 25;
  const mouseParallaxY = isMobile ? 0 : mousePos.y * 20;

  // Common container styles
  const containerStyle = {
    opacity: isTransitioning ? 0 : 1,
    transition: 'opacity 0.45s ease',
  };

  // Light mode background - ENHANCED
  if (isLight) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        style={containerStyle}
      >
        {/* Base gradient - more colorful */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 0%, hsla(270, 70%, 92%, 0.9) 0%, transparent 50%),
              radial-gradient(ellipse at 100% 30%, hsla(320, 90%, 90%, 0.7) 0%, transparent 45%),
              radial-gradient(ellipse at 0% 60%, hsla(195, 80%, 88%, 0.8) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 90%, hsla(340, 85%, 92%, 0.6) 0%, transparent 40%),
              linear-gradient(180deg, #F5F7FA 0%, #EDE8F5 50%, #F0F5FA 100%)
            `,
          }}
        />

        {/* Animated nebula clouds with parallax - ENHANCED */}
        {lightNebulae.map((nebula, i) => (
          <div
            key={`light-nebula-${i}`}
            className="absolute rounded-full animate-nebula-float"
            style={{
              left: `${nebula.x}%`,
              top: `${nebula.y}%`,
              width: `${nebula.size}px`,
              height: `${nebula.size}px`,
              background: `radial-gradient(circle, hsl(${nebula.color} / ${nebula.opacity}) 0%, hsl(${nebula.color} / ${nebula.opacity * 0.4}) 50%, transparent 70%)`,
              filter: 'blur(50px)',
              animationDelay: `${i * 10}s`,
              transform: `translate(-50%, -50%) translate3d(${mouseParallaxX * 0.4}px, ${parallaxSlow * nebula.parallaxScroll * 15 + mouseParallaxY * 0.3}px, 0)`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Glowing orbs with mouse + scroll parallax - LARGER AND BRIGHTER */}
        {lightGlowingOrbs.map((orb, i) => (
          <div
            key={`light-orb-${i}`}
            className={`absolute rounded-full ${i % 3 === 0 ? 'animate-float-soft' : i % 3 === 1 ? 'animate-cosmic-drift' : 'animate-float-soft-alt'}`}
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: `radial-gradient(circle, hsl(${orb.color}) 0%, hsl(${orb.color} / 0.4) 60%, transparent 100%)`,
              boxShadow: `0 0 ${orb.size * 3}px hsl(${orb.color} / 0.5), 0 0 ${orb.size * 6}px hsl(${orb.color} / 0.3)`,
              animationDelay: `${i * 3}s`,
              transform: `translate3d(${mouseParallaxX * orb.parallaxMouse}px, ${parallaxMedium * orb.parallaxScroll * 12 + mouseParallaxY * orb.parallaxMouse}px, 0)`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Floating sparkles with mouse parallax - NEW */}
        {lightSparkles.map((sparkle, i) => (
          <div
            key={`light-sparkle-${i}`}
            className="absolute animate-twinkle-slow"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: `radial-gradient(circle, hsl(${sparkle.color}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${sparkle.size * 4}px hsl(${sparkle.color} / 0.7)`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
              transform: `translate3d(${mouseParallaxX * sparkle.parallaxMouse}px, ${mouseParallaxY * sparkle.parallaxMouse}px, 0)`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Twinkle stars with color - ENHANCED */}
        {lightTwinkleStars.map((star, i) => (
          <div
            key={`light-twinkle-${i}`}
            className="absolute rounded-full animate-twinkle-slow"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, hsl(${star.color}) 0%, hsl(${star.color} / 0.5) 50%, transparent 70%)`,
              boxShadow: `0 0 ${star.size * 3}px hsl(${star.color} / 0.6)`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {/* Floating star dust with scroll parallax - MORE VISIBLE */}
        {lightStarDust.map((star, i) => (
          <div
            key={`light-dust-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, hsl(${star.color}) 0%, transparent 100%)`,
              boxShadow: `0 0 ${star.size * 2}px hsl(${star.color} / 0.5)`,
              opacity: star.opacity,
              transform: `translate3d(0, ${parallaxMedium * star.parallaxScroll * 8}px, 0)`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Geometric shimmer grid - slightly more visible */}
        {!isMobile && (
          <div 
            className="absolute inset-0 animate-soft-shimmer"
            style={{
              backgroundImage: `
                linear-gradient(hsla(270, 70%, 70%, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, hsla(270, 70%, 70%, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        )}

        {/* Large soft ambient glows - MORE PROMINENT */}
        <div 
          className="absolute w-[750px] h-[750px] rounded-full animate-gentle-pulse"
          style={{
            top: '-15%',
            right: '-10%',
            background: 'radial-gradient(circle, hsla(320, 90%, 65%, 0.2) 0%, hsla(320, 90%, 65%, 0.08) 50%, transparent 70%)',
            filter: 'blur(60px)',
            animationDuration: '12s',
            transform: `translate3d(${mouseParallaxX * -0.2}px, ${parallaxSlow * 0.8 + mouseParallaxY * -0.15}px, 0)`,
            willChange: 'transform',
          }}
        />
        <div 
          className="absolute w-[650px] h-[650px] rounded-full animate-gentle-pulse"
          style={{
            top: '30%',
            left: '-15%',
            background: 'radial-gradient(circle, hsla(270, 75%, 68%, 0.22) 0%, hsla(270, 75%, 68%, 0.08) 50%, transparent 70%)',
            filter: 'blur(70px)',
            animationDelay: '6s',
            animationDuration: '10s',
            transform: `translate3d(${mouseParallaxX * 0.25}px, ${parallaxMedium * 0.6 + mouseParallaxY * 0.2}px, 0)`,
            willChange: 'transform',
          }}
        />
        <div 
          className="absolute w-[550px] h-[550px] rounded-full animate-gentle-pulse"
          style={{
            bottom: '-10%',
            right: '20%',
            background: 'radial-gradient(circle, hsla(195, 80%, 55%, 0.18) 0%, hsla(195, 80%, 55%, 0.06) 50%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '3s',
            animationDuration: '14s',
            transform: `translate3d(${mouseParallaxX * 0.15}px, ${parallaxSlow * 0.5 + mouseParallaxY * 0.1}px, 0)`,
            willChange: 'transform',
          }}
        />

        {/* Neon accent waves - NEW for light theme */}
        {!isMobile && (
          <>
            <div 
              className="absolute animate-float-soft"
              style={{
                top: '20%',
                left: '15%',
                width: '300px',
                height: '100px',
                background: 'radial-gradient(ellipse at center, hsla(320, 85%, 60%, 0.12) 0%, transparent 70%)',
                filter: 'blur(30px)',
                transform: `rotate(15deg) translate3d(${mouseParallaxX * 0.2}px, ${mouseParallaxY * 0.15}px, 0)`,
                willChange: 'transform',
              }}
            />
            <div 
              className="absolute animate-cosmic-drift"
              style={{
                top: '60%',
                right: '10%',
                width: '280px',
                height: '90px',
                background: 'radial-gradient(ellipse at center, hsla(195, 80%, 50%, 0.1) 0%, transparent 70%)',
                filter: 'blur(25px)',
                transform: `rotate(-20deg) translate3d(${mouseParallaxX * -0.15}px, ${mouseParallaxY * 0.1}px, 0)`,
                willChange: 'transform',
              }}
            />
          </>
        )}

        {/* Holographic wave overlays - softer */}
        <div 
          className="absolute inset-x-0 top-0 h-[40vh]"
          style={{
            background: `linear-gradient(180deg, hsla(270, 70%, 93%, 0.6) 0%, hsla(320, 60%, 95%, 0.3) 50%, transparent 100%)`,
          }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-[30vh]"
          style={{
            background: `linear-gradient(0deg, hsla(195, 75%, 93%, 0.5) 0%, hsla(210, 60%, 95%, 0.2) 50%, transparent 100%)`,
          }}
        />

        {/* Soft vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, hsla(240, 30%, 92%, 0.4) 100%)',
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