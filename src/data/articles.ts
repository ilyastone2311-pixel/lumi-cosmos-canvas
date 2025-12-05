// Centralized article data for the entire app
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  rating: number;
}

export const articles: Article[] = [
  // Politics
  { id: "1", title: "The Art of Political Discourse", excerpt: "How conversations shape democracy in the digital age", category: "politics", author: "Marcus Webb", readTime: "4 min", rating: 4.7 },
  { id: "2", title: "Understanding Global Elections", excerpt: "A deep dive into voting systems worldwide", category: "politics", author: "Dr. Sarah Chen", readTime: "6 min", rating: 4.8 },
  { id: "3", title: "Power Dynamics in Modern Governance", excerpt: "Who really makes the decisions that affect us all?", category: "politics", author: "James Torres", readTime: "5 min", rating: 4.5 },
  
  // Psychology
  { id: "4", title: "The Science of Decision Making", excerpt: "Why we choose what we choose—and how to choose better", category: "psychology", author: "Dr. Elena Rodriguez", readTime: "5 min", rating: 4.9 },
  { id: "5", title: "Emotional Intelligence at Work", excerpt: "Navigate office dynamics with empathy and insight", category: "psychology", author: "Michael Park", readTime: "4 min", rating: 4.6 },
  { id: "6", title: "Breaking Bad Habits", excerpt: "Rewire your brain for lasting positive change", category: "psychology", author: "Dr. Lisa Chang", readTime: "6 min", rating: 4.8 },
  
  // Culture
  { id: "7", title: "Street Art Revolution", excerpt: "From vandalism to museum walls—the evolution of urban art", category: "culture", author: "Sofia Mendez", readTime: "5 min", rating: 4.7 },
  { id: "8", title: "The Future of Music", excerpt: "How AI and technology are changing composition forever", category: "culture", author: "Alex Kim", readTime: "4 min", rating: 4.5 },
  { id: "9", title: "Food as Cultural Identity", excerpt: "Stories told through cuisine across generations", category: "culture", author: "Chef Maria Santos", readTime: "5 min", rating: 4.9 },
  
  // Technology
  { id: "10", title: "AI in Everyday Life", excerpt: "The invisible algorithms shaping your daily choices", category: "technology", author: "Dr. Raj Patel", readTime: "5 min", rating: 4.8 },
  { id: "11", title: "Quantum Computing Basics", excerpt: "Breaking down the complex into digestible insights", category: "technology", author: "Prof. Nina Volkov", readTime: "7 min", rating: 4.6 },
  { id: "12", title: "Privacy in the Digital Age", excerpt: "Protecting your footprint in a connected world", category: "technology", author: "Jordan Blake", readTime: "4 min", rating: 4.7 },
  
  // Mindfulness
  { id: "13", title: "5-Minute Meditation Guide", excerpt: "Find peace even in your busiest moments", category: "mindfulness", author: "Maya Sharma", readTime: "3 min", rating: 4.9 },
  { id: "14", title: "The Power of Gratitude", excerpt: "Transform your perspective with daily practice", category: "mindfulness", author: "Tom Richards", readTime: "4 min", rating: 4.8 },
  { id: "15", title: "Mindful Eating Practices", excerpt: "Nourish both body and soul with intention", category: "mindfulness", author: "Dr. Amy Foster", readTime: "5 min", rating: 4.7 },
  
  // History
  { id: "16", title: "Ancient Rome's Lessons", excerpt: "What empires teach us about leadership today", category: "history", author: "Prof. David Miller", readTime: "6 min", rating: 4.8 },
  { id: "17", title: "The Silk Road Stories", excerpt: "Trade routes that shaped cultures across continents", category: "history", author: "Dr. Lin Wei", readTime: "5 min", rating: 4.7 },
  { id: "18", title: "Women Who Changed History", excerpt: "Unsung heroes whose impact echoes today", category: "history", author: "Rebecca Stone", readTime: "5 min", rating: 4.9 },
  
  // Personal Growth
  { id: "19", title: "Morning Routines of Leaders", excerpt: "Start your day with intention and purpose", category: "personal-growth", author: "Chris Anderson", readTime: "4 min", rating: 4.6 },
  { id: "20", title: "Overcoming Imposter Syndrome", excerpt: "You belong at the table—here's why", category: "personal-growth", author: "Dr. Janet Lewis", readTime: "5 min", rating: 4.9 },
  { id: "21", title: "The 80/20 Life Principle", excerpt: "Focus on what truly matters for maximum impact", category: "personal-growth", author: "Tim Reynolds", readTime: "4 min", rating: 4.7 },
  
  // Science
  { id: "22", title: "Black Holes Explained", excerpt: "The mysteries of deep space made accessible", category: "science", author: "Dr. Neil Foster", readTime: "6 min", rating: 4.8 },
  { id: "23", title: "The Microbiome Within", excerpt: "Your body's hidden ecosystem and its power", category: "science", author: "Dr. Sarah Kim", readTime: "5 min", rating: 4.7 },
  { id: "24", title: "Climate Science Simplified", excerpt: "Understanding our changing planet", category: "science", author: "Prof. Emma Green", readTime: "5 min", rating: 4.6 },
  
  // Business
  { id: "25", title: "Building a Side Hustle", excerpt: "Turn your passion into sustainable profit", category: "business", author: "Mark Thompson", readTime: "5 min", rating: 4.7 },
  { id: "26", title: "Leadership Without Authority", excerpt: "Influence and inspire at any level", category: "business", author: "Julia Roberts", readTime: "4 min", rating: 4.8 },
  { id: "27", title: "The Art of Negotiation", excerpt: "Achieve win-win outcomes in any situation", category: "business", author: "Sam Wilson", readTime: "5 min", rating: 4.9 },
];

export const getRandomArticle = (): Article => {
  return articles[Math.floor(Math.random() * articles.length)];
};

export const getArticlesByCategory = (category: string): Article[] => {
  const normalizedCategory = category.toLowerCase().replace(" ", "-");
  return articles.filter((a) => a.category === normalizedCategory);
};

export const getArticleById = (id: string): Article | undefined => {
  return articles.find((a) => a.id === id);
};

export const searchArticles = (query: string): Article[] => {
  const lowerQuery = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.excerpt.toLowerCase().includes(lowerQuery) ||
      a.category.toLowerCase().includes(lowerQuery) ||
      a.author.toLowerCase().includes(lowerQuery)
  );
};
