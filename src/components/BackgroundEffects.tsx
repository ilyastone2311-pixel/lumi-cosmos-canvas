import { useEffect, useState, useMemo } from "react";
import InteractiveStarfield from "./InteractiveStarfield";
import FlowingWaves from "./FlowingWaves";

const BackgroundEffects = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate nebula positions once
  const nebulas = useMemo(() => [
    { x: 75, y: 15, size: 500, color: "270 70% 20%", blur: 120 },
    { x: 15, y: 40, size: 400, color: "220 60% 18%", blur: 100 },
    { x: 85, y: 60, size: 350, color: "190 80% 15%", blur: 90 },
    { x: 30, y: 75, size: 450, color: "280 50% 15%", blur: 110 },
    { x: 60, y: 25, size: 300, color: "200 70% 12%", blur: 80 },
  ], []);

  // Generate star dust particles
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

  // Floating orb configurations
  const floatingOrbs = useMemo(() => [
    { x: 80, y: 20, size: 200, color: "190 100% 50%", opacity: 0.08 },
    { x: 10, y: 50, size: 150, color: "270 100% 60%", opacity: 0.06 },
    { x: 70, y: 70, size: 180, color: "320 80% 50%", opacity: 0.05 },
    { x: 25, y: 30, size: 120, color: "200 90% 45%", opacity: 0.07 },
    { x: 90, y: 85, size: 100, color: "250 70% 55%", opacity: 0.06 },
  ], []);

  // Enhanced parallax multipliers for different depth layers
  const parallaxSlow = scrollY * 0.02;
  const parallaxMedium = scrollY * 0.05;
  const parallaxFast = scrollY * 0.08;
  const parallaxUltraFast = scrollY * 0.12;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
            background: `radial-gradient(circle, hsl(${nebula.color} / 0.15) 0%, hsl(${nebula.color} / 0.05) 40%, transparent 70%)`,
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
            background: `radial-gradient(circle, hsl(${orb.color} / ${orb.opacity}) 0%, transparent 60%)`,
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
