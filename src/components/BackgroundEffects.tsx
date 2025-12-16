import { useState, useEffect, memo, useMemo } from "react";
import FloatingLines from "./FloatingLines";

// Lightweight CSS-based particles (no heavy JS animations)
const BackgroundParticles = memo(({ isLight }: { isLight: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: isLight 
              ? `hsla(265, 70%, 60%, ${0.3 + Math.random() * 0.3})`
              : `hsla(195, 80%, 60%, ${0.4 + Math.random() * 0.3})`,
            boxShadow: isLight
              ? `0 0 ${4 + p.size}px hsla(265, 70%, 55%, 0.4)`
              : `0 0 ${4 + p.size}px hsla(195, 80%, 55%, 0.5)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
});

BackgroundParticles.displayName = 'BackgroundParticles';

const BackgroundEffects = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.documentElement.classList.contains('light'));
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isLight
            ? `radial-gradient(ellipse at 70% 20%, hsla(265, 50%, 90%, 0.4) 0%, transparent 50%),
               radial-gradient(ellipse at 30% 70%, hsla(195, 45%, 90%, 0.3) 0%, transparent 50%),
               hsl(var(--background))`
            : `radial-gradient(ellipse at 80% 10%, hsl(var(--secondary) / 0.15) 0%, transparent 50%),
               radial-gradient(ellipse at 20% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
               hsl(var(--background))`,
        }}
      />

      {/* Floating Lines - different blend for light/dark */}
      <div className="absolute inset-0 pointer-events-auto">
        <FloatingLines
          linesGradient={isLight 
            ? ['#8b5cf6', '#a855f7', '#c084fc', '#7c3aed']  // Purple tones for light
            : ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6']  // Cyan/purple for dark
          }
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[10, 14, 18]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          animationSpeed={0.8}
          opacity={isLight ? 0.6 : 1}
          mixBlendMode={isLight ? "multiply" : "screen"}
        />
      </div>

      {/* Lightweight floating particles */}
      <BackgroundParticles isLight={isLight} />

      {/* Soft depth gradient for section blending */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, 
            hsl(var(--background) / 0.2) 0%, 
            transparent 10%,
            transparent 90%,
            hsl(var(--background) / 0.2) 100%
          )`,
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
