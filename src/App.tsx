import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import MobileBottomNav from "@/components/MobileBottomNav";
import ReadingResume from "@/components/ReadingResume";

// Lazy-loaded page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const About = lazy(() => import("./pages/About"));
const AuthorPage = lazy(() => import("./pages/AuthorPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Editorial = lazy(() => import("./pages/Editorial"));
const AllArticles = lazy(() => import("./pages/AllArticles"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const SeoDashboard = lazy(() => import("./pages/SeoDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Auto-detect dark mode on first visit
if (!localStorage.getItem("theme")) {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  }
}

// Minimal loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <a href="#main-content" className="skip-to-content">
          Kalo te përmbajtja
        </a>
        <ScrollToTop />
        <header>
          <Navbar />
        </header>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/artikull/:slug" element={<ArticlePage />} />
              <Route path="/kategori/:slug" element={<CategoryPage />} />
              <Route path="/artikuj" element={<AllArticles />} />
              <Route path="/rreth-nesh" element={<About />} />
              <Route path="/autore/:slug" element={<AuthorPage />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/privatesia" element={<Privacy />} />
              <Route path="/kushtet" element={<Terms />} />
              <Route path="/redaksia" element={<Editorial />} />
              <Route path="/ruajturat" element={<Bookmarks />} />
              <Route path="/seo-dashboard" element={<SeoDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <div className="pb-16 md:pb-0" /> {/* Space for mobile bottom nav */}
        <Footer />
        <ReadingResume />
        <MobileBottomNav />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
