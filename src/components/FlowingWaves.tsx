import { useEffect, useRef, useState } from "react";

const FlowingWaves = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waveOffset = scrollY * 0.1;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[800px] overflow-hidden pointer-events-none z-0">
      {/* Primary wave - purple/magenta */}
      <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        style={{ transform: `translateX(${-waveOffset}px)` }}
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(270 80% 40% / 0.4)" />
            <stop offset="50%" stopColor="hsl(280 70% 50% / 0.3)" />
            <stop offset="100%" stopColor="hsl(320 70% 45% / 0.2)" />
          </linearGradient>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          fill="none"
          stroke="url(#waveGrad1)"
          strokeWidth="3"
          filter="url(#glow1)"
          d="M-100,600 C200,500 400,700 600,550 C800,400 1000,650 1200,500 C1400,350 1600,550 1800,450"
        />
        <path
          fill="none"
          stroke="url(#waveGrad1)"
          strokeWidth="2"
          opacity="0.6"
          d="M-100,650 C250,550 450,700 650,600 C850,500 1050,700 1250,550 C1450,400 1650,600 1850,500"
        />
      </svg>

      {/* Secondary wave - cyan/blue */}
      <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        style={{ transform: `translateX(${waveOffset * 0.5}px)` }}
      >
        <defs>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(200 80% 50% / 0.2)" />
            <stop offset="50%" stopColor="hsl(190 100% 50% / 0.15)" />
            <stop offset="100%" stopColor="hsl(210 80% 50% / 0.1)" />
          </linearGradient>
        </defs>
        <path
          fill="none"
          stroke="url(#waveGrad2)"
          strokeWidth="2"
          d="M-50,700 C150,600 350,750 550,650 C750,550 950,720 1150,620 C1350,520 1550,680 1750,580"
        />
      </svg>

      {/* Filled wave area */}
      <svg
        className="absolute bottom-0 w-full h-[400px]"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(270 60% 20% / 0.3)" />
            <stop offset="50%" stopColor="hsl(250 50% 15% / 0.4)" />
            <stop offset="100%" stopColor="hsl(230 50% 10% / 0.5)" />
          </linearGradient>
        </defs>
        <path
          fill="url(#fillGrad)"
          d="M0,100 C240,50 480,150 720,100 C960,50 1200,130 1440,80 L1440,400 L0,400 Z"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        />
      </svg>

      {/* Diagonal accent line */}
      <div 
        className="absolute bottom-0 right-0 w-[800px] h-[800px]"
        style={{
          background: `linear-gradient(135deg, transparent 45%, hsl(190 100% 50% / 0.15) 50%, transparent 55%)`,
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      />
      <div 
        className="absolute bottom-0 right-[100px] w-[600px] h-[600px]"
        style={{
          background: `linear-gradient(135deg, transparent 45%, hsl(280 80% 50% / 0.1) 50%, transparent 55%)`,
          transform: `translateY(${scrollY * 0.06}px)`,
        }}
      />
    </div>
  );
};

export default FlowingWaves;