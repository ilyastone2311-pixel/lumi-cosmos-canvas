const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main cosmic gradient */}
      <div className="absolute inset-0 cosmic-bg" />

      {/* Orbiting ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
        <div className="absolute inset-0 border border-primary/10 rounded-full animate-spin" style={{ animationDuration: '60s' }} />
        <div className="absolute inset-8 border border-secondary/10 rounded-full animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />
        <div className="absolute inset-16 border border-accent/10 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent/5 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '4s' }} />

      {/* Geometric shapes */}
      <div className="absolute top-[15%] right-[20%] w-32 h-32 border border-primary/20 rotate-45 animate-float-slow" />
      <div className="absolute bottom-[25%] left-[8%] w-24 h-24 border border-secondary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[60%] right-[10%] w-16 h-16 bg-accent/10 rotate-12 animate-float-slow" style={{ animationDelay: '3s' }} />

      {/* Grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
