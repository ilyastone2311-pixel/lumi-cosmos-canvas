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

  // Colors for floating lines - matching Library/For You pages
  // Light: soft pastels that work on bright backgrounds
  const lightColors = ['#94a3b8', '#a5b4fc', '#c4b5fd', '#f0abfc', '#67e8f9'];
  // Dark: rich deep colors for dark backgrounds  
  const darkColors = ['#3b82f6', '#8b5cf6', '#a855f7', '#c026d3', '#06b6d4'];

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

      {/* Floating Lines - unified settings like Library/For You */}
      <div className="absolute inset-0 pointer-events-auto" style={{ zIndex: 1 }}>
        <FloatingLines
          key={key}
          linesGradient={isLight ? lightColors : darkColors}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[5, 7, 9]}
          lineDistance={[6, 5, 4]}
          bendRadius={6.0}
          bendStrength={-0.6}
          interactive={true}
          parallax={true}
          parallaxStrength={0.25}
          animationSpeed={0.8}
          mouseDamping={0.04}
          mixBlendMode={isLight ? "multiply" : "screen"}
        />
      </div>

      {/* Particles */}
      <BackgroundParticles isLight={isLight} />
    </div>
  );
};

export default BackgroundEffects;
