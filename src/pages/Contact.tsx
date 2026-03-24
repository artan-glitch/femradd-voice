import { useState, type FormEvent } from "react";
import { Send, CheckCircle, Mail, Users, Megaphone } from "lucide-react";
import heroImg from "@/assets/hero-contact.webp";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHead from "@/components/PageHead";
import FadeIn from "@/components/FadeIn";

export default function Contact() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          from_name: "FemraDD Kontakt",
          subject: `[FemraDD] ${formData.subject}`,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: "",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFormState("sent");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      setFormState("idle");
      alert("Diçka shkoi keq. Ju lutemi provoni përsëri.");
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Kontakt — FemraDD",
    description: "Na kontaktoni për bashkëpunime, sugjerime ose çdo pyetje tjetër.",
    inLanguage: "sq",
    url: "https://www.femradd.com/kontakt",
  };

  return (
    <main id="main-content">
      <PageHead
        title="Kontakt"
        description="Na kontaktoni për bashkëpunime, sugjerime ose çdo pyetje tjetër."
        url="https://www.femradd.com/kontakt"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero image */}
      <div className="w-full aspect-[3/1] max-h-[340px] overflow-hidden">
        <img
          src={heroImg}
          alt="Na kontaktoni — FemraDD"
          className="w-full h-full object-cover"
          width={1200}
          height={400}
        />
      </div>

      <div className="container max-w-3xl py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Ballina", href: "/" },
            { label: "Kontakt" },
          ]}
        />

        <FadeIn>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Kontakt
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Keni një pyetje, sugjerim, ose dëshironi të bashkëpunoni me ne? Na shkruani dhe do t'ju përgjigjemi sa më shpejt.
          </p>
        </FadeIn>

        {/* Contact info cards */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Pyetje të përgjithshme</p>
                <p className="text-xs text-muted-foreground mt-0.5">Përgjigje brenda 24-48 orëve</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Bashkëpunime</p>
                <p className="text-xs text-muted-foreground mt-0.5">Gazetare & krijuese përmbajtjeje</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Reklamim</p>
                <p className="text-xs text-muted-foreground mt-0.5">Partneritete & sponsorizime</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Contact form */}
        <FadeIn>
          <div className="bg-card rounded-xl p-6 md:p-8 shadow-card mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Na shkruani
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Plotësoni formularin dhe do t'ju përgjigjemi brenda 24-48 orëve.
            </p>

            {formState === "sent" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Mesazhi u dërgua!
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Faleminderit që na shkruat. Do t'ju përgjigjemi sa më shpejt të jetë e mundur.
                </p>
                <button
                  type="button"
                  onClick={() => setFormState("idle")}
                  className="mt-6 text-primary font-medium text-sm hover:underline"
                >
                  Dërgo një mesazh tjetër
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot spam protection — hidden from real users */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                      Emri juaj
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="p.sh. Elira Hoxha"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elira@shembull.com"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
                    Subjekti
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none"
                  >
                    <option value="" disabled>Zgjidhni subjektin</option>
                    <option value="pyetje">Pyetje e përgjithshme</option>
                    <option value="bashkepunim">Bashkëpunim editorial</option>
                    <option value="reklamim">Reklamim & Partneritete</option>
                    <option value="sugjerim">Sugjerim artikulli</option>
                    <option value="tjeter">Tjetër</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                    Mesazhi
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Shkruani mesazhin tuaj këtu..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y min-h-[120px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === "sending" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Duke dërguar...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Dërgo mesazhin
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </FadeIn>

        {/* Additional info */}
        <FadeIn>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold text-foreground">Bashkëpunime</h2>
            <p>
              Jeni gazetare, shkrimtare, ose krijuese përmbajtjeje? Ne gjithmonë kërkojmë zëra të rinj dhe perspektiva autentike. Plotësoni formularin më lart me punën tuaj dhe do t'ju kontaktojmë.
            </p>

            <h2 className="text-2xl font-bold text-foreground pt-4">Reklamim</h2>
            <p>
              Për mundësi reklamimi dhe partneritete, na shkruani përmes formularit më lart me detajet e propozimit tuaj.
            </p>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
