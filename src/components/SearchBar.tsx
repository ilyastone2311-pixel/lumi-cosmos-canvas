import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp } from "lucide-react";

// Sample articles data for search
const allArticles = [
  { id: "1", title: "The Art of Political Discourse", category: "politics", excerpt: "How conversations shape democracy" },
  { id: "2", title: "Understanding Global Elections", category: "politics", excerpt: "A deep dive into voting systems worldwide" },
  { id: "3", title: "Power Dynamics in Modern Governance", category: "politics", excerpt: "Who really makes the decisions?" },
  { id: "4", title: "The Science of Decision Making", category: "psychology", excerpt: "Why we choose what we choose" },
  { id: "5", title: "Emotional Intelligence at Work", category: "psychology", excerpt: "Navigate office dynamics with empathy" },
  { id: "6", title: "Breaking Bad Habits", category: "psychology", excerpt: "Rewire your brain for success" },
  { id: "7", title: "Street Art Revolution", category: "culture", excerpt: "From vandalism to museum walls" },
  { id: "8", title: "The Future of Music", category: "culture", excerpt: "How AI is changing composition" },
  { id: "9", title: "Food as Cultural Identity", category: "culture", excerpt: "Stories told through cuisine" },
  { id: "10", title: "AI in Everyday Life", category: "technology", excerpt: "The invisible algorithms around us" },
  { id: "11", title: "Quantum Computing Basics", category: "technology", excerpt: "Breaking down the complex" },
  { id: "12", title: "Privacy in the Digital Age", category: "technology", excerpt: "Protecting your digital footprint" },
  { id: "13", title: "5-Minute Meditation Guide", category: "mindfulness", excerpt: "Find peace in busy moments" },
  { id: "14", title: "The Power of Gratitude", category: "mindfulness", excerpt: "Transform your perspective daily" },
  { id: "15", title: "Mindful Eating Practices", category: "mindfulness", excerpt: "Nourish body and soul" },
  { id: "16", title: "Ancient Rome's Lessons", category: "history", excerpt: "What empires teach us today" },
  { id: "17", title: "The Silk Road Stories", category: "history", excerpt: "Trade routes that shaped cultures" },
  { id: "18", title: "Women Who Changed History", category: "history", excerpt: "Unsung heroes of the past" },
  { id: "19", title: "Morning Routines of Leaders", category: "personal-growth", excerpt: "Start your day with intention" },
  { id: "20", title: "Overcoming Imposter Syndrome", category: "personal-growth", excerpt: "You belong at the table" },
  { id: "21", title: "The 80/20 Life Principle", category: "personal-growth", excerpt: "Focus on what truly matters" },
  { id: "22", title: "Black Holes Explained", category: "science", excerpt: "The mysteries of deep space" },
  { id: "23", title: "The Microbiome Within", category: "science", excerpt: "Your body's hidden ecosystem" },
  { id: "24", title: "Climate Science Simplified", category: "science", excerpt: "Understanding our changing planet" },
  { id: "25", title: "Building a Side Hustle", category: "business", excerpt: "Turn passion into profit" },
  { id: "26", title: "Leadership Without Authority", category: "business", excerpt: "Influence at any level" },
  { id: "27", title: "The Art of Negotiation", category: "business", excerpt: "Win-win outcomes every time" },
];

const trendingSearches = ["mindfulness", "AI technology", "leadership", "history"];

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar = ({ isOpen, onClose }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof allArticles>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = allArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.category.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (article: typeof allArticles[0]) => {
    navigate(`/article/${article.category}/${article.id}`);
    onClose();
    setQuery("");
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl glass rounded-2xl border border-border/50 overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, categories, topics..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Results or Trending */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleSelect(article)}
                  className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-display font-bold text-sm uppercase">
                        {article.category.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {article.excerpt}
                      </p>
                      <span className="text-xs text-primary/70 capitalize mt-1 inline-block">
                        {article.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Trending searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <span>Press ESC to close</span>
          <span>{allArticles.length} articles available</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
