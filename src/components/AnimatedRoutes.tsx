import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Library from "@/pages/Library";
import About from "@/pages/About";
import Experts from "@/pages/Experts";
import Downloads from "@/pages/Downloads";
import CategoryDetail from "@/pages/CategoryDetail";
import Article from "@/pages/Article";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <PageTransition>
              <Auth />
            </PageTransition>
          }
        />
        <Route
          path="/library"
          element={
            <PageTransition>
              <Library />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/experts"
          element={
            <PageTransition>
              <Experts />
            </PageTransition>
          }
        />
        <Route
          path="/downloads"
          element={
            <PageTransition>
              <Downloads />
            </PageTransition>
          }
        />
        <Route
          path="/category/:category"
          element={
            <PageTransition>
              <CategoryDetail />
            </PageTransition>
          }
        />
        <Route
          path="/article/:category/:articleId"
          element={
            <PageTransition>
              <Article />
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <Settings />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
