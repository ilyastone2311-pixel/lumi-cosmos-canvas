interface LumiLogoProps {
  className?: string;
}

const LumiLogo = ({ className = "" }: LumiLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Light Spark Icon - 3 parallel diagonal rays + dot */}
      <svg 
        width="22" 
        height="22" 
        viewBox="0 0 22 22" 
        fill="none" 
        className="flex-shrink-0"
      >
        {/* Ray 1 - Top left, longest */}
        <rect 
          x="1" 
          y="3" 
          width="4" 
          height="11" 
          rx="2" 
          transform="rotate(-45 1 3)"
          className="fill-primary"
        />
        
        {/* Ray 2 - Middle */}
        <rect 
          x="6" 
          y="8" 
          width="4" 
          height="9" 
          rx="2" 
          transform="rotate(-45 6 8)"
          className="fill-primary"
        />
        
        {/* Ray 3 - Shortest */}
        <rect 
          x="11" 
          y="13" 
          width="4" 
          height="7" 
          rx="2" 
          transform="rotate(-45 11 13)"
          className="fill-primary"
        />
        
        {/* Dot - Bottom right */}
        <circle 
          cx="18" 
          cy="18" 
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