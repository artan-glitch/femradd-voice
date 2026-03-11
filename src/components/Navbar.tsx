import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { categoryLabels } from "@/data/articles";
import SearchModal from "@/components/SearchModal";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

const navCategories = [
  { slug: "kulture", label: categoryLabels.kulture },
  { slug: "dashuri", label: categoryLabels.dashuri },
  { slug: "grate-shqiptare", label: categoryLabels["grate-shqiptare"] },
  { slug: "lifestyle", label: categoryLabels.lifestyle },
  { slug: "argetim", label: categoryLabels.argetim },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
