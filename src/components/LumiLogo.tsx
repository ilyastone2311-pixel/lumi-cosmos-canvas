interface LumiLogoProps {
  className?: string;
}

const LumiLogo = ({ className = "" }: LumiLogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Light Spark Icon - 3 diagonal rays + dot */}
      <div className="relative flex-shrink-0" style={{ width: '24px', height: '24px' }}>
        {/* Ray 1 - Top left, longest */}
        <div 
          className="absolute bg-primary"
          style={{ 
            width: '4px',
            height: '12px',
            top: '-2px', 
            left: '3px', 
            transform: 'rotate(-45deg)',
            borderRadius: '2px'
          }}
        />
        
        {/* Ray 2 - Middle */}
        <div 
          className="absolute bg-primary"
          style={{ 
            width: '4px',
            height: '10px',
            top: '2px', 
            left: '9px', 
            transform: 'rotate(-45deg)',
            borderRadius: '2px'
          }}
        />
        
        {/* Ray 3 - Shortest */}
        <div 
          className="absolute bg-primary"
          style={{ 
            width: '4px',
            height: '8px',
            top: '6px', 
            left: '15px', 
            transform: 'rotate(-45deg)',
            borderRadius: '2px'
          }}
        />
        
        {/* Dot - Bottom right */}
        <div 
          className="absolute rounded-full bg-primary"
          style={{ 
            width: '5px',
            height: '5px',
            bottom: '0px', 
            right: '0px'
          }}
        />
      </div>
      
      {/* Lumi Text */}
      <span 
        className="font-bold text-primary"
        style={{ 
          fontFamily: "'Nunito', system-ui, sans-serif",
          fontSize: '24px',
          letterSpacing: '-0.01em',
          lineHeight: 1
        }}
      >
        Lumi
      </span>
    </div>
  );
};

export default LumiLogo;