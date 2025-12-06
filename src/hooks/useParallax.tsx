import { useEffect, useState, useCallback } from "react";

export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setOffset(0);
      return;
    }

    setOffset(window.scrollY * speed);
  }, [speed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return offset;
};
