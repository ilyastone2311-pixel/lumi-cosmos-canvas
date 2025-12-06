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
    <nav 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-2xl animate-navbar-glow"
      style={{
        background: 'hsla(230, 50%, 8%, 0.6)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid hsla(210, 40%, 98%, 0.08)',
      }}
    >
      {/* Animated glow border overlay */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none animate-border-glow"
        style={{
          background: 'transparent',
          boxShadow: `
            0 0 0 1px hsla(190, 100%, 50%, 0.1),
            0 0 15px hsla(190, 100%, 50%, 0.1),
            0 0 30px hsla(270, 100%, 60%, 0.05)
          `,
        }}
      />
      
      <div className="relative px-6 py-3 flex items-center justify-between">
        {/* Logo with glow */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-primary relative z-10" />
            <div 
              className="absolute inset-0 blur-lg rounded-full animate-pulse"
              style={{
                background: 'hsl(190 100% 50% / 0.6)',
                animationDuration: '2s',
              }}
            />
            <div 
              className="absolute -inset-1 blur-md rounded-full"
              style={{
                background: 'hsl(190 100% 50% / 0.3)',
              }}
            />
          </div>
          <span 
            className="font-display text-xl font-bold tracking-wide text-foreground"
            style={{
              textShadow: '0 0 20px hsl(190 100% 50% / 0.3)',
            }}
          >
            Lumi
          </span>
        </div>

        {/* Center Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/")}
            className={`relative px-4 py-1.5 rounded-full font-display font-medium text-sm transition-all duration-300 ${
              isActive("/")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive("/") && (
              <span 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'hsla(190, 100%, 50%, 0.1)',
                  border: '1px solid hsla(190, 100%, 50%, 0.2)',
                }}
              />
            )}
            <span className="relative">Home</span>
          </button>
          
          <button
            onClick={() => navigate("/library")}
            className={`relative px-4 py-1.5 rounded-full font-display font-medium text-sm transition-all duration-300 ${
              isActive("/library")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive("/library") && (
              <span 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'hsla(190, 100%, 50%, 0.1)',
                  border: '1px solid hsla(190, 100%, 50%, 0.2)',
                }}
              />
            )}
            <span className="relative">Library</span>
          </button>

          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative px-3 py-1.5 rounded-full text-sm transition-all duration-300 text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline text-xs">Search</span>
            <kbd className="hidden md:inline-flex h-4 items-center rounded border border-border/30 bg-white/5 px-1 font-mono text-[9px] text-muted-foreground/70">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Auth Buttons */}
        {!loading && (
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="p-2 rounded-full hover:bg-white/10 transition-all"
                  title="Profile"
                >
                  <User className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full hover:bg-white/10 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="relative px-4 py-1.5 rounded-full text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, hsl(190 100% 50%), hsl(270 80% 60%))',
                  boxShadow: '0 0 20px hsl(190 100% 50% / 0.3)',
                }}
              >
                <span className="relative text-primary-foreground">Sign Up</span>
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