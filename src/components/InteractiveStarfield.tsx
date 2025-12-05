import { useEffect, useRef, useState } from "react";
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

const InteractiveStarfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const scrollYRef = useRef(0);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * 3,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;

    const starCount = Math.floor((dimensions.width * dimensions.height) / 8000);
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      isClickable: Math.random() > 0.85, // 15% of stars are clickable (brighter)
    }));
  }, [dimensions]);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const scrollOffset = scrollYRef.current * 0.3;

      starsRef.current.forEach((star, index) => {
        const parallaxY = (star.y - scrollOffset * star.speed) % dimensions.height;
        const adjustedY = parallaxY < 0 ? dimensions.height + parallaxY : parallaxY;

        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
        let currentOpacity = star.opacity * (0.5 + twinkle * 0.5);

        const isHovered = hoveredStar === index;
        const glowSize = star.isClickable ? (isHovered ? 8 : 5) : 3;
        const starSize = star.isClickable ? star.size * 1.5 : star.size;
        
        if (star.isClickable) {
          currentOpacity = Math.min(1, currentOpacity * 1.5);
        }
        if (isHovered) {
          currentOpacity = 1;
        }

        // Draw glow
        const gradient = ctx.createRadialGradient(
          star.x, adjustedY, 0,
          star.x, adjustedY, starSize * glowSize
        );
        
        if (star.isClickable) {
          gradient.addColorStop(0, `rgba(100, 220, 255, ${currentOpacity})`);
          gradient.addColorStop(0.3, `rgba(150, 180, 255, ${currentOpacity * 0.5})`);
          gradient.addColorStop(1, "rgba(100, 220, 255, 0)");
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
          gradient.addColorStop(0.5, `rgba(200, 220, 255, ${currentOpacity * 0.3})`);
          gradient.addColorStop(1, "rgba(200, 220, 255, 0)");
        }

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(star.x, adjustedY, starSize * glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.fillStyle = star.isClickable 
          ? `rgba(100, 220, 255, ${currentOpacity})` 
          : `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.arc(star.x, adjustedY, starSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw sparkle for clickable stars
        if (star.isClickable && isHovered) {
          ctx.strokeStyle = `rgba(100, 220, 255, ${currentOpacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(star.x - 12, adjustedY);
          ctx.lineTo(star.x + 12, adjustedY);
          ctx.moveTo(star.x, adjustedY - 12);
          ctx.lineTo(star.x, adjustedY + 12);
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, hoveredStar]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 z-[1]"
      style={{ 
        opacity: 0.9,
        cursor: hoveredStar !== null ? 'pointer' : 'default'
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    />
  );
};

export default InteractiveStarfield;