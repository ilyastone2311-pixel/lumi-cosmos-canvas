interface LumiLogoProps {
  className?: string;
}

const LumiLogo = ({ className = "" }: LumiLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Light Spark Icon - точка внизу + 3 луча вверх */}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        className="flex-shrink-0"
      >
        {/* Луч 1 - влево-вверх (диагональ) */}
        <line 
          x1="8" 
          y1="14" 
          x2="3" 
          y2="6" 
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Луч 2 - вверх (вертикальный, чуть правее) */}
        <line 
          x1="12" 
          y1="13" 
          x2="14" 
          y2="4" 
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Луч 3 - вправо (горизонтальный) */}
        <line 
          x1="13" 
          y1="16" 
          x2="21" 
          y2="12" 
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Точка внизу */}
        <circle 
          cx="8" 
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
