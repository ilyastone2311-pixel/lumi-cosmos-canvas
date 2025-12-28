import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackgroundEffects from "@/components/BackgroundEffects";
import AudioPlayer from "@/components/AudioPlayer";
import KaraokeText from "@/components/KaraokeText";
import LikeButton from "@/components/LikeButton";
import ReadCompletionTracker from "@/components/ReadCompletionTracker";
import { ArticlePageSkeleton } from "@/components/ui/skeleton-card";
import { useArticleViews } from "@/hooks/useArticleViews";
import { ArrowLeft, Clock, Star, Bookmark, Share2, ThumbsUp } from "lucide-react";

const articleContent = {
  intro: `In an era where information flows faster than ever before, understanding how to navigate the landscape of ideas becomes crucial. This article explores key insights that can transform your perspective and enhance your daily life.`,
  sections: [
    {
      title: "The Core Concept",
      content: `At its heart, this topic challenges our conventional understanding. Research shows that by shifting our mindset, we can unlock potential we never knew existed. The key lies in consistent practice and mindful application of these principles in everyday situations.`,
    },
    {
      title: "Practical Applications",
      content: `Here's where theory meets practice. Start by dedicating just 5 minutes each day to reflection. Over time, this small investment compounds into significant personal growth. Studies indicate that people who engage with ideas actively retain 70% more information than passive readers.`,
    },
    {
      title: "Key Takeaways",
      content: `Remember: progress, not perfection, is the goal. Embrace the journey of continuous learning, and you'll find that each small step leads to meaningful transformation. The most successful individuals share one common trait—they never stop being curious.`,
    },
  ],
};

const Article = () => {
  const { category, articleId } = useParams<{ category: string; articleId: string }>();
  const navigate = useNavigate();
  const { trackView } = useArticleViews();
  const [audioTime, setAudioTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekToTime, setSeekToTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const displayCategory = category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const fullArticleId = `${category}-${articleId}`;

  // Track view on mount and simulate content loading
  useEffect(() => {
    if (category && articleId) {
      trackView(articleId, category);
    }
    // Simulate content loading for skeleton demo
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [category, articleId, trackView]);

  const handleWordClick = (time: number) => {
    setSeekToTime(time);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <BackgroundEffects />
        <main className="relative z-10 pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
          <ArticlePageSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      <ReadCompletionTracker articleId={fullArticleId} />

      <main className="relative z-10 pt-20 sm:pt-32 pb-24 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 group btn-hover"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Article Header */}
          <header className="mb-8 sm:mb-12 animate-fade-in">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs sm:text-sm font-medium">
                {displayCategory}
              </span>
              <LikeButton articleId={fullArticleId} size="lg" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Discovering Insights That Transform Perspectives
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <span>By Dr. Sarah Chen</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                5 min read
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                4.8 rating
              </span>
            </div>
          </header>

          {/* Audio Player */}
          <AudioPlayer 
            duration="5:00" 
            articleId={fullArticleId}
            articleTitle="Discovering Insights That Transform Perspectives"
            onTimeUpdate={(time) => {
              setAudioTime(time);
              setIsPlaying(true);
            }}
          />

          {/* Mobile-optimized Action Bar - sticky for easy access */}
          <div className="sticky top-20 z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 bg-background/80 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none mb-6 sm:mb-12 border-b sm:border-b-0 border-border/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 sm:pb-6 sm:border-b sm:border-border/30">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl sm:rounded-full glass hover:bg-white/10 transition-all active:scale-95 text-sm font-medium">
                <Bookmark className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="sm:inline">Save</span>
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl sm:rounded-full glass hover:bg-white/10 transition-all active:scale-95 text-sm font-medium">
                <Share2 className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="sm:inline">Share</span>
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl sm:rounded-full glass hover:bg-white/10 transition-all active:scale-95 text-sm font-medium">
                <ThumbsUp className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="sm:inline">Like</span>
              </button>
            </div>
          </div>

          {/* Article Content with Karaoke Highlighting - Liquid Glass backdrop */}
          <article 
            className="relative prose prose-invert max-w-none prose-p:text-base prose-p:leading-relaxed sm:prose-p:text-lg prose-headings:scroll-mt-24 rounded-3xl p-6 sm:p-8 md:p-10"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--card) / 0.6), hsl(var(--card) / 0.4))',
              backdropFilter: 'blur(20px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
              border: '1px solid hsl(var(--border) / 0.3)',
              boxShadow: `
                0 0 0 1px hsl(var(--primary) / 0.05),
                0 4px 24px hsl(var(--foreground) / 0.08),
                inset 0 1px 0 hsl(255 100% 100% / 0.06)
              `,
            }}
          >
            {/* Subtle inner glow */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 60%)',
              }}
            />

            <div className="relative z-10 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <KaraokeText 
                text={articleContent.intro}
                currentTime={audioTime}
                isPlaying={isPlaying}
                onWordClick={handleWordClick}
              />
            </div>

            {articleContent.sections.map((section, index) => (
              <section 
                key={section.title} 
                className="relative z-10 mb-8 sm:mb-10 animate-fade-in" 
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                  {section.title}
                </h2>
                <KaraokeText 
                  text={section.content}
                  currentTime={audioTime - (index + 1) * 15}
                  isPlaying={isPlaying}
                  onWordClick={handleWordClick}
                />
              </section>
            ))}
          </article>

          {/* Read More CTA */}
          <div className="mt-12 sm:mt-16 glass gradient-border rounded-2xl p-6 sm:p-8 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
              Enjoyed this article?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Explore more insights in the {displayCategory} category
            </p>
            <button 
              onClick={() => navigate(`/category/${category}`)}
              className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-display font-semibold text-sm sm:text-base"
            >
              Browse More Articles
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Article;