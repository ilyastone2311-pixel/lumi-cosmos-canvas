import { useState, useEffect, useRef } from "react";
import { LogOut, User, Search, Settings, ChevronDown, Zap, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import logoImage from "@/assets/logo-navbar.webp";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Scroll-based shrinking for mobile header
  const { scrollY } = useScroll();
  const mobileHeaderScale = useTransform(scrollY, [0, 100], [1, 0.92]);
  const mobileHeaderOpacity = useTransform(scrollY, [0, 50], [1, 0.95]);
  const mobileLogoScale = useTransform(scrollY, [0, 100], [1.8, 1.5]);

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
      className="fixed top-0 left-0 right-0 z-50 w-full py-1.5 px-3 md:py-2 md:px-4"
    >
      {/* Mobile Header - Compact with scroll shrinking */}
      <motion.div 
        className="md:hidden mx-auto rounded-xl bg-card/95 backdrop-blur-xl border border-border/50"
        style={{
          scale: mobileHeaderScale,
          opacity: mobileHeaderOpacity,
          boxShadow: `
            0 0 0 1px hsl(var(--primary) / 0.1),
            0 0 12px hsl(var(--primary) / 0.06),
            0 4px 20px hsl(var(--foreground) / 0.08)
          `,
        }}
      >
        <div className="relative px-3 py-1.5 flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group cursor-pointer"
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="relative flex-shrink-0 overflow-hidden rounded-lg origin-center"
              style={{ scale: mobileLogoScale }}
            >
              <img 
                src={logoImage} 
                alt="Lumi" 
                className="h-8 w-auto object-contain relative z-10 block" 
              />
            </motion.div>
            <span className="font-display text-base font-bold tracking-wide text-foreground">
              Lumi
            </span>
          </motion.div>

          {/* Right side: Theme + Profile/Sign Up */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            
            {!loading && (
              user ? (
                <motion.button
                  onClick={() => navigate("/profile")}
                  className="p-2 rounded-full bg-gradient-to-br from-primary to-secondary"
                  whileTap={{ scale: 0.92 }}
                >
                  <User className="w-4 h-4 text-primary-foreground" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => navigate("/auth")}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-primary-foreground"
                  style={{
                    background: 'linear-gradient(135deg, hsl(190 100% 50%), hsl(270 80% 60%))',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* Desktop Header - Unchanged */}
      <div 
        className="hidden md:block mx-auto max-w-5xl rounded-2xl animate-navbar-glow bg-card/80 backdrop-blur-xl border border-border/50"
        style={{
          boxShadow: `
            0 0 0 1px hsl(var(--primary) / 0.1),
            0 0 15px hsl(var(--primary) / 0.08),
            0 8px 32px hsl(var(--foreground) / 0.1)
          `,
        }}
      >
      <div className="relative px-6 py-1.5 flex items-center justify-between">
        {/* Logo with glow */}
        <motion.div 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group cursor-pointer"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.23, 1, 0.32, 1],
            delay: 0.1 
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="relative flex-shrink-0 overflow-hidden rounded-xl origin-center scale-[2.0]"
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <img 
              src={logoImage} 
              alt="Lumi open book logo" 
              className="h-[52px] w-auto object-contain relative z-10 block" 
            />
            <div 
              className="absolute inset-0 rounded-xl opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, hsl(270 80% 60% / 0.18), hsl(190 100% 50% / 0.08))",
                filter: "blur(2px)",
              }}
            />
          </motion.div>
          <span 
            className="font-display text-2xl font-bold tracking-wide text-foreground"
            style={{
              textShadow: '0 0 12px hsl(270 80% 60% / 0.15)',
            }}
          >
            Lumi
          </span>
        </motion.div>

        {/* Center Navigation - Desktop */}
        <div className="flex items-center gap-1">
          <motion.button
            onClick={() => navigate("/")}
            className={`relative px-5 py-2 rounded-full font-display font-medium text-base transition-all duration-300 ${
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
            className={`relative px-5 py-2 rounded-full font-display font-medium text-base transition-all duration-300 ${
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

          {/* Recommended - Only for logged in users */}
          {user && (
            <motion.button
              onClick={() => navigate("/recommended")}
              className={`relative px-5 py-2 rounded-full font-display font-medium text-base transition-all duration-300 group ${
                isActive("/recommended")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive("/recommended") && (
                <motion.span 
                  layoutId="navIndicator"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'hsla(190, 100%, 50%, 0.1)',
                    border: '1px solid hsla(190, 100%, 50%, 0.2)',
                  }}
                />
              )}
              {/* Animated underline on hover */}
              <motion.span
                className="absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full"
                initial={{ width: 0, x: '-50%' }}
                whileHover={{ width: '60%' }}
                transition={{ duration: 0.3 }}
              />
              {/* Glow pulse on hover */}
              <motion.span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' }}
              />
              <span className="relative flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                For You
              </span>
            </motion.button>
          )}

          {/* Search Button - Desktop */}
          <motion.button
            onClick={() => setSearchOpen(true)}
            className="relative px-4 py-2 rounded-full text-base transition-all duration-300 text-muted-foreground hover:text-foreground flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search</span>
            <kbd className="hidden lg:inline-flex h-5 items-center rounded border border-border/30 bg-white/5 px-1.5 font-mono text-[10px] text-muted-foreground/70">
              ⌘K
            </kbd>
          </motion.button>
        </div>


        {/* Desktop Auth */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* User Account Button */}
                  <motion.button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 bg-muted/50 border border-border/50 hover:bg-muted"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
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
                        className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden shadow-hero bg-card border border-border"
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
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                          >
                            <User className="w-4 h-4 text-primary" />
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              navigate("/settings");
                              setDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Settings
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => {
                                navigate("/admin");
                                setDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                            >
                              <Shield className="w-4 h-4 text-amber-500" />
                              Admin Panel
                            </button>
                          )}
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
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </span>
                  <span className="relative text-primary-foreground">Sign Up</span>
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
      </div>

      {/* Search Modal */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;