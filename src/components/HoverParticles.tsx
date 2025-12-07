import { useRef, useState, useEffect, useCallback } from 'react';

interface HoverParticlesProps {
  children: React.ReactNode;
  className?: string;
  particleCount?: number;
  particleColor?: string;
  glowIntensity?: 'subtle' | 'medium' | 'strong';
  disabled?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
}

const HoverParticles = ({
  children,
  className = '',
  particleCount = 6,
  particleColor,
  glowIntensity = 'subtle',
  disabled = false,
}: HoverParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const animationRef = useRef<number>();

  // Detect theme
  useEffect(() => {
    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const getParticleColor = useCallback(() => {
    if (particleColor) return particleColor;
    return theme === 'light' 
      ? '320 100% 72%' // Pink for light mode
      : '195 100% 60%'; // Cyan for dark mode
  }, [theme, particleColor]);

  const glowSizes = {
    subtle: { glow: 8, spread: 4 },
    medium: { glow: 12, spread: 6 },
    strong: { glow: 16, spread: 8 },
  };

  // Handle mouse enter - spawn particles
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsHovered(true);
    
    // Create initial particles around mouse position
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.5;
      const distance = 15 + Math.random() * 20;
      newParticles.push({
        id: Date.now() + i,
        x: e.clientX - rect.left + Math.cos(angle) * distance,
        y: e.clientY - rect.top + Math.sin(angle) * distance,
        size: 2 + Math.random() * 3,
        opacity: 0.4 + Math.random() * 0.4,
        velocityX: Math.cos(angle) * (0.3 + Math.random() * 0.4),
        velocityY: Math.sin(angle) * (0.3 + Math.random() * 0.4),
      });
    }
    setParticles(newParticles);
  }, [disabled, particleCount]);

  // Track mouse position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [disabled]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Animate particles
  useEffect(() => {
    if (!isHovered || particles.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX,
            y: p.y + p.velocityY,
            opacity: p.opacity * 0.98,
            velocityX: p.velocityX * 0.99,
            velocityY: p.velocityY * 0.99,
          }))
          .filter(p => p.opacity > 0.1)
      );

      // Occasionally spawn new particle near mouse
      if (Math.random() > 0.85 && particles.length < particleCount * 2) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 8 + Math.random() * 15;
        setParticles(prev => [...prev, {
          id: Date.now(),
          x: mousePos.x + Math.cos(angle) * distance,
          y: mousePos.y + Math.sin(angle) * distance,
          size: 1.5 + Math.random() * 2.5,
          opacity: 0.3 + Math.random() * 0.4,
          velocityX: Math.cos(angle) * (0.2 + Math.random() * 0.3),
          velocityY: Math.sin(angle) * (0.2 + Math.random() * 0.3),
        }]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, mousePos, particles.length, particleCount]);

  // Fade out particles when not hovered
  useEffect(() => {
    if (!isHovered && particles.length > 0) {
      const fadeOut = () => {
        setParticles(prev => 
          prev
            .map(p => ({ ...p, opacity: p.opacity * 0.9 }))
            .filter(p => p.opacity > 0.05)
        );
      };
      
      const interval = setInterval(fadeOut, 50);
      return () => clearInterval(interval);
    }
  }, [isHovered, particles.length]);

  const { glow, spread } = glowSizes[glowIntensity];
  const color = getParticleColor();

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered ? 'translate3d(0, -2px, 0)' : 'translate3d(0, 0, 0)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Particles layer */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit"
        style={{ borderRadius: 'inherit' }}
      >
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: `hsl(${color})`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${glow}px hsl(${color} / 0.6), 0 0 ${spread}px hsl(${color} / 0.3)`,
              transform: 'translate(-50%, -50%)',
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      {/* Soft radius glow on hover */}
      <div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          borderRadius: 'inherit',
          opacity: isHovered ? 1 : 0,
          boxShadow: `0 0 ${glow * 2}px hsl(${color} / 0.15), 0 0 ${glow * 4}px hsl(${color} / 0.08)`,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Children */}
      {children}
    </div>
  );
};

export default HoverParticles;