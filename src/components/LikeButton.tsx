import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useArticleLikes } from '@/hooks/useArticleLikes';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  articleId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LikeButton = ({ articleId, className, size = 'md' }: LikeButtonProps) => {
  const { user } = useAuth();
  const { isLiked, toggleLike } = useArticleLikes();
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const liked = isLiked(articleId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Войдите, чтобы добавить в избранное');
      return;
    }

    setIsAnimating(true);

    // Create particles on like
    if (!liked) {
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }

    await toggleLike(articleId);
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [user, liked, toggleLike, articleId]);

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'relative rounded-full transition-all duration-300',
        'hover:bg-primary/10 dark:hover:bg-primary/20',
        buttonSizeClasses[size],
        className
      )}
      whileTap={{ scale: 0.9 }}
    >
      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 1, 
              x: particle.x, 
              y: particle.y 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
              boxShadow: '0 0 8px hsl(var(--primary))'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Heart Icon */}
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Heart
          className={cn(
            sizeClasses[size],
            'transition-all duration-300',
            liked 
              ? 'fill-primary text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]' 
              : 'text-muted-foreground hover:text-primary'
          )}
        />
      </motion.div>

      {/* Glow ring on like */}
      <AnimatePresence>
        {isAnimating && liked && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-primary pointer-events-none"
            style={{ boxShadow: '0 0 20px hsl(var(--primary))' }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default LikeButton;
