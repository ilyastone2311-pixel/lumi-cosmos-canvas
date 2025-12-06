import { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const handleCardClick = () => {
    const categorySlug = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div
      className="group relative cursor-pointer"
      style={{ 
        animationDelay: `${delay}ms`,
        perspective: '1000px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Multi-layer floating shadow */}
      <div
        className={`
          absolute -inset-2 -z-20 rounded-3xl
          transition-all duration-700
          ${isHovered ? "opacity-80" : "opacity-0"}
        `}
        style={{
          background: 'radial-gradient(ellipse at center bottom, hsla(190, 100%, 50%, 0.2) 0%, transparent 60%)',
          filter: 'blur(30px)',
          transform: isHovered ? 'translateY(15px) scale(0.95)' : 'translateY(5px) scale(0.9)',
        }}
      />
      
      {/* Secondary shadow layer */}
      <div
        className={`
          absolute -inset-1 -z-10 rounded-2xl
          transition-all duration-500
          ${isHovered ? "opacity-60" : "opacity-0"}
        `}
        style={{
          background: 'linear-gradient(135deg, hsla(190, 100%, 50%, 0.15) 0%, hsla(270, 100%, 60%, 0.15) 100%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Card Container */}
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500 ease-out"
        style={{
          background: 'hsla(230, 50%, 8%, 0.6)',
          backdropFilter: 'blur(15px)',
          border: '1px solid hsla(210, 40%, 98%, 0.08)',
          boxShadow: isHovered 
            ? `
                0 0 0 1px hsla(190, 100%, 50%, 0.1),
                0 4px 20px hsla(190, 100%, 50%, 0.1),
                0 8px 40px hsla(270, 100%, 60%, 0.08),
                0 20px 50px hsla(230, 50%, 5%, 0.5),
                inset 0 1px 0 hsla(210, 40%, 98%, 0.06)
              `
            : `
                0 4px 15px hsla(230, 50%, 5%, 0.3),
                0 8px 30px hsla(230, 50%, 5%, 0.2),
                inset 0 1px 0 hsla(210, 40%, 98%, 0.04)
              `,
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        }}
      >
        {/* Top edge glow */}
        <div 
          className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Glow Effect */}
        <div
          className={`
            absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none
            bg-gradient-to-br from-primary/15 via-transparent to-secondary/15
            ${isHovered ? "opacity-100" : ""}
          `}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute top-4 right-4 z-20
            w-10 h-10 rounded-full
            flex items-center justify-center
            transition-all duration-300
            hover:scale-110 active:scale-95
            ${isFavorite 
              ? "bg-accent/30 text-accent" 
              : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white"
            }
            backdrop-blur-md
          `}
          style={{
            boxShadow: isFavorite 
              ? '0 0 20px hsla(320, 80%, 60%, 0.4)' 
              : '0 4px 15px hsla(230, 50%, 5%, 0.4)',
          }}
        >
          <Heart 
            className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`} 
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className={`
              w-full h-full object-cover
              transition-transform duration-700 ease-out
              ${isHovered ? "scale-110" : "scale-100"}
            `}
          />
          {/* Overlay Gradient - enhanced */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, hsla(230, 50%, 8%, 1) 0%, hsla(230, 50%, 8%, 0.7) 30%, hsla(230, 50%, 8%, 0.2) 60%, transparent 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative p-6">
          <h3 
            className="font-display text-lg font-semibold text-foreground mb-2 tracking-wide group-hover:text-primary transition-colors"
            style={{
              textShadow: isHovered ? '0 0 20px hsla(190, 100%, 50%, 0.3)' : 'none',
            }}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {subtitle}
          </p>

          {/* Hover Arrow */}
          <div
            className={`
              absolute right-6 bottom-6
              w-9 h-9 rounded-full
              flex items-center justify-center
              transition-all duration-300
              ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
            style={{
              background: 'hsla(190, 100%, 50%, 0.15)',
              boxShadow: '0 0 15px hsla(190, 100%, 50%, 0.2)',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8H13M13 8L8 3M13 8L8 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;