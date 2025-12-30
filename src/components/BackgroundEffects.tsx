import { useState, useEffect, memo, useMemo } from "react";
import FloatingLines from "./FloatingLines";
import { useIsMobile } from "@/hooks/use-mobile";

// Lightweight CSS-based particles - enhanced for light mode visibility
const BackgroundParticles = memo(({ isLight }: { isLight: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: isLight ? 20 : 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: isLight ? (2 + Math.random() * 2.5) : (2 + Math.random() * 3),
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 15,
      opacity: isLight ? (0.12 + Math.random() * 0.08) : (0.35 + Math.random() * 0.2),
    })), [isLight]
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
            // Light mode: visible soft dots with subtle color
            // Dark mode: deeper saturated colors
            background: isLight 
              ? `hsla(240, 45%, 70%, ${p.opacity})`
              : `hsla(220, 80%, 50%, ${p.opacity})`,
            boxShadow: isLight
              ? `0 0 ${8 + p.size}px hsla(250, 40%, 65%, ${p.opacity * 0.5})`
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
  const isMobile = useIsMobile();

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
  
  // Mobile: reduce line count and opacity for better readability
  const mobileLineCount = isMobile ? [2, 3, 2] : undefined;
  const mobileOpacityLight = isMobile ? 0.1 : 0.16;
  const mobileOpacityDark = isMobile ? 0.4 : 0.7;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Clean background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'var(--gradient-cosmic)',
        }}
      />

      {/* Light mode: Subtle nebula haze for atmospheric depth */}
      {isLight && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {/* Soft nebula gradients - max 6-8% opacity */}
          <div 
            className="absolute top-[10%] left-[15%] w-[40%] h-[35%] rounded-full animate-nebula-float"
            style={{
              background: 'radial-gradient(ellipse, hsla(210, 50%, 85%, 0.06) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <div 
            className="absolute top-[25%] right-[10%] w-[35%] h-[30%] rounded-full animate-nebula-float"
            style={{
              background: 'radial-gradient(ellipse, hsla(270, 40%, 88%, 0.05) 0%, transparent 70%)',
              filter: 'blur(50px)',
              animationDelay: '-15s',
            }}
          />
          <div 
            className="absolute bottom-[20%] left-[25%] w-[45%] h-[35%] rounded-full animate-nebula-float"
            style={{
              background: 'radial-gradient(ellipse, hsla(195, 45%, 87%, 0.05) 0%, transparent 65%)',
              filter: 'blur(45px)',
              animationDelay: '-30s',
            }}
          />
        </div>
      )}

      {/* Floating Lines - Light mode: luminous pastels with hover interactions */}
      {isLight ? (
        <div 
          className="absolute inset-0 pointer-events-auto" 
          style={{ 
            zIndex: 1,
            opacity: mobileOpacityLight,
          }}
        >
          <FloatingLines
            key={`light-${key}`}
            linesGradient={lightColors}
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={mobileLineCount ?? [3, 4, 3]}
            lineDistance={[10, 8, 9]}
            bendRadius={5.0}
            bendStrength={-0.35}
            interactive={!isMobile}
            parallax={!isMobile}
            parallaxStrength={0.15}
            animationSpeed={isMobile ? 0.2 : 0.25}
            mouseDamping={0.03}
            mixBlendMode="screen"
          />
        </div>
      ) : (
        <div 
          className="absolute inset-0 pointer-events-auto" 
          style={{ 
            zIndex: 1,
            opacity: mobileOpacityDark,
          }}
        >
          <FloatingLines
            key={`dark-${key}`}
            linesGradient={darkColors}
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={mobileLineCount ?? [4, 6, 7]}
            lineDistance={[7, 6, 5]}
            bendRadius={5.0}
            bendStrength={-0.5}
            interactive={!isMobile}
            parallax={!isMobile}
            parallaxStrength={0.2}
            animationSpeed={isMobile ? 0.5 : 0.7}
            mouseDamping={0.04}
            mixBlendMode="screen"
          />
        </div>
      )}

      {/* Particles - both modes, but lighter in light mode */}
      <BackgroundParticles isLight={isLight} />
    </div>
  );
};

export default BackgroundEffects;
