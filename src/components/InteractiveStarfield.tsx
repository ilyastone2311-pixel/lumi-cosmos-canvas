import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
  isClickable: boolean;
}

const categories = ['politics', 'psychology', 'culture', 'technology', 'mindfulness', 'history', 'personal-growth', 'science', 'business'];

// Throttle function for scroll/mouse performance
const throttle = <T extends (...args: unknown[]) => void>(fn: T, wait: number) => {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn(...args);
    }
  };
};

const InteractiveStarfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const scrollYRef = useRef(0);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile for performance optimization
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const handleResize = throttle(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * 3,
      });
      setIsMobile(window.innerWidth < 768);
    }, 100);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;

    // Reduce star count on mobile for performance
    const baseCount = Math.floor((dimensions.width * dimensions.height) / 8000);
    const starCount = isMobile ? Math.floor(baseCount * 0.4) : baseCount;
    
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      isClickable: Math.random() > 0.85,
    }));
  }, [dimensions, isMobile]);

  // Throttled scroll handler
  useEffect(() => {
    const handleScroll = throttle(() => {
      scrollYRef.current = window.scrollY;
    }, 16); // ~60fps

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top + scrollYRef.current;
    const scrollOffset = scrollYRef.current * 0.3;

    for (let i = 0; i < starsRef.current.length; i++) {
      const star = starsRef.current[i];
      if (!star.isClickable) continue;

      const parallaxY = (star.y - scrollOffset * star.speed) % dimensions.height;
      const adjustedY = parallaxY < 0 ? dimensions.height + parallaxY : parallaxY;
      const screenY = adjustedY - scrollYRef.current;
      const distance = Math.sqrt((clickX - star.x) ** 2 + (clickY - scrollYRef.current - screenY) ** 2);
      
      if (distance < 20) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomArticle = Math.floor(Math.random() * 4) + 1;
        navigate(`/article/${randomCategory}/${randomArticle}`);
        return;
      }
    }
  }, [dimensions.height, navigate]);

  // Throttled mouse move for hover detection
  const handleMouseMove = useCallback(throttle((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const scrollOffset = scrollYRef.current * 0.3;

    let foundHovered = false;
    for (let i = 0; i < starsRef.current.length; i++) {
      const star = starsRef.current[i];
      if (!star.isClickable) continue;

      const parallaxY = (star.y - scrollOffset * star.speed) % dimensions.height;
      const adjustedY = parallaxY < 0 ? dimensions.height + parallaxY : parallaxY;
      const screenY = adjustedY - scrollYRef.current;
      const distance = Math.sqrt((mouseX - star.x) ** 2 + (mouseY - screenY) ** 2);
      
      if (distance < 20) {
        setHoveredStar(i);
        foundHovered = true;
        break;
      }
    }
    if (!foundHovered) setHoveredStar(null);
  }, 50), [dimensions.height]); // Throttle to 20fps for hover

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let time = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      // Frame rate limiting for performance
      const deltaTime = currentTime - lastFrameTime.current;
      if (deltaTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = currentTime - (deltaTime % frameInterval);

      time += 0.016;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const scrollOffset = scrollYRef.current * 0.3;

      starsRef.current.forEach((star, index) => {
        const parallaxY = (star.y - scrollOffset * star.speed) % dimensions.height;
        const adjustedY = parallaxY < 0 ? dimensions.height + parallaxY : parallaxY;

        // Simplified twinkle for performance
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
        let currentOpacity = star.opacity * (0.6 + twinkle * 0.4);

        const isHovered = hoveredStar === index;
        const glowSize = star.isClickable ? (isHovered ? 6 : 4) : 2;
        const starSize = star.isClickable ? star.size * 1.3 : star.size;
        
        if (star.isClickable) currentOpacity = Math.min(1, currentOpacity * 1.4);
        if (isHovered) currentOpacity = 1;

        // Simplified gradient - less stops for performance
        const gradient = ctx.createRadialGradient(
          star.x, adjustedY, 0,
          star.x, adjustedY, starSize * glowSize
        );
        
        if (star.isClickable) {
          gradient.addColorStop(0, `rgba(100, 220, 255, ${currentOpacity})`);
          gradient.addColorStop(1, "rgba(100, 220, 255, 0)");
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
          gradient.addColorStop(1, "rgba(200, 220, 255, 0)");
        }

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(star.x, adjustedY, starSize * glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core - simple fill
        ctx.beginPath();
        ctx.fillStyle = star.isClickable 
          ? `rgba(100, 220, 255, ${currentOpacity})` 
          : `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.arc(star.x, adjustedY, starSize, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle only on hover (reduced rendering)
        if (star.isClickable && isHovered) {
          ctx.strokeStyle = `rgba(100, 220, 255, ${currentOpacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x - 10, adjustedY);
          ctx.lineTo(star.x + 10, adjustedY);
          ctx.moveTo(star.x, adjustedY - 10);
          ctx.lineTo(star.x, adjustedY + 10);
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, hoveredStar, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 z-[1]"
      style={{ 
        opacity: 0.9,
        cursor: hoveredStar !== null ? 'pointer' : 'default',
        willChange: 'transform',
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    />
  );
};

export default InteractiveStarfield;