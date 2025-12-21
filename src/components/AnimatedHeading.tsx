import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export interface AnimatedHeadingProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
  textAlign?: React.CSSProperties['textAlign'];
  onAnimationComplete?: () => void;
}

/**
 * AnimatedHeading - Premium split-letter animation for headings
 * 
 * Key behaviors:
 * - Text is invisible on initial render (no flash)
 * - Letters animate from bottom to top with smooth ease-out
 * - Subtle stagger creates reading flow
 * - Animation triggers on scroll into view (or immediately if above fold)
 */
const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  className = '',
  tag = 'h2',
  delay = 0,
  duration = 0.5,
  stagger = 0.025,
  threshold = 0.1,
  textAlign = 'left',
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [letters, setLetters] = useState<string[]>([]);
  const animatedRef = useRef(false);
  const initializedRef = useRef(false);

  // Split text into letters on mount
  useEffect(() => {
    if (!text) return;
    setLetters(text.split(''));
  }, [text]);

  useGSAP(() => {
    if (!containerRef.current || letters.length === 0 || animatedRef.current) return;

    const el = containerRef.current;
    const chars = el.querySelectorAll<HTMLElement>('.heading-char');
    if (chars.length === 0) return;

    // Set initial hidden state - letters start below and invisible
    gsap.set(chars, { 
      y: '100%', 
      opacity: 0,
      force3D: true 
    });
    initializedRef.current = true;

    let played = false;
    const play = () => {
      if (played || animatedRef.current) return;
      played = true;

      gsap.to(chars, {
        y: '0%',
        opacity: 1,
        duration,
        ease: 'power3.out',
        stagger,
        delay: delay / 1000,
        force3D: true,
        onComplete: () => {
          animatedRef.current = true;
          onAnimationComplete?.();
        },
      });
    };

    // Check if element is already in view (above the fold)
    const isInViewNow = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const triggerLine = vh * (1 - threshold);
      return rect.top <= triggerLine && rect.bottom >= 0;
    };

    // Create scroll trigger
    const st = ScrollTrigger.create({
      trigger: el,
      start: `top ${(1 - threshold) * 100}%`,
      once: true,
      onEnter: play,
    });

    // If already visible on mount, animate immediately
    if (isInViewNow()) {
      play();
      st.kill();
    } else {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    return () => {
      st.kill();
    };
  }, { dependencies: [letters, delay, duration, stagger, threshold], scope: containerRef });

  const renderLetters = () => {
    return letters.map((letter, index) => (
      <span
        key={index}
        className="inline-block overflow-hidden"
        style={{ 
          display: letter === ' ' ? 'inline-block' : 'inline-block',
          width: letter === ' ' ? '0.3em' : 'auto',
        }}
      >
        <span
          className="heading-char inline-block"
          style={{ 
            willChange: 'transform, opacity',
            transformOrigin: '50% 100%',
            // Start invisible - GSAP will set initial state
            opacity: initializedRef.current ? undefined : 0,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      </span>
    ));
  };

  const style: React.CSSProperties = {
    textAlign,
    overflow: 'visible',
    display: 'block',
  };

  const props = {
    ref: containerRef as React.RefObject<any>,
    style,
    className: `animated-heading ${className}`,
  };

  switch (tag) {
    case 'h1':
      return <h1 {...props}>{renderLetters()}</h1>;
    case 'h2':
      return <h2 {...props}>{renderLetters()}</h2>;
    case 'h3':
      return <h3 {...props}>{renderLetters()}</h3>;
    case 'h4':
      return <h4 {...props}>{renderLetters()}</h4>;
    case 'h5':
      return <h5 {...props}>{renderLetters()}</h5>;
    case 'h6':
      return <h6 {...props}>{renderLetters()}</h6>;
    case 'span':
      return <span {...props}>{renderLetters()}</span>;
    default:
      return <h2 {...props}>{renderLetters()}</h2>;
  }
};

export default AnimatedHeading;
