import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-50px',
  textAlign = 'left',
  tag = 'p',
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [elements, setElements] = useState<string[]>([]);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!text) return;
    
    let splitElements: string[] = [];
    
    switch (splitType) {
      case 'chars':
        splitElements = text.split('');
        break;
      case 'words':
        splitElements = text.split(' ');
        break;
      case 'lines':
        splitElements = text.split('\n');
        break;
      default:
        splitElements = text.split('');
    }
    
    setElements(splitElements);
  }, [text, splitType]);

  useGSAP(() => {
    if (!containerRef.current || elements.length === 0 || animatedRef.current) return;

    const el = containerRef.current;
    const chars = el.querySelectorAll<HTMLElement>('.split-char');
    if (chars.length === 0) return;

    // Set initial state
    gsap.set(chars, { ...from, force3D: true });

    let played = false;
    const play = () => {
      if (played || animatedRef.current) return;
      played = true;

      gsap.to(chars, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true,
        onComplete: () => {
          animatedRef.current = true;
          onAnimationComplete?.();
        },
      });
    };

    const isInViewNow = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const triggerLine = vh * (1 - threshold);
      return rect.top <= triggerLine && rect.bottom >= 0;
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: `top ${(1 - threshold) * 100}%`,
      once: true,
      onEnter: play,
    });

    // If already visible on mount, animate immediately (fixes above-the-fold invisibility)
    if (isInViewNow()) {
      play();
      st.kill();
    } else {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    return () => {
      st.kill();
    };
  }, { dependencies: [elements, delay, duration, ease, from, to, threshold], scope: containerRef });

  const renderContent = () => {
    return elements.map((char, index) => (
      <span
        key={index}
        className="split-char inline-block"
        style={{ 
          whiteSpace: char === ' ' ? 'pre' : 'normal',
          willChange: 'transform, opacity',
          transformOrigin: '50% 80%'
        }}
      >
        {char === ' ' ? '\u00A0' : char}
        {splitType === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
      </span>
    ));
  };

  const style: React.CSSProperties = {
    textAlign,
    overflow: 'visible',
    display: 'block',
    paddingTop: '0.08em',
    paddingBottom: '0.18em',
  };

  const props = {
    ref: containerRef as any,
    style,
    className: `split-text-container ${className}`,
  };

  switch (tag) {
    case 'h1':
      return <h1 {...props}>{renderContent()}</h1>;
    case 'h2':
      return <h2 {...props}>{renderContent()}</h2>;
    case 'h3':
      return <h3 {...props}>{renderContent()}</h3>;
    case 'h4':
      return <h4 {...props}>{renderContent()}</h4>;
    case 'h5':
      return <h5 {...props}>{renderContent()}</h5>;
    case 'h6':
      return <h6 {...props}>{renderContent()}</h6>;
    case 'span':
      return <span {...props}>{renderContent()}</span>;
    default:
      return <p {...props}>{renderContent()}</p>;
  }
};

export default SplitText;
