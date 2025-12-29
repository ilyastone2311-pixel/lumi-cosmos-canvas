interface LumiLogoProps {
  className?: string;
}

const LumiLogo = ({ className = "" }: LumiLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Light Spark Icon - 3 diagonal rays + dot matching the reference */}
      <div className="relative w-6 h-7 flex-shrink-0">
        {/* Ray 1 - Top left, longest */}
        <div 
          className="absolute rounded-full bg-primary"
          style={{ 
            width: '5px',
            height: '14px',
            top: '0px', 
            left: '0px', 
            transform: 'rotate(-45deg)',
            transformOrigin: 'center center',
            borderRadius: '3px'
          }}
        />
        
        {/* Ray 2 - Middle */}
        <div 
          className="absolute rounded-full bg-primary"
          style={{ 
            width: '5px',
            height: '12px',
            top: '5px', 
            left: '7px', 
            transform: 'rotate(-45deg)',
            transformOrigin: 'center center',
            borderRadius: '3px'
          }}
        />
        
        {/* Ray 3 - Shortest, bottom */}
        <div 
          className="absolute rounded-full bg-primary"
          style={{ 
            width: '5px',
            height: '10px',
            top: '10px', 
            left: '14px', 
            transform: 'rotate(-45deg)',
            transformOrigin: 'center center',
            borderRadius: '3px'
          }}
        />
        
        {/* Dot - Bottom right */}
        <div 
          className="absolute rounded-full bg-primary"
          style={{ 
            width: '6px',
            height: '6px',
            bottom: '0px', 
            right: '-2px'
          }}
        />
      </div>
      
      {/* Lumi Text - Rounded friendly font like in reference */}
      <span 
        className="font-bold text-primary"
        style={{ 
          fontFamily: "'Nunito', system-ui, sans-serif",
          fontSize: '26px',
          letterSpacing: '-0.02em',
          lineHeight: 1
        }}
      >
        Lumi
      </span>
    </div>
  );
};

export default LumiLogo;
