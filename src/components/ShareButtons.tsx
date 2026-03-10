import { useState } from "react";
import { Share2, Facebook, Twitter, Link as LinkIcon, Check } from "lucide-react";

interface Props {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const pageUrl = url || window.location.href;

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`, "_blank", "width=600,height=400");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: pageUrl });
      } catch {}
    } else {
      copyLink();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const btnClass = "p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground";

  return (
    <div className="flex gap-1.5">
      <button onClick={shareNative} aria-label="Ndaj" className={btnClass} title="Ndaj">
        <Share2 className="w-4 h-4" />
      </button>
      <button onClick={shareOnFacebook} aria-label="Facebook" className={btnClass} title="Ndaj në Facebook">
        <Facebook className="w-4 h-4" />
      </button>
      <button onClick={shareOnTwitter} aria-label="Twitter" className={btnClass} title="Ndaj në Twitter">
        <Twitter className="w-4 h-4" />
      </button>
      <button onClick={copyLink} aria-label="Kopjo linkun" className={btnClass} title="Kopjo linkun">
        {copied ? <Check className="w-4 h-4 text-accent" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  );
}
