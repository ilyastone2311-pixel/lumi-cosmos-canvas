import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 blur-md bg-primary/50 animate-glow-pulse rounded-full" />
          </div>
          <span className="font-display text-2xl font-bold tracking-wider text-foreground">
            Lumi
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Explore", "Library", "Premium"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium neon-underline"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button className="glass-strong px-5 py-2 rounded-full text-sm font-medium text-foreground hover:bg-white/15 transition-all duration-300 glow-cyan">
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
