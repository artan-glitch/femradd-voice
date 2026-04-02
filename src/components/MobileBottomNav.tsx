import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Grid3X3, Bookmark, Moon, Sun } from "lucide-react";

export default function MobileBottomNav() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 50 || y < lastScroll.current);
      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2 px-4 safe-area-bottom">
        <Link to="/" className={`flex flex-col items-center gap-0.5 p-1.5 ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Ballina</span>
        </Link>
        <Link to="/artikuj" className={`flex flex-col items-center gap-0.5 p-1.5 ${isActive("/artikuj") ? "text-primary" : "text-muted-foreground"}`}>
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Kërko</span>
        </Link>
        <Link to="/ruajturat" className={`flex flex-col items-center gap-0.5 p-1.5 ${isActive("/ruajturat") ? "text-primary" : "text-muted-foreground"}`}>
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium">Ruajturat</span>
        </Link>
        <button onClick={toggleDark} className="flex flex-col items-center gap-0.5 p-1.5 text-muted-foreground">
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-[10px] font-medium">{dark ? "Dritë" : "Errët"}</span>
        </button>
      </div>
    </nav>
  );
}
