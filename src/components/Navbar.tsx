import { useState, useEffect, useRef } from "react";
import { Sparkles, LogOut, User, Search, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setDropdownOpen(false);
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-2xl animate-navbar-glow glass-panel"
      style={{
        boxShadow: `
          0 0 0 1px hsla(190, 100%, 50%, 0.1),
          0 0 15px hsla(190, 100%, 50%, 0.1),
          0 0 30px hsla(270, 100%, 60%, 0.05),
          0 8px 32px hsla(240, 35%, 6%, 0.4)
        `,
      }}
    >
      <div className="relative px-6 py-3 flex items-center justify-between">
        {/* Logo with glow */}
        <motion.div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-primary relative z-10 icon-glow" />
            <div 
              className="absolute inset-0 blur-lg rounded-full animate-pulse"
              style={{
                background: 'hsl(190 100% 50% / 0.6)',
                animationDuration: '2s',
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
        </motion.div>

        {/* Center Navigation */}
        <div className="flex items-center gap-1">
          <motion.button
            onClick={() => navigate("/")}
            className={`relative px-4 py-1.5 rounded-full font-display font-medium text-sm transition-all duration-300 ${
              isActive("/")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive("/") && (
              <motion.span 
                layoutId="navIndicator"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'hsla(190, 100%, 50%, 0.1)',
                  border: '1px solid hsla(190, 100%, 50%, 0.2)',
                }}
              />
            )}
            <span className="relative">Home</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate("/library")}
            className={`relative px-4 py-1.5 rounded-full font-display font-medium text-sm transition-all duration-300 ${
              isActive("/library")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive("/library") && (
              <motion.span 
                layoutId="navIndicator"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'hsla(190, 100%, 50%, 0.1)',
                  border: '1px solid hsla(190, 100%, 50%, 0.2)',
                }}
              />
            )}
            <span className="relative">Library</span>
          </motion.button>

          {/* Search Button */}
          <motion.button
            onClick={() => setSearchOpen(true)}
            className="relative px-3 py-1.5 rounded-full text-sm transition-all duration-300 text-muted-foreground hover:text-foreground flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline text-xs">Search</span>
            <kbd className="hidden md:inline-flex h-4 items-center rounded border border-border/30 bg-white/5 px-1 font-mono text-[9px] text-muted-foreground/70">
              ⌘K
            </kbd>
          </motion.button>
        </div>

        {/* Auth Buttons */}
        {!loading && (
          <div className="flex items-center gap-1">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Account Button */}
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: dropdownOpen 
                      ? 'hsla(190, 100%, 50%, 0.15)' 
                      : 'hsla(230, 50%, 15%, 0.5)',
                    border: `1px solid ${dropdownOpen ? 'hsla(190, 100%, 50%, 0.3)' : 'hsla(210, 40%, 98%, 0.08)'}`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden md:inline max-w-[100px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden shadow-hero"
                      style={{
                        background: 'hsl(230, 50%, 8%)',
                        border: '1px solid hsla(210, 40%, 98%, 0.1)',
                      }}
                    >
                      <div className="p-3 border-b border-border/20">
                        <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Logged in</p>
                      </div>
                      
                      <div className="p-1">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-white/5 transition-colors"
                        >
                          <User className="w-4 h-4 text-primary" />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            navigate("/settings");
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-white/5 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          Settings
                        </button>
                      </div>

                      <div className="p-1 border-t border-border/20">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={() => navigate("/auth")}
                className="relative px-4 py-1.5 rounded-full text-sm font-medium overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, hsl(190 100% 50%), hsl(270 80% 60%))',
                  boxShadow: '0 0 20px hsl(190 100% 50% / 0.3)',
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 30px hsl(190 100% 50% / 0.5), 0 0 60px hsl(270 80% 60% / 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shine effect */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </span>
                <span className="relative text-primary-foreground">Sign Up</span>
              </motion.button>
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