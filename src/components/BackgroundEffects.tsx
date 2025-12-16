import FloatingLines from "./FloatingLines";

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Smooth gradient base that matches the site theme */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 80% 10%, hsl(var(--secondary) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            hsl(var(--background))
          `,
        }}
      />

      {/* Floating Lines - the main visual effect */}
      <div className="absolute inset-0 pointer-events-auto">
        <FloatingLines
          linesGradient={['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6']}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[12, 16, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          animationSpeed={1}
          opacity={1}
          mixBlendMode="screen"
        />
      </div>

      {/* Subtle top-bottom gradient overlay for depth and section blending */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(var(--background) / 0.3) 0%, 
              transparent 15%,
              transparent 85%,
              hsl(var(--background) / 0.3) 100%
            )
          `,
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
