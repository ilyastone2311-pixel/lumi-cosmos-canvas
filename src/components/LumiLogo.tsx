interface LumiLogoProps {
  className?: string;
}

const LumiLogo = ({ className = "" }: LumiLogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Light Spark Icon - Pure CSS */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Center circle */}
        <div className="absolute w-3 h-3 rounded-full bg-primary" />
        
        {/* Ray 1 - Top */}
        <div 
          className="absolute w-1 h-2.5 rounded-full bg-primary"
          style={{ top: '2px', left: '50%', transform: 'translateX(-50%)' }}
        />
        
        {/* Ray 2 - Bottom */}
        <div 
          className="absolute w-1 h-2.5 rounded-full bg-primary"
          style={{ bottom: '2px', left: '50%', transform: 'translateX(-50%)' }}
        />
        
        {/* Ray 3 - Right */}
        <div 
          className="absolute w-2.5 h-1 rounded-full bg-primary"
          style={{ right: '2px', top: '50%', transform: 'translateY(-50%)' }}
        />
        
        {/* Ray 4 - Left */}
        <div 
          className="absolute w-2.5 h-1 rounded-full bg-primary"
          style={{ left: '2px', top: '50%', transform: 'translateY(-50%)' }}
        />
        
        {/* Diagonal Ray - Top Right */}
        <div 
          className="absolute w-1 h-2 rounded-full bg-primary/70"
          style={{ top: '4px', right: '5px', transform: 'rotate(45deg)' }}
        />
        
        {/* Diagonal Ray - Top Left */}
        <div 
          className="absolute w-1 h-2 rounded-full bg-primary/70"
          style={{ top: '4px', left: '5px', transform: 'rotate(-45deg)' }}
        />
      </div>
      
      {/* Lumi Text */}
      <span className="font-display font-bold text-2xl tracking-tight text-primary">
        Lumi
      </span>
    </div>
  );
};

export default LumiLogo;
