import { useState, useRef } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  image: string;
  delay?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const CategoryCard = ({ 
  title, 
  subtitle, 
  image, 
  delay = 0, 
  isFavorite = false,
  onToggleFavorite 
}: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const handleCardClick = () => {
    const categorySlug = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
  };

  // Calculate 3D tilt based on mouse position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateY(-8px) 
      scale(1.02)
    `;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative cursor-pointer"
      style={{ 
        animationDelay: `${delay}ms`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1), box-shadow 0.4s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleCardClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated gradient border glow */}
      <div
        className={`
          absolute -inset-[2px] rounded-2xl transition-opacity duration-500
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)',
          filter: 'blur(8px)',
          animation: isHovered ? 'gradient-shift 3s ease infinite' : 'none',
        }}
      />
      
      {/* Outer glow layer - enhanced */}
      <div
        className={`
          absolute -inset-4 rounded-3xl transition-all duration-500
          ${isHovered ? "opacity-70" : "opacity-0"}
        `}
        style={{
          background: 'radial-gradient(ellipse at center, hsla(var(--primary), 0.35) 0%, transparent 70%)',
          filter: 'blur(25px)',
          transform: 'translateZ(-20px)',
        }}
      />

      {/* Card Container with gradient border - Glass Panel */}
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500 ease-out"
        style={{
          background: 'linear-gradient(135deg, hsla(var(--primary), 0.12) 0%, hsla(var(--secondary), 0.08) 50%, hsla(var(--accent), 0.12) 100%)',
          padding: '1px',
          boxShadow: isHovered 
            ? `
                0 8px 24px hsl(var(--foreground) / 0.15),
                0 20px 40px hsla(var(--primary), 0.15),
                0 0 50px hsla(var(--primary), 0.08)
              `
            : `
                0 4px 18px hsl(var(--foreground) / 0.1),
                0 4px 20px hsl(var(--foreground) / 0.08)
              `,
        }}
      >
        {/* Inner card - theme aware */}
        <div
          className="relative overflow-hidden rounded-2xl bg-card backdrop-blur-xl"
        >
          {/* Top edge glow line */}
          <div 
            className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-40'}`}
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsla(var(--primary), 0.6) 30%, hsla(var(--secondary), 0.6) 70%, transparent 100%)',
            }}
          />

          {/* Ambient glow overlay on hover */}
          <div
            className={`
              absolute inset-0 pointer-events-none transition-opacity duration-500
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
            style={{
              background: 'radial-gradient(ellipse at top, hsla(var(--primary), 0.1) 0%, transparent 60%)',
            }}
          />

          {/* Favorite Button - larger touch target on mobile */}
          <button
            onClick={handleFavoriteClick}
            className={`
              absolute top-3 right-3 sm:top-4 sm:right-4 z-20
              w-11 h-11 sm:w-10 sm:h-10 rounded-full
              flex items-center justify-center
              transition-all duration-300
              hover:scale-110 active:scale-95
              backdrop-blur-md bg-muted/60 border border-border
            `}
            style={{
              boxShadow: isFavorite 
                ? '0 0 20px hsla(var(--accent), 0.5), 0 0 40px hsla(var(--accent), 0.2)' 
                : '0 4px 15px hsl(var(--foreground) / 0.15)',
            }}
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
              style={{
                color: isFavorite ? 'hsl(var(--accent))' : 'hsl(var(--muted-foreground))',
                filter: isFavorite ? 'drop-shadow(0 0 8px hsla(var(--accent), 0.8))' : 'none',
              }}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>

          {/* Image Container */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className={`
                w-full h-full object-cover
                transition-all duration-700 ease-out
                ${isHovered ? "scale-110 brightness-110" : "scale-100 brightness-100"}
              `}
            />
            
            {/* Image overlay with gradient - theme aware */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"
            />
            
            {/* Subtle scan line effect */}
            <div 
              className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-30' : 'opacity-0'}`}
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(var(--primary), 0.03) 2px, hsla(var(--primary), 0.03) 4px)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative p-4 sm:p-6">
            <h3 
              className="font-display text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 tracking-wide transition-all duration-300 text-card-foreground"
              style={{
                color: isHovered ? 'hsl(var(--primary))' : undefined,
                textShadow: isHovered ? '0 0 20px hsla(var(--primary), 0.5), 0 0 40px hsla(var(--primary), 0.2)' : 'none',
              }}
            >
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {subtitle}
            </p>

            {/* Hover Arrow with glow */}
            <div
              className={`
                absolute right-4 bottom-4 sm:right-6 sm:bottom-6
                w-8 h-8 sm:w-9 sm:h-9 rounded-full
                flex items-center justify-center
                transition-all duration-300
                ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
              `}
              style={{
                background: 'linear-gradient(135deg, hsla(var(--primary), 0.2) 0%, hsla(var(--secondary), 0.2) 100%)',
                boxShadow: '0 0 20px hsla(var(--primary), 0.3), inset 0 0 10px hsla(var(--primary), 0.1)',
                border: '1px solid hsla(var(--primary), 0.3)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: 'drop-shadow(0 0 4px hsla(var(--primary), 0.8))',
                }}
              >
                <path
                  d="M3 8H13M13 8L8 3M13 8L8 13"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Bottom edge accent */}
            <div 
              className={`absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 h-px transition-opacity duration-500 ${isHovered ? 'opacity-60' : 'opacity-0'}`}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsla(var(--primary), 0.5) 50%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
