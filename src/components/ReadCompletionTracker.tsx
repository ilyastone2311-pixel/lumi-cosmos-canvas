import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useArticleReads } from '@/hooks/useArticleReads';
import { useAuth } from '@/hooks/useAuth';

interface ReadCompletionTrackerProps {
  articleId: string;
  onComplete?: () => void;
}

const ReadCompletionTracker = ({ articleId, onComplete }: ReadCompletionTrackerProps) => {
  const { user } = useAuth();
  const { markAsRead, isRead } = useArticleReads();
  const [showAnimation, setShowAnimation] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const hasTriggered = useRef(false);
  const alreadyRead = isRead(articleId);

  const handleComplete = useCallback(async () => {
    if (hasTriggered.current || !user || alreadyRead) return;
    hasTriggered.current = true;

    await markAsRead(articleId);
    setShowAnimation(true);

    // Create dissolving particles
    setTimeout(() => {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100
      }));
      setParticles(newParticles);
    }, 800);

    setTimeout(() => {
      setShowAnimation(false);
      setParticles([]);
      onComplete?.();
    }, 2000);
  }, [user, alreadyRead, markAsRead, articleId, onComplete]);

  useEffect(() => {
    if (!user || alreadyRead) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      // Check if scrolled to 90% of the page
      if (scrollTop + clientHeight >= scrollHeight * 0.9) {
        handleComplete();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, alreadyRead, handleComplete]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          {/* Glowing sweep line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-64 h-1 -top-8 left-1/2 -translate-x-1/2 origin-left rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
              boxShadow: '0 0 20px hsl(var(--primary))'
            }}
          />

          {/* Checkmark */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative flex items-center justify-center w-20 h-20 rounded-full"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2))',
              boxShadow: '0 0 40px hsl(var(--primary) / 0.5)'
            }}
          >
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: 2, repeatType: 'loop' }}
              className="absolute inset-0 rounded-full border-2 border-primary"
            />
            
            <Check className="w-10 h-10 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]" />

            {/* Particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 0, 
                  x: particle.x, 
                  y: particle.y 
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute w-2 h-2 rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
                  boxShadow: '0 0 6px hsl(var(--primary))'
                }}
              />
            ))}
          </motion.div>

          {/* Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4 text-sm font-medium text-primary"
            style={{ textShadow: '0 0 10px hsl(var(--primary))' }}
          >
            Статья прочитана!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReadCompletionTracker;
