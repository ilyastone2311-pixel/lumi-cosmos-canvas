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
            // Darker, more saturated particles - no bright white cores
            background: isLight 
              ? `hsla(220, 60%, 70%, ${0.3 + Math.random() * 0.2})`
              : `hsla(220, 80%, 50%, ${0.35 + Math.random() * 0.2})`,
            boxShadow: isLight
              ? `0 0 ${4 + p.size}px hsla(220, 60%, 65%, 0.3)`
              : `0 0 ${4 + p.size}px hsla(240, 70%, 55%, 0.35)`,
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

  // Light mode: very subtle, desaturated colors - minimal cosmic presence
  // Soft grays with hint of cool blue - premium, clean appearance
  const lightColors = ['#c4d0dc', '#b8c4d4', '#d0d8e4', '#c8d4e0', '#bcc8d8'];
  // Dark mode: deeper, more saturated colors - NO white/bright cores
  const darkColors = ['#1d4ed8', '#6d28d9', '#7c3aed', '#a21caf', '#0891b2'];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Clean background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'hsl(var(--background))',
        }}
      />

      {/* Floating Lines - Light mode: extremely subtle, almost invisible */}
      {isLight ? (
        <div 
          className="absolute inset-0 pointer-events-auto" 
          style={{ 
            zIndex: 1,
            opacity: 0.12, // Very low opacity for subtle presence
            filter: 'blur(1px)', // Softer lines
          }}
        >
          <FloatingLines
            key={`light-${key}`}
            linesGradient={lightColors}
            enabledWaves={['middle']} // Only middle wave for minimal presence
            lineCount={[3, 3, 3]} // Fewer lines
            lineDistance={[10, 8, 8]} // More spacing
            bendRadius={4.0}
            bendStrength={-0.3}
            interactive={false} // No interaction in light mode
            parallax={true}
            parallaxStrength={0.1} // Very subtle parallax
            animationSpeed={0.3} // Slower, calmer motion
            mouseDamping={0.02}
            mixBlendMode="multiply" // Matte blend
          />
        </div>
      ) : (
        <div 
          className="absolute inset-0 pointer-events-auto" 
          style={{ 
            zIndex: 1,
            opacity: 0.7, // Reduced overall opacity
          }}
        >
          <FloatingLines
            key={`dark-${key}`}
            linesGradient={darkColors}
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[4, 6, 7]} // Slightly fewer lines
            lineDistance={[7, 6, 5]} // More spacing
            bendRadius={5.0}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
            parallaxStrength={0.2}
            animationSpeed={0.7}
            mouseDamping={0.04}
            mixBlendMode="screen"
          />
        </div>
      )}

      {/* Particles - dark mode only */}
      {!isLight && <BackgroundParticles isLight={isLight} />}
    </div>
  );
};

export default BackgroundEffects;
