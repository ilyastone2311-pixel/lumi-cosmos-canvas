import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Heart,
  Trash2,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Shield,
  Settings as SettingsIcon,
  X,
} from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type SettingsTab = "account" | "security" | "favorites";

const Settings = () => {
  const { user, loading: authLoading, updateEmail, updatePassword, signOut } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [isLoading, setIsLoading] = useState(false);
  
  // Email change state
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleEmailChange = async () => {
    try {
      emailSchema.parse(newEmail);
      setEmailError("");
    } catch (e) {
      if (e instanceof z.ZodError) {
        setEmailError(e.errors[0].message);
        return;
      }
    }

    setIsLoading(true);
    const { error } = await updateEmail(newEmail);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email update requested",
        description: "Check your new email for a confirmation link.",
      });
      setNewEmail("");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      passwordSchema.parse(newPassword);
      setPasswordError("");
    } catch (e) {
      if (e instanceof z.ZodError) {
        setPasswordError(e.errors[0].message);
        return;
      }
    }

    setIsLoading(true);
    const { error } = await updatePassword(newPassword);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;

    setIsLoading(true);
    await signOut();
    toast({
      title: "Account deleted",
      description: "Your account has been deleted. We're sorry to see you go.",
    });
    navigate("/");
  };

  const tabs = [
    { id: "account" as SettingsTab, label: "Account", icon: User },
    { id: "security" as SettingsTab, label: "Security", icon: Shield },
    { id: "favorites" as SettingsTab, label: "Favorites", icon: Heart },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Profile
            </button>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-primary" />
              Settings
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-[240px_1fr] gap-6">
            {/* Sidebar Tabs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-xl p-4 h-fit"
            >
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-xl p-6"
            >
              <AnimatePresence mode="wait">
                {activeTab === "account" && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Account Information
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Current Email</p>
                          <p className="text-foreground font-medium">{user.email}</p>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                          <p className="text-foreground font-medium">
                            {new Date(user.created_at || Date.now()).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-6">
                      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Change Email
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="New email address"
                          className="w-full bg-muted/50 border border-border rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        {emailError && (
                          <p className="text-destructive text-sm">{emailError}</p>
                        )}
                        <button
                          onClick={handleEmailChange}
                          disabled={!newEmail || isLoading}
                          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          Update Email
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        Change Password
                      </h2>
                      
                      <div className="space-y-3">
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="w-full bg-muted/50 border border-border rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full bg-muted/50 border border-border rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        {passwordError && (
                          <p className="text-destructive text-sm">{passwordError}</p>
                        )}
                        <button
                          onClick={handlePasswordChange}
                          disabled={!newPassword || !confirmPassword || isLoading}
                          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-6">
                      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2 text-destructive">
                        <Trash2 className="w-4 h-4" />
                        Danger Zone
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-2.5 rounded-lg border border-destructive text-destructive font-medium hover:bg-destructive/10 transition-all"
                      >
                        Delete Account
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "favorites" && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Saved Categories ({favorites.length})
                    </h2>

                    {favorites.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No favorites yet</p>
                        <button
                          onClick={() => navigate("/library")}
                          className="mt-4 text-primary hover:text-primary/80 transition-colors"
                        >
                          Browse categories
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {favorites.map((category) => (
                          <div
                            key={category}
                            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg group"
                          >
                            <button
                              onClick={() => navigate(`/category/${category.toLowerCase().replace(" ", "-")}`)}
                              className="font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {category}
                            </button>
                            <button
                              onClick={() => toggleFavorite(category)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                              title="Remove from favorites"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel rounded-2xl p-6 max-w-md w-full shadow-hero"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-semibold text-destructive mb-2">
                Delete Account
              </h3>
              <p className="text-muted-foreground mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <p className="text-foreground text-sm mb-4">
                Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-muted/50 border border-destructive/30 rounded-lg py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive transition-all mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== "DELETE" || isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
