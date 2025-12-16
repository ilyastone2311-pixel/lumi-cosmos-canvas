import { useState, useEffect, memo, useMemo } from "react";
import FloatingLines from "./FloatingLines";

// Lightweight CSS-based particles
const BackgroundParticles = memo(({ isLight }: { isLight: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 18 }, (_, i) => ({
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
              ? `hsla(220, 60%, 70%, ${0.3 + Math.random() * 0.2})`
              : `hsla(200, 90%, 55%, ${0.4 + Math.random() * 0.25})`,
            boxShadow: isLight
              ? `0 0 ${4 + p.size}px hsla(220, 60%, 65%, 0.3)`
              : `0 0 ${6 + p.size}px hsla(200, 90%, 55%, 0.4)`,
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

  // Colors for floating lines
  const lightColors = ['#bfdbfe', '#c7d2fe', '#ddd6fe', '#fce7f3', '#a5f3fc'];
  const darkColors = ['#1e3a8a', '#312e81', '#4c1d95', '#5b21b6', '#0e7490'];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Clean background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'hsl(var(--background))',
        }}
      />

      {/* Light theme: very subtle nebula */}
      {isLight && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 70% 25%, hsla(200, 70%, 88%, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 25% 70%, hsla(260, 50%, 90%, 0.05) 0%, transparent 45%)
            `,
          }}
        />
      )}

      {/* Floating Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingLines
          key={key}
          linesGradient={isLight ? lightColors : darkColors}
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
          mixBlendMode={isLight ? "multiply" : "screen"}
        />
      </div>

      {/* Particles */}
      <BackgroundParticles isLight={isLight} />
    </div>
  );
};

export default BackgroundEffects;
