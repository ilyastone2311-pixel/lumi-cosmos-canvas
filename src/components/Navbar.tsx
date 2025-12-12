import { useState, useEffect, useRef } from "react";
import { Sparkles, LogOut, User, Search, Settings, ChevronDown, Menu, X, Zap, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 w-full py-3 px-4"
    >
      <div 
        className="mx-auto max-w-5xl rounded-2xl animate-navbar-glow bg-card/80 backdrop-blur-xl border border-border/50"
        style={{
          boxShadow: `
            0 0 0 1px hsl(var(--primary) / 0.1),
            0 0 15px hsl(var(--primary) / 0.08),
            0 8px 32px hsl(var(--foreground) / 0.1)
          `,
        }}
      >
      <div className="relative px-4 sm:px-6 py-3 flex items-center justify-between">
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

        {/* Center Navigation - Desktop */}
        <div className="hidden md:flex items-center gap-1">
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

        {/* Mobile Search Button */}
        <motion.button
          onClick={() => setSearchOpen(true)}
          className="md:hidden p-2 rounded-full text-muted-foreground hover:text-foreground"
          whileTap={{ scale: 0.95 }}
        >
          <Search className="w-5 h-5" />
        </motion.button>

        {/* Theme Toggle, Auth & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-muted-foreground hover:text-foreground"
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>

          {/* Desktop Auth */}
          {!loading && (
            <div className="hidden md:flex items-center gap-1">
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
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border/30"
          >
            <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {/* Navigation Links - Large touch targets */}
              <button
                onClick={() => navigate("/")}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                  isActive("/")
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <span className="font-medium text-base">Home</span>
              </button>
              
              <button
                onClick={() => navigate("/library")}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                  isActive("/library")
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <span className="font-medium text-base">Library</span>
              </button>

              {/* Recommended - Mobile (only for logged in) */}
              {user && (
                <button
                  onClick={() => navigate("/recommended")}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                    isActive("/recommended")
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-medium text-base">For You</span>
                </button>
              )}

              {/* Divider */}
              <div className="h-px bg-border/30 my-2" />

              {/* User Section */}
              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Logged in</p>
                      </div>
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all active:scale-[0.98]"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium text-base">Profile</span>
                      </button>
                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all active:scale-[0.98]"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium text-base">Settings</span>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => navigate("/admin")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
                        >
                          <Shield className="w-4 h-4 text-amber-500" />
                          <span className="font-medium">Admin Panel</span>
                        </button>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate("/auth")}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-primary-foreground"
                      style={{
                        background: 'linear-gradient(135deg, hsl(190 100% 50%), hsl(270 80% 60%))',
                      }}
                    >
                      Sign Up / Log In
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </nav>
  );
};

export default Navbar;