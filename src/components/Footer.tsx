import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground" role="contentinfo">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="font-serif text-2xl font-bold">
              Femra<span className="text-primary">DD</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed opacity-70">
              Revista online për gratë e reja shqiptare. Kulturë, dashuri,
              lifestyle dhe argëtim — frymëzim çdo ditë.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://instagram.com/femradd" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-60 hover:opacity-100 transition-opacity">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@femradd" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="opacity-60 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13v-3.5a6.37 6.37 0 0 0-.88-.07 6.26 6.26 0 0 0 0 12.52 6.27 6.27 0 0 0 6.27-6.27V8.55a8.24 8.24 0 0 0 3.83.96V6.09a4.83 4.83 0 0 1-3.77.6Z"/></svg>
              </a>
              <a href="https://facebook.com/femradd" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-60 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Kategoritë</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/kategori/kulture" className="hover:opacity-100 transition-opacity">Kulturë</Link></li>
              <li><Link to="/kategori/dashuri" className="hover:opacity-100 transition-opacity">Dashuri & Takime</Link></li>
              <li><Link to="/kategori/grate-shqiptare" className="hover:opacity-100 transition-opacity">Gratë Shqiptare</Link></li>
              <li><Link to="/kategori/lifestyle" className="hover:opacity-100 transition-opacity">Lifestyle</Link></li>
              <li><Link to="/kategori/argetim" className="hover:opacity-100 transition-opacity">Argëtim</Link></li>
              <li><Link to="/rreth-nesh" className="hover:opacity-100 transition-opacity">Rreth Nesh</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Më shumë</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/rreth-nesh" className="hover:opacity-100 transition-opacity">Rreth Nesh</Link></li>
              <li><a href="https://instagram.com/femradd" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Instagram</a></li>
              <li><a href="https://tiktok.com/@femradd" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">TikTok</a></li>
              <li><a href="https://facebook.com/femradd" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} FemraDD. Të gjitha të drejtat e rezervuara.
        </div>
      </div>
    </footer>
  );
}
