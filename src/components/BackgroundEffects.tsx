import { useState, useEffect, memo, useMemo } from "react";
import FloatingLines from "./FloatingLines";

// Lightweight CSS-based particles
const BackgroundParticles = memo(({ isLight }: { isLight: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
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
              ? `hsla(280, 80%, 55%, ${0.6 + Math.random() * 0.3})`
              : `hsla(200, 90%, 55%, ${0.5 + Math.random() * 0.3})`,
            boxShadow: isLight
              ? `0 0 ${6 + p.size}px hsla(280, 80%, 55%, 0.5)`
              : `0 0 ${6 + p.size}px hsla(200, 90%, 55%, 0.5)`,
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
      setKey(prev => prev + 1);
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Clean background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'hsl(var(--background))',
        }}
      />

      {/* Floating Lines - darker blues for dark theme, bright purples/magentas for light theme */}
      <div className="absolute inset-0 pointer-events-auto">
        <FloatingLines
          key={key}
          linesGradient={isLight 
            ? ['#d946ef', '#e879f9', '#f0abfc', '#c084fc', '#a855f7'] // Bright magentas/purples for light
            : ['#1e3a5f', '#2d4a6f', '#1a365d', '#234876', '#0c4a6e'] // Darker blues for dark theme
          }
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[6, 8, 10]}
          lineDistance={[5, 4, 3]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          parallaxStrength={0.2}
          animationSpeed={1}
          mouseDamping={0.05}
          mixBlendMode={isLight ? "normal" : "screen"}
        />
      </div>

      {/* Particles */}
      <BackgroundParticles isLight={isLight} />
    </div>
  );
};

export default BackgroundEffects;
