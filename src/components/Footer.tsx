import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Instagram, Facebook, Youtube } from "lucide-react";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/femradd", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com/femradd", icon: Facebook },
  { label: "YouTube", href: "https://youtube.com/@femradd", icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="bg-[hsl(220,20%,14%)] dark:bg-[hsl(220,18%,8%)] text-[hsl(36,33%,97%)]" role="contentinfo">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <Logo size="text-2xl" variant="light" />
            <p className="mt-3 text-sm leading-relaxed opacity-70">
              Revista online për gratë e reja shqiptare. Kulturë, dashuri,
              lifestyle dhe argëtim — frymëzim çdo ditë.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center opacity-60 hover:opacity-100 hover:border-white/50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategoritë</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/kategori/kulture" className="hover:opacity-100 hover:font-semibold transition-all">Kulturë</Link></li>
              <li><Link to="/kategori/dashuri" className="hover:opacity-100 hover:font-semibold transition-all">Dashuri & Takime</Link></li>
              <li><Link to="/kategori/grate-shqiptare" className="hover:opacity-100 hover:font-semibold transition-all">Gratë Shqiptare</Link></li>
              <li><Link to="/kategori/lifestyle" className="hover:opacity-100 hover:font-semibold transition-all">Lifestyle</Link></li>
              <li><Link to="/kategori/argetim" className="hover:opacity-100 hover:font-semibold transition-all">Argëtim</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Faqet</h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/rreth-nesh" className="hover:opacity-100 hover:font-semibold transition-all">Rreth Nesh</Link></li>
              <li><Link to="/redaksia" className="hover:opacity-100 hover:font-semibold transition-all">Redaksia</Link></li>
              <li><Link to="/kontakt" className="hover:opacity-100 hover:font-semibold transition-all">Kontakt</Link></li>
              <li><Link to="/privatesia" className="hover:opacity-100 hover:font-semibold transition-all">Politika e Privatësisë</Link></li>
              <li><Link to="/kushtet" className="hover:opacity-100 hover:font-semibold transition-all">Kushtet e Përdorimit</Link></li>
            </ul>
          </div>


        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs opacity-50">
          © {new Date().getFullYear()} FemraDD. Të gjitha të drejtat e rezervuara.
        </div>
      </div>
    </footer>
  );
}
