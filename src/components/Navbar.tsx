import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { navCategories, moreCategories } from "@/data/articles";
import SearchModal from "@/components/SearchModal";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd+K / Ctrl+K shortcut to open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!moreOpen) return;
    const onClick = () => setMoreOpen(false);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [moreOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Navigimi kryesor"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-nav"
            : "bg-background"
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo size="text-2xl md:text-3xl" />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/kategori/${cat.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.label}
              </Link>
            ))}

            {/* "Më shumë" dropdown */}
            {moreCategories.length > 0 && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoreOpen(!moreOpen);
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Më shumë
                  <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>
                {moreOpen && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-lg py-2 animate-fade-in z-50">
                    {moreCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/kategori/${cat.slug}`}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Kërko (Ctrl+K)"
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <Link
              to="/rreth-nesh"
              className="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity ml-2"
            >
              Rreth Nesh
            </Link>
          </div>

          {/* Mobile right */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Kërko"
              className="p-2 text-foreground"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button
              aria-label={open ? "Mbyll menunë" : "Hap menunë"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="p-2 text-foreground"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div id="mobile-menu" role="navigation" aria-label="Navigimi për celularë" className="lg:hidden border-t border-border bg-background animate-fade-in">
            <div className="container py-4 flex flex-col gap-3">
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/kategori/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground py-2 border-b border-border last:border-0"
                >
                  {cat.label}
                </Link>
              ))}
              {moreCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/kategori/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-muted-foreground py-2 border-b border-border last:border-0"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                to="/rreth-nesh"
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground text-center font-medium px-5 py-3 rounded-full mt-2"
              >
                Rreth Nesh
              </Link>
            </div>
          </div>
        )}
      </nav>

      <SearchModal open={searchOpen} onClose={closeSearch} />
    </>
  );
}
