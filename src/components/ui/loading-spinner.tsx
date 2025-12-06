import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "dots" | "orbit" | "pulse";
}

const LoadingSpinner = ({ 
  size = "md", 
  className,
  variant = "dots" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-4 h-4",
  };

  if (variant === "dots") {
    return (
      <div 
        className={cn("flex items-center justify-center gap-1", className)}
        role="status"
        aria-label="Loading"
      >
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              "rounded-full bg-gradient-to-r from-primary to-secondary animate-loader-bounce",
              dotSizes[size]
            )}
            style={{ 
              animationDelay: `${index * 0.16}s`,
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "orbit") {
    return (
      <div 
        className={cn("relative", sizeClasses[size], className)}
        role="status"
        aria-label="Loading"
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        
        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-loader-orbit">
          <div 
            className={cn(
              "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-secondary",
              size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
            )}
            style={{
              boxShadow: "0 0 10px hsl(190 100% 50% / 0.5), 0 0 20px hsl(270 100% 65% / 0.3)",
            }}
          />
        </div>
        
        {/* Center glow */}
        <div 
          className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"
          style={{ animationDuration: "1.5s" }}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Pulse variant
  return (
    <div 
      className={cn("relative flex items-center justify-center", sizeClasses[size], className)}
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
      <div 
        className={cn(
          "rounded-full bg-gradient-to-r from-primary to-secondary",
          size === "sm" ? "w-3 h-3" : size === "md" ? "w-5 h-5" : "w-8 h-8"
        )}
        style={{
          boxShadow: "0 0 15px hsl(190 100% 50% / 0.4)",
        }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export { LoadingSpinner };
