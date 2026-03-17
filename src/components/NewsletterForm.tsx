import { useState } from "react";
import { toast } from "sonner";

interface Props {
  variant?: "hero" | "inline" | "footer" | "sticky";
}

export default function NewsletterForm({ variant = "inline" }: Props) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Ju lutem shkruani një email të vlefshëm.");
      return;
    }
    toast.success("Faleminderit! Do të merrni email-in e parë së shpejti.");
    setEmail("");
  };

  if (variant === "hero") {
    return (
      <section id="newsletter" className="bg-primary text-white" aria-label="Abonohu në newsletter">
        <div className="container py-10 md:py-14 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
            Lajmet më të mira për gratë shqiptare
          </h2>
          <p className="text-sm md:text-base text-white/80 mb-6 max-w-lg mx-auto">
            Çdo javë në inbox-in tënd — kulturë, dashuri, lifestyle dhe frymëzim.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="hero-email" className="sr-only">Email</label>
            <input
              id="hero-email"
              type="email"
              placeholder="email@shembull.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-white text-primary font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Abonohu tani
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="footer-email" className="sr-only">Email</label>
        <input
          id="footer-email"
          type="email"
          placeholder="email@shembull.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 text-sm"
          required
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Abonohu
        </button>
      </form>
    );
  }

  if (variant === "sticky") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <label htmlFor="sticky-email" className="sr-only">Email</label>
        <input
          id="sticky-email"
          type="email"
          placeholder="email@shembull.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-48 md:w-56"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Abonohu
        </button>
      </form>
    );
  }

  // inline
  return (
    <section className="bg-muted rounded-2xl p-8 md:p-12 text-center" aria-label="Abonohu në newsletter">
      <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 text-foreground">
        Mos humb asnjë artikull
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Abonohu dhe merr artikujt më të mirë çdo javë direkt në inbox-in tënd.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <label htmlFor="inline-email" className="sr-only">Email</label>
        <input
          id="inline-email"
          type="email"
          placeholder="email@shembull.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Abonohu
        </button>
      </form>
    </section>
  );
}
