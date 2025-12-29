interface LumiLogoProps {
  className?: string;
}

const LumiLogo = ({ className = "" }: LumiLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Light Spark Icon - 3 parallel diagonal rays + dot */}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        className="flex-shrink-0"
      >
        {/* Ray 1 - Top left, longest */}
        <line 
          x1="2" 
          y1="10" 
          x2="10" 
          y2="2" 
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Ray 2 - Middle */}
        <line 
          x1="6" 
          y1="14" 
          x2="12" 
          y2="8" 
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Ray 3 - Shortest */}
        <line 
          x1="10" 
          y1="18" 
          x2="14" 
          y2="14" 
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Dot - Bottom right */}
        <circle 
          cx="18" 
          cy="20" 
          r="2.5" 
          className="fill-primary"
        />
      </svg>
      
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
