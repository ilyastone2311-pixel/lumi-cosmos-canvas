import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export interface AnimatedHeadingProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  /**
   * Override display when rendering `tag="span"` inside other headings.
   * Example: `display="block"` to force a new line.
   */
  display?: React.CSSProperties['display'];
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
  textAlign?: React.CSSProperties['textAlign'];
  onAnimationComplete?: () => void;
}

interface WordData {
  word: string;
  letters: string[];
  startIndex: number;
}

/**
 * AnimatedHeading - Premium split-letter animation for headings
 * 
 * Key behaviors:
 * - Text is invisible on initial render (no flash)
 * - Letters animate from bottom to top with smooth ease-out
 * - Words stay together to prevent awkward line breaks
 * - Full glyph metrics preserved (no descender clipping)
 * - Animation triggers on scroll into view (or immediately if above fold)
 */
const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  className = '',
  tag = 'h2',
  display: displayProp,
  delay = 0,
  duration = 0.5,
  stagger = 0.025,
  threshold = 0.1,
  textAlign = 'left',
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [words, setWords] = useState<WordData[]>([]);
  const animatedRef = useRef(false);
  const initializedRef = useRef(false);

  // Split text into words, then letters - preserves word grouping for natural line breaks
  useEffect(() => {
    if (!text) return;
    
    const wordStrings = text.split(' ');
    let charIndex = 0;
    
    const wordData: WordData[] = wordStrings.map((word) => {
      const startIndex = charIndex;
      const letters = word.split('');
      charIndex += letters.length + 1; // +1 for space
      return { word, letters, startIndex };
    });
    
    setWords(wordData);
  }, [text]);

  useGSAP(() => {
    if (!containerRef.current || words.length === 0 || animatedRef.current) return;

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
  }, { dependencies: [words, delay, duration, stagger, threshold], scope: containerRef });

  const isGradientText = className.split(/\s+/).includes("animated-gradient-text");
  
  // Calculate total character count for gradient positioning
  const totalChars = words.reduce((sum, w) => sum + w.letters.length, 0);

  const renderWords = () => {
    return words.map((wordData, wordIndex) => (
      <span
        key={wordIndex}
        className="inline-block whitespace-nowrap"
        style={{
          // Add space after each word except the last
          marginRight: wordIndex < words.length - 1 ? '0.3em' : 0,
        }}
      >
        {wordData.letters.map((letter, letterIndex) => {
          const globalIndex = wordData.startIndex + letterIndex;
          const charPct = totalChars <= 1 ? 0 : (globalIndex / (totalChars - 1)) * 100;

          return (
            <span
              key={letterIndex}
              className="inline-block"
              style={{
                // Use clip-path instead of overflow:hidden to preserve descenders
                // No height constraint - let font metrics determine size
                verticalAlign: 'baseline',
                lineHeight: 'inherit',
              }}
            >
              <span
                className="heading-char inline-block"
                style={{
                  willChange: 'transform, opacity',
                  transformOrigin: '50% 100%',
                  // Start invisible - GSAP will set initial state
                  opacity: initializedRef.current ? undefined : 0,
                  // Generous padding to prevent any clipping during animation
                  paddingTop: '0.15em',
                  paddingBottom: '0.25em',
                  marginTop: '-0.15em',
                  marginBottom: '-0.25em',
                  ...(isGradientText ? ({ '--char': charPct } as React.CSSProperties) : null),
                }}
              >
                {letter}
              </span>
            </span>
          );
        })}
      </span>
    ));
  };

  const style: React.CSSProperties = {
    textAlign,
    overflow: 'visible',
    display: displayProp ?? (tag === 'span' ? 'inline-block' : 'block'),
    // Generous line-height to accommodate descenders and animation
    lineHeight: 1.35,
  };

  const props = {
    ref: containerRef as React.RefObject<any>,
    style,
    className: `animated-heading ${className}`,
  };

  switch (tag) {
    case 'h1':
      return <h1 {...props}>{renderWords()}</h1>;
    case 'h2':
      return <h2 {...props}>{renderWords()}</h2>;
    case 'h3':
      return <h3 {...props}>{renderWords()}</h3>;
    case 'h4':
      return <h4 {...props}>{renderWords()}</h4>;
    case 'h5':
      return <h5 {...props}>{renderWords()}</h5>;
    case 'h6':
      return <h6 {...props}>{renderWords()}</h6>;
    case 'span':
      return <span {...props}>{renderWords()}</span>;
    default:
      return <h2 {...props}>{renderWords()}</h2>;
  }
};

export default AnimatedHeading;
