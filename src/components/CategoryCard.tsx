import { useState } from "react";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  image: string;
  delay?: number;
}

const CategoryCard = ({ title, subtitle, image, delay = 0 }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div
        className={`
          relative overflow-hidden rounded-2xl
          glass gradient-border
          transition-all duration-500 ease-out
          ${isHovered ? "scale-[1.02] -translate-y-2" : ""}
        `}
      >
        {/* Glow Effect */}
        <div
          className={`
            absolute inset-0 opacity-0 transition-opacity duration-500
            bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20
            ${isHovered ? "opacity-100" : ""}
          `}
        />

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
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative p-5">
          <h3 className="font-display text-lg font-semibold text-foreground mb-1 tracking-wide">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {subtitle}
          </p>

          {/* Hover Arrow */}
          <div
            className={`
              absolute right-5 bottom-5
              w-8 h-8 rounded-full
              flex items-center justify-center
              bg-primary/20 text-primary
              transition-all duration-300
              ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
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
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Shadow */}
      <div
        className={`
          absolute -inset-1 -z-10 rounded-2xl
          bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30
          blur-xl opacity-0 transition-opacity duration-500
          ${isHovered ? "opacity-50" : ""}
        `}
      />
    </div>
  );
};

export default CategoryCard;
