import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Article } from "@/data/articles";

interface ArticlePreviewCardProps {
  article: Article;
  index?: number;
}

const ArticlePreviewCard = ({ article, index = 0 }: ArticlePreviewCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.category}/${article.id}`);
  };

  // Extended excerpt for preview
  const fullExcerpt = `${article.excerpt} Dive deep into this topic with our expertly curated insights. This article explores key concepts that will transform your understanding and provide actionable takeaways.`;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.2, 0.9, 0.2, 1]
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowPreview(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowPreview(false);
      }}
      onTouchStart={() => setShowPreview(true)}
      onTouchEnd={() => setTimeout(() => setShowPreview(false), 3000)}
    >
      {/* Main Card */}
      <motion.button
        onClick={handleClick}
        className="w-full text-left group relative rounded-xl overflow-hidden"
        style={{
          background: 'hsla(230, 50%, 8%, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid hsla(210, 40%, 98%, 0.06)',
          boxShadow: isHovered 
            ? '0 15px 40px hsla(var(--primary), 0.15), 0 0 0 1px hsla(var(--primary), 0.1)'
            : '0 4px 20px hsla(230, 50%, 5%, 0.3)',
          transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.2, 1)',
          transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Top edge glow */}
        <div 
          className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-400 ${isHovered ? 'opacity-100' : 'opacity-30'}`}
          style={{
            background: 'linear-gradient(90deg, transparent, hsla(var(--primary), 0.5), transparent)',
          }}
        />

        <div className="p-5">
          {/* Category badge */}
          <span 
            className="inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-3 capitalize"
            style={{
              background: 'hsla(var(--primary), 0.15)',
              color: 'hsl(var(--primary))',
              border: '1px solid hsla(var(--primary), 0.2)',
            }}
          >
            {article.category.replace('-', ' ')}
          </span>

          {/* Title */}
          <h3 
            className="font-display text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300"
            style={{
              textShadow: isHovered ? '0 0 20px hsla(var(--primary), 0.3)' : 'none',
            }}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {article.excerpt}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                {article.rating}
              </span>
            </div>
            
            {/* Arrow indicator */}
            <motion.div
              className="flex items-center gap-1 text-primary"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>
      </motion.button>

      {/* Floating Preview Window */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.2, 0.9, 0.2, 1]
            }}
            className="absolute left-0 right-0 top-full mt-2 z-50 pointer-events-none md:pointer-events-auto"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'hsla(230, 50%, 6%, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid hsla(var(--primary), 0.15)',
                boxShadow: `
                  0 0 0 1px hsla(var(--primary), 0.1),
                  0 20px 50px hsla(230, 50%, 3%, 0.8),
                  0 0 40px hsla(var(--primary), 0.1)
                `,
              }}
            >
              {/* Preview header glow */}
              <div 
                className="h-px w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsla(var(--primary), 0.6), hsla(var(--secondary), 0.6), transparent)',
                }}
              />

              <div className="p-5">
                {/* Author & reading time */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, hsla(var(--primary), 0.2), hsla(var(--secondary), 0.2))',
                        border: '1px solid hsla(var(--primary), 0.3)',
                      }}
                    >
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{article.author}</p>
                      <p className="text-xs text-muted-foreground">Expert Author</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime} read</span>
                  </div>
                </div>

                {/* Title */}
                <h4 
                  className="font-display text-lg font-bold text-foreground mb-3"
                  style={{
                    textShadow: '0 0 30px hsla(var(--primary), 0.2)',
                  }}
                >
                  {article.title}
                </h4>

                {/* Extended excerpt - 2 paragraphs */}
                <div className="space-y-2 mb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.excerpt}
                  </p>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">
                    Dive deep into this topic with our expertly curated insights. This article explores key concepts that will transform your understanding.
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.floor(article.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{article.rating} rating</span>
                </div>

                {/* Continue Reading Button */}
                <button
                  onClick={handleClick}
                  className="w-full group/btn relative py-3 px-5 rounded-xl font-display font-medium text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, hsla(var(--primary), 0.15), hsla(var(--secondary), 0.15))',
                    border: '1px solid hsla(var(--primary), 0.25)',
                    boxShadow: '0 0 20px hsla(var(--primary), 0.1)',
                  }}
                >
                  {/* Hover glow */}
                  <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
                  
                  <span className="relative flex items-center justify-center gap-2 text-foreground">
                    Continue Reading
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArticlePreviewCard;