import { useEffect, useState, useMemo } from "react";
import InteractiveStarfield from "./InteractiveStarfield";
import FlowingWaves from "./FlowingWaves";

const BackgroundEffects = () => {
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Generate nebula positions once
  const nebulas = useMemo(() => [
    { x: 75, y: 15, size: 500, colorDark: "270 70% 20%", colorLight: "270 60% 85%", blur: 120 },
    { x: 15, y: 40, size: 400, colorDark: "220 60% 18%", colorLight: "220 50% 88%", blur: 100 },
    { x: 85, y: 60, size: 350, colorDark: "190 80% 15%", colorLight: "190 70% 85%", blur: 90 },
    { x: 30, y: 75, size: 450, colorDark: "280 50% 15%", colorLight: "280 50% 88%", blur: 110 },
    { x: 60, y: 25, size: 300, colorDark: "200 70% 12%", colorLight: "200 60% 90%", blur: 80 },
  ], []);

  // Light mode star dust - softer, more numerous
  const lightStarDust = useMemo(() => 
    [...Array(60)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      opacity: 0.15 + Math.random() * 0.35,
      delay: Math.random() * 4,
      duration: 2.5 + Math.random() * 3,
      color: i % 4 === 0 
        ? '320 100% 70%' // Pink
        : i % 4 === 1 
          ? '270 80% 75%' // Lavender
          : i % 4 === 2
            ? '195 85% 55%' // Cyan
            : '0 0% 75%', // Silver
    })), 
  []);

  // Light mode floating nebulae - soft pastel clouds
  const lightNebulae = useMemo(() => [
    { x: 80, y: 10, size: 600, color: '320 100% 70%', opacity: 0.08 }, // Pink
    { x: 15, y: 35, size: 500, color: '270 80% 75%', opacity: 0.1 }, // Lavender
    { x: 90, y: 55, size: 450, color: '195 85% 60%', opacity: 0.06 }, // Cyan
    { x: 25, y: 80, size: 550, color: '320 80% 75%', opacity: 0.07 }, // Pink-lavender
    { x: 60, y: 20, size: 400, color: '270 60% 80%', opacity: 0.09 }, // Soft lavender
    { x: 45, y: 65, size: 480, color: '195 70% 65%', opacity: 0.05 }, // Light cyan
  ], []);

  // Light mode holographic orbs
  const lightOrbs = useMemo(() => [
    { x: 85, y: 15, size: 250, gradient: 'linear-gradient(135deg, hsla(320, 100%, 70%, 0.12) 0%, hsla(270, 80%, 75%, 0.08) 50%, transparent 100%)' },
    { x: 10, y: 45, size: 200, gradient: 'linear-gradient(225deg, hsla(270, 80%, 75%, 0.1) 0%, hsla(195, 85%, 60%, 0.06) 50%, transparent 100%)' },
    { x: 75, y: 70, size: 180, gradient: 'linear-gradient(45deg, hsla(195, 85%, 55%, 0.08) 0%, hsla(320, 100%, 70%, 0.1) 50%, transparent 100%)' },
    { x: 30, y: 25, size: 220, gradient: 'linear-gradient(315deg, hsla(320, 80%, 75%, 0.09) 0%, hsla(270, 70%, 80%, 0.07) 50%, transparent 100%)' },
  ], []);

  // Generate star dust particles for dark mode
  const starDust = useMemo(() => 
    [...Array(40)].map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.5,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    })), 
  []);

  // Floating orb configurations for dark mode
  const floatingOrbs = useMemo(() => [
    { x: 80, y: 20, size: 200, colorDark: "190 100% 50%", colorLight: "190 80% 60%", opacity: 0.08 },
    { x: 10, y: 50, size: 150, colorDark: "270 100% 60%", colorLight: "270 70% 70%", opacity: 0.06 },
    { x: 70, y: 70, size: 180, colorDark: "320 80% 50%", colorLight: "320 60% 70%", opacity: 0.05 },
    { x: 25, y: 30, size: 120, colorDark: "200 90% 45%", colorLight: "200 70% 65%", opacity: 0.07 },
    { x: 90, y: 85, size: 100, colorDark: "250 70% 55%", colorLight: "250 60% 75%", opacity: 0.06 },
  ], []);

  // Enhanced parallax multipliers for different depth layers
  const parallaxSlow = scrollY * 0.02;
  const parallaxMedium = scrollY * 0.05;
  const parallaxFast = scrollY * 0.08;
  const parallaxUltraFast = scrollY * 0.12;

  // Light mode background with full cosmic treatment
  if (isLight) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-500">
        {/* Base gradient - soft cosmic gray with gentle color hints */}
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

        {/* Soft nebulae clouds - pink and lavender */}
        {lightNebulae.map((nebula, i) => (
          <div
            key={`light-nebula-${i}`}
            className="absolute rounded-full will-change-transform animate-pulse"
            style={{
              left: `${nebula.x}%`,
              top: `${nebula.y}%`,
              width: `${nebula.size}px`,
              height: `${nebula.size}px`,
              background: `radial-gradient(circle, hsl(${nebula.color} / ${nebula.opacity}) 0%, hsl(${nebula.color} / ${nebula.opacity * 0.3}) 40%, transparent 70%)`,
              filter: 'blur(80px)',
              transform: `translate(-50%, -50%) translate3d(0, ${parallaxSlow * (0.5 + i * 0.2)}px, 0)`,
              transition: 'transform 0.1s linear',
              animationDuration: `${6 + i * 2}s`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}

        {/* Holographic gradient orbs */}
        {lightOrbs.map((orb, i) => (
          <div
            key={`light-orb-${i}`}
            className="absolute rounded-full will-change-transform"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: orb.gradient,
              filter: 'blur(40px)',
              transform: `translate(-50%, -50%) translate3d(${(i % 2 === 0 ? 1 : -1) * parallaxMedium * 0.2}px, ${parallaxMedium * (0.8 + i * 0.15)}px, 0)`,
              transition: 'transform 0.1s linear',
            }}
          />
        ))}

        {/* Floating star dust particles */}
        {lightStarDust.map((star, i) => (
          <div
            key={`light-star-${i}`}
            className="absolute rounded-full will-change-transform"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `hsl(${star.color})`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 3}px hsl(${star.color} / 0.4)`,
              transform: `translate3d(0, ${parallaxMedium * (0.3 + (i % 5) * 0.15)}px, 0)`,
              transition: 'transform 0.1s linear',
              animation: `pulse ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Large soft glow - Pink accent */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full will-change-transform"
          style={{
            top: '-10%',
            right: '-5%',
            background: 'radial-gradient(circle, hsla(320, 100%, 70%, 0.1) 0%, hsla(320, 100%, 70%, 0.03) 40%, transparent 70%)',
            filter: 'blur(100px)',
            transform: `translate3d(${parallaxSlow * -0.2}px, ${parallaxFast * 0.5}px, 0)`,
            transition: 'transform 0.1s linear',
          }}
        />

        {/* Large soft glow - Lavender accent */}
        <div 
          className="absolute w-[700px] h-[700px] rounded-full will-change-transform"
          style={{
            top: '30%',
            left: '-10%',
            background: 'radial-gradient(circle, hsla(270, 80%, 75%, 0.12) 0%, hsla(270, 80%, 75%, 0.04) 40%, transparent 70%)',
            filter: 'blur(120px)',
            transform: `translate3d(${parallaxMedium * 0.3}px, ${parallaxUltraFast * 0.4}px, 0)`,
            transition: 'transform 0.1s linear',
          }}
        />

        {/* Cyan accent glow */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
          style={{
            bottom: '10%',
            right: '20%',
            background: 'radial-gradient(circle, hsla(195, 85%, 55%, 0.08) 0%, hsla(195, 85%, 55%, 0.02) 50%, transparent 70%)',
            filter: 'blur(80px)',
            transform: `translate3d(${parallaxMedium * -0.3}px, ${-parallaxMedium * 0.5}px, 0)`,
            transition: 'transform 0.1s linear',
          }}
        />

        {/* Holographic wave effect - top */}
        <div 
          className="absolute inset-x-0 top-0 h-[50vh] pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, 
                hsla(270, 60%, 95%, 0.6) 0%, 
                hsla(320, 80%, 97%, 0.3) 30%, 
                transparent 100%
              )
            `,
            opacity: 0.8,
          }}
        />

        {/* Holographic wave effect - bottom */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[40vh] pointer-events-none"
          style={{
            background: `
              linear-gradient(0deg, 
                hsla(195, 70%, 95%, 0.5) 0%, 
                hsla(270, 60%, 97%, 0.2) 40%, 
                transparent 100%
              )
            `,
            opacity: 0.7,
          }}
        />

        {/* Subtle holographic shimmer lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: `
              repeating-linear-gradient(
                135deg,
                transparent 0px,
                transparent 80px,
                hsla(320, 100%, 70%, 0.15) 80px,
                hsla(320, 100%, 70%, 0.15) 81px
              ),
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                transparent 120px,
                hsla(270, 80%, 75%, 0.1) 120px,
                hsla(270, 80%, 75%, 0.1) 121px
              )
            `,
            transform: `translateX(${scrollY * 0.05}px)`,
          }}
        />

        {/* Star cluster effect - scattered bright points */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="lightStarGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[...Array(25)].map((_, i) => (
            <circle
              key={`star-cluster-${i}`}
              cx={`${10 + Math.random() * 80}%`}
              cy={`${10 + Math.random() * 80}%`}
              r={0.5 + Math.random() * 1.5}
              fill={i % 3 === 0 ? '#FF6BDA' : i % 3 === 1 ? '#D2B4FF' : '#33E8FF'}
              opacity={0.3 + Math.random() * 0.4}
              filter="url(#lightStarGlow)"
            />
          ))}
        </svg>

        {/* Soft vignette for depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, hsla(220, 30%, 95%, 0.4) 100%)',
          }}
        />

        {/* Very subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.008]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    );
  }

  // Dark mode background (unchanged)
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-500">
      {/* Deep cosmic gradient base - enhanced */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 80% 10%, hsl(270 60% 12% / 0.8) 0%, transparent 45%),
            radial-gradient(ellipse at 10% 30%, hsl(220 70% 10% / 0.7) 0%, transparent 40%),
            radial-gradient(ellipse at 90% 60%, hsl(200 50% 8% / 0.6) 0%, transparent 45%),
            radial-gradient(ellipse at 30% 80%, hsl(280 60% 10% / 0.7) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(240 50% 6% / 0.9) 0%, transparent 70%),
            linear-gradient(180deg, hsl(235 55% 4%) 0%, hsl(250 50% 5%) 30%, hsl(230 45% 6%) 70%, hsl(240 50% 4%) 100%)
          `,
        }}
      />

      {/* Subtle nebula clouds - slowest parallax (far background) */}
      {nebulas.map((nebula, i) => (
        <div
          key={`nebula-${i}`}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            background: `radial-gradient(circle, hsl(${nebula.colorDark} / 0.15) 0%, hsl(${nebula.colorDark} / 0.05) 40%, transparent 70%)`,
            filter: `blur(${nebula.blur}px)`,
            transform: `translate(-50%, -50%) translate3d(0, ${parallaxSlow * (1 + i * 0.3)}px, 0)`,
            transition: 'transform 0.1s linear',
          }}
        />
      ))}

      {/* Interactive starfield */}
      <InteractiveStarfield />

      {/* Star dust particles - medium parallax */}
      {starDust.map((star, i) => (
        <div
          key={`dust-${i}`}
          className="absolute rounded-full animate-pulse will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: i % 3 === 0 
              ? 'hsl(190 100% 70%)' 
              : i % 3 === 1 
                ? 'hsl(270 80% 75%)' 
                : 'hsl(0 0% 95%)',
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: `0 0 ${star.size * 2}px hsl(190 100% 60% / 0.5)`,
            transform: `translate3d(0, ${parallaxMedium * (0.5 + (i % 5) * 0.2)}px, 0)`,
            transition: 'transform 0.1s linear',
          }}
        />
      ))}

      {/* Large glowing orbs with enhanced multi-layer parallax */}
      <div 
        className="absolute w-[700px] h-[700px] rounded-full will-change-transform"
        style={{
          top: '5%',
          right: '5%',
          background: 'radial-gradient(circle, hsl(190 100% 50% / 0.12) 0%, hsl(190 100% 50% / 0.03) 50%, transparent 70%)',
          filter: 'blur(80px)',
          transform: `translate3d(${parallaxSlow * -0.3}px, ${parallaxFast}px, 0)`,
          transition: 'transform 0.1s linear',
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          top: '25%',
          left: '0%',
          background: 'radial-gradient(circle, hsl(270 80% 55% / 0.15) 0%, hsl(270 80% 55% / 0.04) 45%, transparent 70%)',
          filter: 'blur(100px)',
          transform: `translate3d(${parallaxMedium * 0.2}px, ${parallaxUltraFast}px, 0)`,
          transition: 'transform 0.1s linear',
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
        style={{
          bottom: '15%',
          right: '15%',
          background: 'radial-gradient(circle, hsl(320 70% 50% / 0.1) 0%, hsl(320 70% 50% / 0.02) 50%, transparent 70%)',
          filter: 'blur(90px)',
          transform: `translate3d(${parallaxMedium * -0.4}px, ${-parallaxMedium}px, 0)`,
          transition: 'transform 0.1s linear',
        }}
      />
      
      {/* New: Foreground accent orb - fastest parallax */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full will-change-transform"
        style={{
          top: '60%',
          left: '70%',
          background: 'radial-gradient(circle, hsl(200 90% 60% / 0.08) 0%, transparent 60%)',
          filter: 'blur(60px)',
          transform: `translate3d(${parallaxUltraFast * -0.5}px, ${parallaxUltraFast * 1.5}px, 0)`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Small floating accent orbs - varied parallax speeds */}
      {floatingOrbs.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full animate-pulse will-change-transform"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, hsl(${orb.colorDark} / ${orb.opacity}) 0%, transparent 60%)`,
            filter: 'blur(30px)',
            animationDuration: `${3 + i}s`,
            animationDelay: `${i * 0.5}s`,
            transform: `translate(-50%, -50%) translate3d(${(i % 2 === 0 ? 1 : -1) * parallaxMedium * 0.3}px, ${(parallaxMedium + i * parallaxSlow)}px, 0)`,
            transition: 'transform 0.1s linear',
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

      {/* Flowing waves at bottom */}
      <FlowingWaves />

      {/* Cosmic light rays */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: `
            repeating-linear-gradient(
              115deg,
              transparent 0px,
              transparent 100px,
              hsl(190 100% 50% / 0.1) 100px,
              hsl(190 100% 50% / 0.1) 101px
            )
          `,
          transform: `translateX(${scrollY * 0.1}px)`,
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(230 50% 3% / 0.4) 100%)',
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
