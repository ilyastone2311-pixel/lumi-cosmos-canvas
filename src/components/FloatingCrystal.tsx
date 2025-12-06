import { useEffect, useRef } from "react";

const FloatingCrystal = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      
      container.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none transition-transform duration-300 ease-out"
      style={{ zIndex: 5 }}
    >
      {/* Main crystal container */}
      <div className="relative w-full h-full animate-float">
        {/* Outer glow rings */}
        <div 
          className="absolute inset-0 rounded-full animate-spin"
          style={{ 
            animationDuration: '20s',
            background: 'conic-gradient(from 0deg, transparent, hsl(190 100% 50% / 0.1), transparent, hsl(270 100% 65% / 0.1), transparent)',
            filter: 'blur(20px)',
          }}
        />
        
        {/* Secondary spinning ring */}
        <div 
          className="absolute inset-[10%] rounded-full animate-spin"
          style={{ 
            animationDuration: '15s',
            animationDirection: 'reverse',
            background: 'conic-gradient(from 90deg, transparent, hsl(270 100% 65% / 0.15), transparent, hsl(190 100% 50% / 0.15), transparent)',
            filter: 'blur(15px)',
          }}
        />

        {/* Large ambient glow */}
        <div 
          className="absolute inset-[-20%] rounded-full animate-pulse"
          style={{ 
            animationDuration: '4s',
            background: 'radial-gradient(circle, hsl(190 100% 50% / 0.15) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Crystal shape using clip-path */}
        <div 
          className="absolute inset-[15%] animate-pulse"
          style={{
            animationDuration: '3s',
            background: 'linear-gradient(135deg, hsl(190 100% 50% / 0.6), hsl(270 100% 65% / 0.4), hsl(320 100% 60% / 0.3))',
            clipPath: 'polygon(50% 0%, 85% 25%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 15% 25%)',
            filter: 'blur(1px)',
            boxShadow: '0 0 60px hsl(190 100% 50% / 0.4), 0 0 120px hsl(270 100% 65% / 0.2)',
          }}
        >
          {/* Inner facets */}
          <div 
            className="absolute inset-[20%]"
            style={{
              background: 'linear-gradient(180deg, hsl(190 100% 70% / 0.5), transparent 50%, hsl(270 100% 70% / 0.3))',
              clipPath: 'polygon(50% 5%, 80% 30%, 95% 55%, 70% 95%, 30% 95%, 5% 55%, 20% 30%)',
            }}
          />
          
          {/* Bright core */}
          <div 
            className="absolute inset-[35%] rounded-full animate-pulse"
            style={{
              animationDuration: '2s',
              background: 'radial-gradient(circle, hsl(190 100% 80% / 0.9), hsl(270 100% 70% / 0.5) 50%, transparent)',
              filter: 'blur(3px)',
            }}
          />
        </div>

        {/* Orbiting ring 1 */}
        <div 
          className="absolute inset-[5%] animate-spin"
          style={{ animationDuration: '12s' }}
        >
          <div 
            className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 10%, hsl(190 100% 50% / 0.6) 30%, hsl(190 100% 50% / 0.8) 50%, hsl(190 100% 50% / 0.6) 70%, transparent 90%)',
              transform: 'translateY(-50%) rotateX(70deg)',
            }}
          />
        </div>

        {/* Orbiting ring 2 */}
        <div 
          className="absolute inset-[0%] animate-spin"
          style={{ animationDuration: '18s', animationDirection: 'reverse' }}
        >
          <div 
            className="absolute top-1/2 left-0 w-full h-[1.5px] -translate-y-1/2 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 5%, hsl(270 100% 65% / 0.5) 25%, hsl(270 100% 65% / 0.7) 50%, hsl(270 100% 65% / 0.5) 75%, transparent 95%)',
              transform: 'translateY(-50%) rotateX(60deg) rotateZ(30deg)',
            }}
          />
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              background: i % 2 === 0 ? 'hsl(190 100% 50%)' : 'hsl(270 100% 65%)',
              boxShadow: `0 0 10px ${i % 2 === 0 ? 'hsl(190 100% 50%)' : 'hsl(270 100% 65%)'}`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s',
            }}
          />
        ))}

        {/* Edge highlight */}
        <div 
          className="absolute inset-[14%]"
          style={{
            clipPath: 'polygon(50% 0%, 85% 25%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 15% 25%)',
            background: 'linear-gradient(135deg, hsl(190 100% 80% / 0.3) 0%, transparent 30%, transparent 70%, hsl(270 100% 80% / 0.2) 100%)',
          }}
        />
      </div>

      {/* Bottom reflection/shadow */}
      <div 
        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[20%] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsl(270 100% 65% / 0.2) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
};

export default FloatingCrystal;
