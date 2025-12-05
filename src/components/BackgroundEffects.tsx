import { useEffect, useState } from "react";
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

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep cosmic gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 80% 20%, hsl(270 60% 15% / 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, hsl(200 60% 12% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(250 50% 8% / 0.8) 0%, transparent 70%),
            linear-gradient(180deg, hsl(230 50% 4%) 0%, hsl(240 45% 6%) 50%, hsl(230 50% 5%) 100%)
          `,
        }}
      />

      {/* Interactive starfield */}
      <InteractiveStarfield />

      {/* Glowing orbs with parallax */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[180px] bg-primary/15"
        style={{
          top: `${10 - scrollY * 0.05}%`,
          right: '10%',
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[150px] bg-secondary/20"
        style={{
          top: `${30 - scrollY * 0.03}%`,
          left: '5%',
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[120px] bg-accent/10"
        style={{
          bottom: `${20 + scrollY * 0.02}%`,
          right: '20%',
          transform: `translateY(${-scrollY * 0.08}px)`,
        }}
      />

      {/* Flowing waves at bottom */}
      <FlowingWaves />

      {/* Animated sparkle points */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-foreground animate-pulse"
          style={{
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            top: `${10 + i * 10 + Math.sin(i) * 5}%`,
            left: `${15 + i * 10 + Math.cos(i) * 10}%`,
            opacity: 0.6,
            animationDelay: `${i * 0.5}s`,
            transform: `translateY(${scrollY * (0.05 + i * 0.02)}px)`,
          }}
        />
      ))}

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default BackgroundEffects;