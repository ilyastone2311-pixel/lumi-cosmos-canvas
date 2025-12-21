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

  // Light mode: luminous pastels - soft cyan, sky blue, lavender, pink
  // Visible but restrained, like aurora or light refraction
  const lightColors = ['#7dd3fc', '#93c5fd', '#a5b4fc', '#c4b5fd', '#f0abfc'];
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

      {/* Floating Lines - Light mode: luminous pastels, clearly visible but atmospheric */}
      {isLight ? (
        <div 
          className="absolute inset-0 pointer-events-auto" 
          style={{ 
            zIndex: 1,
            opacity: 0.22, // Higher opacity for visibility (8-14% actual after color alpha)
            filter: 'blur(0.5px)', // Slight softness for bloom effect
          }}
        >
          <FloatingLines
            key={`light-${key}`}
            linesGradient={lightColors}
            enabledWaves={['top', 'middle', 'bottom']} // All waves for depth
            lineCount={[3, 4, 3]} // Balanced distribution
            lineDistance={[9, 7, 8]} // Good spacing
            bendRadius={5.0}
            bendStrength={-0.35}
            interactive={false} // No interaction for calm feel
            parallax={true}
            parallaxStrength={0.15} // Subtle parallax
            animationSpeed={0.25} // Slow, calm motion
            mouseDamping={0.02}
            mixBlendMode="multiply" // Soft blend on light background
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
