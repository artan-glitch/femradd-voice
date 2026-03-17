import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Facebook } from "lucide-react";
import type { Author } from "@/data/articles";

const socialIcon = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
};

const socialLabel: Record<string, string> = {
  instagram: "Instagram",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  facebook: "Facebook",
};

export default function AuthorBio({ author }: { author: Author }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border my-10">
      <Link to={`/autore/${author.slug}`} className="shrink-0">
        <img
          src={author.avatar}
          alt={author.name}
          loading="lazy"
          className="w-14 h-14 rounded-full object-cover"
          width={56}
          height={56}
        />
      </Link>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Shkruar nga</p>
        <Link to={`/autore/${author.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors">
          {author.name}
        </Link>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{author.bio}</p>

        {/* Social media links for E-E-A-T */}
        {author.socials && author.socials.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            {author.socials.map((social) => {
              const Icon = socialIcon[social.platform];
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${author.name} në ${socialLabel[social.platform]}`}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
