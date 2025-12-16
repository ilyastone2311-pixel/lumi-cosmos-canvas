import { useState, useEffect, memo, useMemo } from "react";
import FloatingLines from "./FloatingLines";

// Lightweight CSS-based particles
const BackgroundParticles = memo(({ isLight }: { isLight: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
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
              ? `hsla(270, 70%, 65%, ${0.5 + Math.random() * 0.3})`
              : `hsla(195, 90%, 65%, ${0.6 + Math.random() * 0.3})`,
            boxShadow: isLight
              ? `0 0 ${6 + p.size}px hsla(270, 70%, 60%, 0.6)`
              : `0 0 ${8 + p.size}px hsla(195, 90%, 60%, 0.7)`,
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
  const [key, setKey] = useState(0);

  useEffect(() => {
    const checkTheme = () => {
      const newIsLight = document.documentElement.classList.contains('light');
      setIsLight(newIsLight);
      // Force re-render of FloatingLines when theme changes
      setKey(prev => prev + 1);
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Clean background - NO darkening overlay for light theme */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'hsl(var(--background))',
        }}
      />

      {/* Subtle ambient glow for depth */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isLight
            ? `radial-gradient(ellipse at 70% 30%, hsla(270, 60%, 85%, 0.25) 0%, transparent 55%),
               radial-gradient(ellipse at 25% 70%, hsla(200, 60%, 85%, 0.2) 0%, transparent 50%)`
            : `radial-gradient(ellipse at 75% 20%, hsla(265, 60%, 45%, 0.12) 0%, transparent 50%),
               radial-gradient(ellipse at 20% 75%, hsla(195, 70%, 45%, 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Floating Lines - theme-specific colors */}
      <div className="absolute inset-0 pointer-events-auto">
        <FloatingLines
          key={key}
          linesGradient={isLight 
            ? ['#7c3aed', '#a855f7', '#c084fc', '#8b5cf6', '#6d28d9']
            : ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6']
          }
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[8, 12, 16]}
          lineDistance={[10, 7, 5]}
          bendRadius={4.0}
          bendStrength={-0.6}
          interactive={true}
          parallax={true}
          animationSpeed={0.7}
          opacity={isLight ? 0.85 : 1.0}
          mixBlendMode={isLight ? "normal" : "screen"}
        />
      </div>

      {/* Particles */}
      <BackgroundParticles isLight={isLight} />
    </div>
  );
};

export default BackgroundEffects;
