import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyNewsletter from "@/components/StickyNewsletter";
import Index from "./pages/Index";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";
import AuthorPage from "./pages/AuthorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <a href="#main-content" className="skip-to-content">
          Kalo te përmbajtja
        </a>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/artikull/:slug" element={<ArticlePage />} />
          <Route path="/kategori/:slug" element={<CategoryPage />} />
          <Route path="/rreth-nesh" element={<About />} />
          <Route path="/autore/:slug" element={<AuthorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <StickyNewsletter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
