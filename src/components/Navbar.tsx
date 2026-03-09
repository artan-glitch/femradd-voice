import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { categoryLabels } from "@/data/articles";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
        <Link
          to="/"
          className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground"
          aria-label="FemraDD — Kthehu në faqen kryesore"
        >
          Femra<span className="text-primary">DD</span>
        </Link>

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
        <div className="hidden lg:flex items-center gap-3">
          <button
            aria-label="Kërko"
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            to="/#newsletter"
            className="bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Abonohu
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "Mbyll menunë" : "Hap menunë"}
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
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
              to="/#newsletter"
              onClick={() => setOpen(false)}
              className="bg-primary text-primary-foreground text-center font-medium px-5 py-3 rounded-full mt-2"
            >
              Abonohu
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
