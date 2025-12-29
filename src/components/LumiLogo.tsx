interface LumiLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LumiLogo = ({ className = "", size = "md" }: LumiLogoProps) => {
  // Responsive sizing
  const sizeClasses = {
    sm: "h-6", // 24px - mobile
    md: "h-7 md:h-8", // 28px mobile, 32px desktop
    lg: "h-10",
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 120 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        preserveAspectRatio="xMinYMid meet"
        aria-label="Lumi logo"
      >
        <defs>
          {/* Vertical gradient for turquoise - lighter on top */}
          <linearGradient id="lumiGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6FE8F5" />
            <stop offset="100%" stopColor="#4FD3E6" />
          </linearGradient>
          
          {/* Subtle drop shadow filter */}
          <filter id="lumiShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#2BA8B8" floodOpacity="0.35" />
          </filter>
          
          {/* Highlight filter for 3D effect */}
          <filter id="lumiHighlight" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="-0.5" stdDeviation="0.3" floodColor="#FFFFFF" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Spark Icon Group - positioned to the left */}
        <g filter="url(#lumiShadow)">
          {/* Central dot */}
          <circle
            cx="12"
            cy="18"
            r="2.8"
            fill="url(#lumiGradient)"
          />
          
          {/* Ray 1 - Top-left diagonal (longest) */}
          <line
            x1="10"
            y1="16"
            x2="3"
            y2="6"
            stroke="url(#lumiGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          
          {/* Ray 2 - Left horizontal */}
          <line
            x1="9"
            y1="18"
            x2="1"
            y2="16"
            stroke="url(#lumiGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          
          {/* Ray 3 - Bottom-left diagonal */}
          <line
            x1="10"
            y1="20"
            x2="5"
            y2="27"
            stroke="url(#lumiGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>

        {/* Wordmark "Lumi" - with 3D emboss effect */}
        <g filter="url(#lumiShadow)">
          {/* Main text */}
          <text
            x="26"
            y="24"
            fontFamily="'Nunito', 'Manrope', 'Inter', system-ui, sans-serif"
            fontSize="24"
            fontWeight="700"
            fill="url(#lumiGradient)"
            letterSpacing="-0.5"
          >
            Lumi
          </text>
          
          {/* Highlight layer for 3D effect - offset slightly up */}
          <text
            x="26"
            y="23"
            fontFamily="'Nunito', 'Manrope', 'Inter', system-ui, sans-serif"
            fontSize="24"
            fontWeight="700"
            fill="white"
            fillOpacity="0.15"
            letterSpacing="-0.5"
          >
            Lumi
          </text>
        </g>
        
        {/* Dot above the "i" - enhanced */}
        <circle
          cx="107.5"
          cy="8"
          r="2"
          fill="url(#lumiGradient)"
          filter="url(#lumiShadow)"
        />
      </svg>
    </div>
  );
};

export default LumiLogo;
