interface LumiLogoProps {
  className?: string;
}

const LumiLogo = ({ className = "" }: LumiLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Light Spark Icon - центральная точка + 3 расходящихся луча */}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        className="flex-shrink-0"
      >
        {/* Центральная точка */}
        <circle 
          cx="12" 
          cy="12" 
          r="3" 
          className="fill-primary"
        />
        
        {/* Луч 1 - вверх-влево */}
        <line 
          x1="10" 
          y1="10" 
          x2="3" 
          y2="3" 
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Луч 2 - вверх */}
        <line 
          x1="12" 
          y1="9" 
          x2="12" 
          y2="1" 
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Луч 3 - вправо-вверх */}
        <line 
          x1="14" 
          y1="10" 
          x2="21" 
          y2="3" 
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
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
