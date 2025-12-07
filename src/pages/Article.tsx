import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import AudioPlayer from "@/components/AudioPlayer";
import KaraokeText from "@/components/KaraokeText";
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
  const [audioTime, setAudioTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekToTime, setSeekToTime] = useState<number | null>(null);

  const displayCategory = category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const fullArticleId = `${category}-${articleId}`;

  const handleWordClick = (time: number) => {
    setSeekToTime(time);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
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
          <header className="mb-12 animate-fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              {displayCategory}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Discovering Insights That Transform Perspectives
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span>By Dr. Sarah Chen</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                5 min read
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
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

          {/* Action Bar */}
          <div className="flex items-center gap-4 mb-12 pb-6 border-b border-border/30 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-all btn-hover">
              <Bookmark className="w-4 h-4" />
              <span className="text-sm">Save</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-all btn-hover">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-all btn-hover">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">Like</span>
            </button>
          </div>

          {/* Article Content with Karaoke Highlighting */}
          <article className="prose prose-invert max-w-none">
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
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
                className="mb-10 animate-fade-in" 
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
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
          <div className="mt-16 glass gradient-border rounded-2xl p-8 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">
              Enjoyed this article?
            </h3>
            <p className="text-muted-foreground mb-6">
              Explore more insights in the {displayCategory} category
            </p>
            <button 
              onClick={() => navigate(`/category/${category}`)}
              className="btn-primary px-8 py-3 rounded-full font-display font-semibold"
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