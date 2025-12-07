import { useEffect, useState, useMemo, useRef } from "react";
import InteractiveStarfield from "./InteractiveStarfield";

// Throttle for scroll performance
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number>();

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

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const isLight = theme === 'light';

  // Animated floating particles for dark mode
  const darkFloatingParticles = useMemo(() => [
    { x: 15, y: 20, size: 4, color: "190 100% 60%", delay: 0 },
    { x: 85, y: 35, size: 3, color: "270 80% 65%", delay: 1 },
    { x: 25, y: 65, size: 5, color: "320 70% 55%", delay: 2 },
    { x: 70, y: 80, size: 3, color: "200 90% 55%", delay: 3 },
    { x: 50, y: 15, size: 4, color: "280 75% 60%", delay: 4 },
  ], []);

  // Animated floating particles for light mode
  const lightFloatingParticles = useMemo(() => [
    { x: 20, y: 25, size: 5, color: "320 100% 75%", delay: 0 },
    { x: 80, y: 40, size: 4, color: "270 85% 80%", delay: 1 },
    { x: 30, y: 70, size: 6, color: "195 90% 65%", delay: 2 },
    { x: 65, y: 85, size: 4, color: "280 80% 75%", delay: 3 },
    { x: 45, y: 12, size: 5, color: "310 95% 70%", delay: 4 },
  ], []);

  // Light mode twinkle stars
  const lightTwinkleStars = useMemo(() => 
    [...Array(isMobile ? 8 : 15)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    })),
  [isMobile]);

  // Reduced nebula positions for performance
  const nebulas = useMemo(() => [
    { x: 75, y: 15, size: 400, color: "270 70% 20%" },
    { x: 15, y: 40, size: 350, color: "220 60% 18%" },
    { x: 85, y: 60, size: 300, color: "190 80% 15%" },
  ], []);

  // Reduced particle count for better performance
  const lightStarDust = useMemo(() => 
    [...Array(isMobile ? 15 : 30)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.3,
      color: i % 3 === 0 ? '320 100% 70%' : i % 3 === 1 ? '270 80% 75%' : '195 85% 55%',
    })), 
  [isMobile]);

  // Reduced nebulae for light mode
  const lightNebulae = useMemo(() => [
    { x: 80, y: 10, size: 500, color: '320 100% 70%', opacity: 0.06 },
    { x: 15, y: 35, size: 400, color: '270 80% 75%', opacity: 0.08 },
    { x: 60, y: 65, size: 450, color: '195 85% 60%', opacity: 0.05 },
  ], []);

  // Reduced orbs for light mode
  const lightOrbs = useMemo(() => [
    { x: 85, y: 15, size: 200, gradient: 'linear-gradient(135deg, hsla(320, 100%, 70%, 0.1) 0%, transparent 100%)' },
    { x: 10, y: 45, size: 180, gradient: 'linear-gradient(225deg, hsla(270, 80%, 75%, 0.08) 0%, transparent 100%)' },
  ], []);

  // Reduced star dust for dark mode
  const starDust = useMemo(() => 
    [...Array(isMobile ? 12 : 25)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.2,
      opacity: 0.3 + Math.random() * 0.4,
    })), 
  [isMobile]);

  // Reduced floating orbs for dark mode
  const floatingOrbs = useMemo(() => [
    { x: 80, y: 20, size: 180, color: "190 100% 50%", opacity: 0.06 },
    { x: 10, y: 50, size: 140, color: "270 100% 60%", opacity: 0.05 },
    { x: 70, y: 70, size: 160, color: "320 80% 50%", opacity: 0.04 },
  ], []);

  // GPU-friendly parallax - only transform, no filter animations
  // Disabled on mobile for better performance
  const parallaxSlow = isMobile ? 0 : scrollY * 0.015;
  const parallaxMedium = isMobile ? 0 : scrollY * 0.03;

  // Light mode background
  if (isLight) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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

        {/* Animated floating particles - Light theme */}
        {lightFloatingParticles.map((particle, i) => (
          <div
            key={`light-float-${i}`}
            className={`absolute rounded-full ${i % 2 === 0 ? 'animate-float-soft' : 'animate-float-soft-alt'}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, hsl(${particle.color}) 0%, hsl(${particle.color} / 0.3) 100%)`,
              boxShadow: `0 0 ${particle.size * 3}px hsl(${particle.color} / 0.4)`,
              animationDelay: `${particle.delay * 5}s`,
            }}
          />
        ))}

        {/* Twinkle stars - Light theme */}
        {lightTwinkleStars.map((star, i) => (
          <div
            key={`light-twinkle-${i}`}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, hsla(270, 80%, 85%, 0.9) 0%, transparent 70%)`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Animated nebula clouds - Light theme */}
        {lightNebulae.map((nebula, i) => (
          <div
            key={`light-nebula-${i}`}
            className="absolute rounded-full cosmic-element animate-nebula-float"
            style={{
              left: `${nebula.x}%`,
              top: `${nebula.y}%`,
              width: `${nebula.size}px`,
              height: `${nebula.size}px`,
              background: `radial-gradient(circle, hsl(${nebula.color} / ${nebula.opacity}) 0%, transparent 70%)`,
              filter: 'blur(60px)',
              animationDelay: `${i * 15}s`,
              transform: `translate(-50%, -50%) translate3d(0, ${parallaxSlow * (0.5 + i * 0.2)}px, 0)`,
            }}
          />
        ))}

        {/* Holographic gradient orbs with pulse */}
        {lightOrbs.map((orb, i) => (
          <div
            key={`light-orb-${i}`}
            className="absolute rounded-full cosmic-element animate-gentle-pulse"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: orb.gradient,
              filter: 'blur(30px)',
              animationDelay: `${i * 4}s`,
              transform: `translate(-50%, -50%) translate3d(0, ${parallaxMedium * (0.5 + i * 0.15)}px, 0)`,
            }}
          />
        ))}

        {/* Floating star dust particles */}
        {lightStarDust.map((star, i) => (
          <div
            key={`light-star-${i}`}
            className="absolute rounded-full cosmic-element"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `hsl(${star.color})`,
              opacity: star.opacity,
              transform: `translate3d(0, ${parallaxMedium * (0.3 + (i % 5) * 0.1)}px, 0)`,
            }}
          />
        ))}

        {/* Geometric shimmer grid - very subtle */}
        {!isMobile && (
          <div 
            className="absolute inset-0 animate-soft-shimmer"
            style={{
              backgroundImage: `
                linear-gradient(hsla(270, 60%, 80%, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, hsla(270, 60%, 80%, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        )}

        {/* Large soft glow - Pink accent with pulse */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full cosmic-element animate-gentle-pulse"
          style={{
            top: '-10%',
            right: '-5%',
            background: 'radial-gradient(circle, hsla(320, 100%, 70%, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDuration: '12s',
            transform: `translate3d(${parallaxSlow * -0.2}px, ${parallaxMedium * 0.5}px, 0)`,
          }}
        />

        {/* Large soft glow - Lavender accent with pulse */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full cosmic-element animate-gentle-pulse"
          style={{
            top: '30%',
            left: '-10%',
            background: 'radial-gradient(circle, hsla(270, 80%, 75%, 0.1) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animationDelay: '6s',
            animationDuration: '10s',
            transform: `translate3d(${parallaxMedium * 0.3}px, ${parallaxMedium * 0.4}px, 0)`,
          }}
        />

        {/* Holographic wave effect - top */}
        <div 
          className="absolute inset-x-0 top-0 h-[40vh] pointer-events-none"
          style={{
            background: `linear-gradient(180deg, hsla(270, 60%, 95%, 0.6) 0%, transparent 100%)`,
            opacity: 0.8,
          }}
        />

        {/* Holographic wave effect - bottom */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[30vh] pointer-events-none"
          style={{
            background: `linear-gradient(0deg, hsla(195, 70%, 95%, 0.5) 0%, transparent 100%)`,
            opacity: 0.7,
          }}
        />

        {/* Soft vignette for depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, hsla(220, 30%, 95%, 0.4) 100%)',
          }}
        />
      </div>
    );
  }

  // Dark mode background
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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

      {/* Animated floating particles - Dark theme */}
      {darkFloatingParticles.map((particle, i) => (
        <div
          key={`dark-float-${i}`}
          className={`absolute rounded-full ${i % 2 === 0 ? 'animate-float-soft' : 'animate-cosmic-drift'}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, hsl(${particle.color}) 0%, hsl(${particle.color} / 0.2) 100%)`,
            boxShadow: `0 0 ${particle.size * 4}px hsl(${particle.color} / 0.5)`,
            animationDelay: `${particle.delay * 5}s`,
          }}
        />
      ))}

      {/* Cosmic light streaks - ultra subtle */}
      {!isMobile && (
        <>
          <div 
            className="absolute h-[1px] w-[200px] animate-cosmic-streak"
            style={{
              top: '25%',
              left: '-100px',
              background: 'linear-gradient(90deg, transparent, hsla(190, 100%, 60%, 0.15), transparent)',
              animationDuration: '45s',
            }}
          />
          <div 
            className="absolute h-[1px] w-[150px] animate-cosmic-streak"
            style={{
              top: '65%',
              left: '-100px',
              background: 'linear-gradient(90deg, transparent, hsla(270, 80%, 65%, 0.12), transparent)',
              animationDuration: '55s',
              animationDelay: '20s',
            }}
          />
        </>
      )}

      {/* Subtle nebula clouds with animation */}
      {nebulas.map((nebula, i) => (
        <div
          key={`nebula-${i}`}
          className="absolute rounded-full cosmic-element animate-nebula-float"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            background: `radial-gradient(circle, hsl(${nebula.color} / 0.15) 0%, transparent 70%)`,
            filter: 'blur(80px)',
            animationDelay: `${i * 15}s`,
            transform: `translate(-50%, -50%) translate3d(0, ${parallaxSlow * (1 + i * 0.3)}px, 0)`,
          }}
        />
      ))}

      {/* Interactive starfield */}
      <InteractiveStarfield />

      {/* Star dust particles */}
      {starDust.map((star, i) => (
        <div
          key={`dust-${i}`}
          className="absolute rounded-full cosmic-element"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: i % 3 === 0 ? 'hsl(190 100% 70%)' : i % 3 === 1 ? 'hsl(270 80% 75%)' : 'hsl(0 0% 95%)',
            opacity: star.opacity,
            transform: `translate3d(0, ${parallaxMedium * (0.5 + (i % 5) * 0.2)}px, 0)`,
          }}
        />
      ))}

      {/* Large glowing orbs with pulse */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full cosmic-element animate-gentle-pulse"
        style={{
          top: '5%',
          right: '5%',
          background: 'radial-gradient(circle, hsl(190 100% 50% / 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDuration: '10s',
          transform: `translate3d(${parallaxSlow * -0.3}px, ${parallaxMedium}px, 0)`,
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full cosmic-element animate-gentle-pulse"
        style={{
          top: '25%',
          left: '0%',
          background: 'radial-gradient(circle, hsl(270 80% 55% / 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animationDelay: '5s',
          animationDuration: '12s',
          transform: `translate3d(${parallaxMedium * 0.2}px, ${parallaxMedium}px, 0)`,
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full cosmic-element animate-gentle-pulse"
        style={{
          bottom: '15%',
          right: '15%',
          background: 'radial-gradient(circle, hsl(320 70% 50% / 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animationDelay: '8s',
          animationDuration: '14s',
          transform: `translate3d(${parallaxMedium * -0.4}px, ${-parallaxMedium}px, 0)`,
        }}
      />

      {/* Small floating accent orbs with animation */}
      {floatingOrbs.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className={`absolute rounded-full cosmic-element ${i % 2 === 0 ? 'animate-float-soft-alt' : 'animate-cosmic-drift'}`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, hsl(${orb.color} / ${orb.opacity}) 0%, transparent 60%)`,
            filter: 'blur(25px)',
            animationDelay: `${i * 8}s`,
            transform: `translate(-50%, -50%) translate3d(0, ${parallaxMedium * (0.5 + i * 0.2)}px, 0)`,
          }}
        />
      ))}

      {/* Gradient wave overlays */}
      <div 
        className="absolute inset-x-0 top-0 h-[40vh]"
        style={{
          background: 'linear-gradient(180deg, hsl(240 50% 4% / 0.9) 0%, transparent 100%)',
        }}
      />
      <div 
        className="absolute inset-x-0 bottom-0 h-[30vh]"
        style={{
          background: 'linear-gradient(0deg, hsl(235 50% 5% / 0.95) 0%, transparent 100%)',
        }}
      />

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(240 50% 3%) 100%)',
        }}
      />
    </div>
  );
};

export default BackgroundEffects;