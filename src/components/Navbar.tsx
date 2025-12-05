import { useState, useEffect } from "react";
import { Sparkles, LogOut, User, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle ESC key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 blur-md bg-primary/50 animate-glow-pulse rounded-full" />
          </div>
          <span className="font-display text-2xl font-bold tracking-wide text-foreground">
            Lumi
          </span>
        </div>

        {/* Center Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className={`relative px-5 py-2 rounded-full font-display font-semibold text-sm transition-all duration-300 btn-hover ${
              isActive("/")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive("/") && (
              <span className="absolute inset-0 bg-white/10 rounded-full border border-white/20" />
            )}
            <span className="relative">Home</span>
          </button>
          
          <button
            onClick={() => navigate("/library")}
            className={`relative px-5 py-2 rounded-full font-display font-semibold text-sm transition-all duration-300 btn-hover ${
              isActive("/library")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive("/library") && (
              <span className="absolute inset-0 bg-white/10 rounded-full border border-white/20" />
            )}
            <span className="relative">Library</span>
          </button>

          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative px-4 py-2 rounded-full font-display text-sm transition-all duration-300 text-muted-foreground hover:text-foreground btn-hover flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Auth Buttons */}
        {!loading && (
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="p-2 rounded-full hover:bg-white/10 transition-all btn-hover"
                  title="Profile"
                >
                  <User className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full hover:bg-white/10 transition-all btn-hover"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="relative px-5 py-2 rounded-full text-sm font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105 btn-hover"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full" />
                <span className="absolute inset-0 opacity-50 blur-md bg-gradient-to-r from-primary to-secondary rounded-full" />
                <span className="relative">Sign Up</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;