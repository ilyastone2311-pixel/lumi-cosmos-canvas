import FloatingLines from "./FloatingLines";

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Lightweight, theme-aware backdrop (no particles) */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-cosmic)" }} />

      {/* Floating Lines (replaces stars/particles across the site) */}
      <div className="absolute inset-0">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[10, 14, 18]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          animationSpeed={1}
          opacity={0.9}
          mixBlendMode="screen"
        />
      </div>

      {/* Subtle vignette for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, hsl(var(--background) / 0.35) 100%)",
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
